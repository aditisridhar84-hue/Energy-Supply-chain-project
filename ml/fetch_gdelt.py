"""Pull daily live corridor signals from the free GDELT DOC 2.0 API."""

from __future__ import annotations

import argparse
import time
from pathlib import Path

import pandas as pd
import requests

GDELT_DOC_API = "https://api.gdeltproject.org/api/v2/doc/doc"
REQUEST_HEADERS = {"User-Agent": "Fairway-Energy-Resilience/0.1 research prototype"}
CORRIDORS = {
    "hormuz": {
        "base_query": "Strait of Hormuz OR Hormuz oil",
        "conflict_query": "(Hormuz) AND (attack OR strike OR seize OR blockade OR sanctions OR tanker)",
    },
    "red_sea": {
        "base_query": "Red Sea shipping OR Red Sea oil tanker",
        "conflict_query": "(Red Sea) AND (attack OR missile OR Houthi OR strike OR blockade)",
    },
    "iran_supply": {
        "base_query": "Iran oil exports OR Iran crude",
        "conflict_query": "(Iran) AND (sanctions OR strike OR seize OR military OR blockade)",
    },
}


def _timeline(query: str, mode: str, start: str, end: str, retries: int = 5) -> pd.DataFrame:
    params = {"query": query, "mode": mode, "format": "json", "startdatetime": start, "enddatetime": end}
    for attempt in range(retries + 1):
        response = requests.get(GDELT_DOC_API, params=params, headers=REQUEST_HEADERS, timeout=45)
        if response.status_code != 429:
            response.raise_for_status()
            break
        if attempt == retries:
            response.raise_for_status()
        retry_after = response.headers.get("Retry-After")
        delay = float(retry_after) if retry_after and retry_after.isdigit() else max(10, 2 ** attempt * 5)
        print(f"GDELT rate limit reached; retrying in {delay:g}s")
        time.sleep(delay)
    rows = []
    for series in response.json().get("timeline", []):
        rows.extend({"date": point["date"][:8], "value": point["value"]} for point in series.get("data", []))
    if not rows:
        return pd.DataFrame(columns=["date", "value"])
    frame = pd.DataFrame(rows)
    frame["date"] = pd.to_datetime(frame["date"], format="%Y%m%d")
    return frame.groupby("date", as_index=False)["value"].mean()


def fetch_corridor_signal(corridor: str, start: str, end: str, pause_seconds: float = 10.0) -> pd.DataFrame:
    config = CORRIDORS[corridor]
    start_api = start.replace("-", "") + "000000"
    end_api = end.replace("-", "") + "235959"
    tone = _timeline(config["base_query"], "timelinetone", start_api, end_api).rename(columns={"value": "avg_tone"})
    time.sleep(pause_seconds)
    volume = _timeline(config["base_query"], "timelinevol", start_api, end_api).rename(columns={"value": "article_volume_pct"})
    time.sleep(pause_seconds)
    conflict = _timeline(config["conflict_query"], "timelinevol", start_api, end_api).rename(columns={"value": "conflict_keyword_volume_pct"})
    result = tone.merge(volume, on="date", how="outer").merge(conflict, on="date", how="outer")
    result["corridor"] = corridor
    return result.sort_values("date").reset_index(drop=True)


def fetch_all(start: str, end: str, output: Path, corridors: list[str] | None = None) -> pd.DataFrame:
    selected_corridors = corridors or list(CORRIDORS)
    unknown = sorted(set(selected_corridors) - set(CORRIDORS))
    if unknown:
        raise ValueError(f"Unknown corridor(s): {', '.join(unknown)}")
    frames = []
    for corridor in selected_corridors:
        print(f"Fetching {corridor}: {start} to {end}")
        frames.append(fetch_corridor_signal(corridor, start, end))
    result = pd.concat(frames, ignore_index=True)
    result.to_csv(output, index=False)
    print(f"Saved {len(result)} rows to {output}")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", default=(pd.Timestamp.utcnow() - pd.Timedelta(days=30)).strftime("%Y-%m-%d"))
    parser.add_argument("--end", default=pd.Timestamp.utcnow().strftime("%Y-%m-%d"))
    parser.add_argument("--output", type=Path, default=Path("data/gdelt_live_signal.csv"))
    parser.add_argument("--corridor", action="append", choices=sorted(CORRIDORS), help="Fetch one or more corridors")
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    fetch_all(args.start, args.end, args.output, args.corridor)
