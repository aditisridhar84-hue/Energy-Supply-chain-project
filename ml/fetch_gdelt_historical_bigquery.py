"""Backfill daily GDELT event and tone signals through BigQuery."""

from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd
from google.cloud import bigquery

CONFLICT_CODES = ["14", "15", "17", "18", "19", "20"]
CORRIDORS = {
    "hormuz": ["Strait of Hormuz", "Hormuz"],
    "red_sea": ["Red Sea"],
    "iran_supply": ["Iran"],
}
BACKFILL_WINDOWS = [
    ("hormuz", "2019-04-01", "2019-08-15"),
    ("red_sea", "2023-09-01", "2024-08-31"),
    ("hormuz", "2026-02-01", "2026-08-22"),
]


def _validate_date(value: str) -> str:
    return pd.Timestamp(value).strftime("%Y-%m-%d")


def _keyword_sql(column: str, keywords: list[str]) -> str:
    # Keywords are constants from CORRIDORS, not user-provided SQL fragments.
    return " OR ".join(f"{column} LIKE '%{keyword.replace(chr(39), chr(39) + chr(39))}%'" for keyword in keywords)


def fetch_event_intensity(client: bigquery.Client, keywords: list[str], start: str, end: str) -> pd.DataFrame:
    query = f"""
        SELECT
          PARSE_DATE('%Y%m%d', CAST(SQLDATE AS STRING)) AS date,
          COUNT(*) AS event_count,
          SUM(GoldsteinScale) AS goldstein_weighted_sum,
          AVG(GoldsteinScale) AS avg_goldstein
        FROM `gdelt-bq.gdeltv2.events`
        WHERE SQLDATE BETWEEN @start_int AND @end_int
          AND ({_keyword_sql('ActionGeo_FullName', keywords)})
          AND EventRootCode IN UNNEST(@conflict_codes)
        GROUP BY date
        ORDER BY date
    """
    job_config = bigquery.QueryJobConfig(query_parameters=[
        bigquery.ScalarQueryParameter("start_int", "INT64", int(start.replace("-", ""))),
        bigquery.ScalarQueryParameter("end_int", "INT64", int(end.replace("-", ""))),
        bigquery.ArrayQueryParameter("conflict_codes", "STRING", CONFLICT_CODES),
    ])
    return client.query(query, job_config=job_config).to_dataframe()


def fetch_daily_tone(client: bigquery.Client, keywords: list[str], start: str, end: str) -> pd.DataFrame:
    query = f"""
        SELECT
          PARSE_DATE('%Y%m%d', SUBSTR(CAST(DATE AS STRING), 1, 8)) AS date,
          AVG(SAFE_CAST(SPLIT(V2Tone, ',')[SAFE_OFFSET(0)] AS FLOAT64)) AS avg_tone,
          COUNT(*) AS article_count
        FROM `gdelt-bq.gdeltv2.gkg`
        WHERE DATE BETWEEN @start_int AND @end_int
          AND ({_keyword_sql('V2Locations', keywords)})
        GROUP BY date
        ORDER BY date
    """
    job_config = bigquery.QueryJobConfig(query_parameters=[
        bigquery.ScalarQueryParameter("start_int", "INT64", int(start.replace("-", "") + "000000")),
        bigquery.ScalarQueryParameter("end_int", "INT64", int(end.replace("-", "") + "235959")),
    ])
    return client.query(query, job_config=job_config).to_dataframe()


def fetch_corridor(client: bigquery.Client, corridor: str, start: str, end: str) -> pd.DataFrame:
    keywords = CORRIDORS[corridor]
    events = fetch_event_intensity(client, keywords, start, end)
    tone = fetch_daily_tone(client, keywords, start, end)
    merged = events.merge(tone, on="date", how="outer")
    merged["corridor"] = corridor
    return merged.sort_values("date").reset_index(drop=True)


def fetch_all(output: Path, windows: list[tuple[str, str, str]] = BACKFILL_WINDOWS) -> pd.DataFrame:
    client = bigquery.Client()
    frames = []
    for corridor, start, end in windows:
        start, end = _validate_date(start), _validate_date(end)
        print(f"Querying {corridor}: {start} to {end}")
        frames.append(fetch_corridor(client, corridor, start, end))
    result = pd.concat(frames, ignore_index=True).sort_values(["corridor", "date"])
    output.parent.mkdir(parents=True, exist_ok=True)
    result.to_csv(output, index=False)
    print(f"Saved {len(result)} rows to {output}")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path("data/gdelt_historical_backfill.csv"))
    args = parser.parse_args()
    fetch_all(args.output)
