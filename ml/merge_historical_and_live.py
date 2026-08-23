"""Normalize and combine BigQuery historical and DOC API GDELT signals."""

from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

SIGNAL_COLUMNS = ["avg_tone", "article_volume_pct", "conflict_keyword_volume_pct"]


def normalize_historical(frame: pd.DataFrame) -> pd.DataFrame:
    required = {"date", "corridor", "avg_tone", "article_count", "goldstein_weighted_sum"}
    missing = required - set(frame.columns)
    if missing:
        raise ValueError(f"Historical file missing columns: {', '.join(sorted(missing))}")
    outputs = []
    for corridor, group in frame.groupby("corridor", sort=False):
        group = group.copy()
        article_max = group["article_count"].max()
        goldstein_max = group["goldstein_weighted_sum"].abs().max()
        group["article_volume_pct"] = group["article_count"].fillna(0).div(article_max if article_max > 0 else 1).mul(100)
        group["conflict_keyword_volume_pct"] = group["goldstein_weighted_sum"].abs().fillna(0).div(goldstein_max if goldstein_max > 0 else 1).mul(100)
        outputs.append(group[["date", "corridor", *SIGNAL_COLUMNS]])
    return pd.concat(outputs, ignore_index=True)


def merge_sources(historical_csv: Path, live_csv: Path | None = None) -> pd.DataFrame:
    historical = pd.read_csv(historical_csv, parse_dates=["date"])
    historical = normalize_historical(historical).assign(source="bigquery_historical", source_priority=0)
    frames = [historical]
    if live_csv is not None and live_csv.exists():
        live = pd.read_csv(live_csv, parse_dates=["date"])
        live = live[["date", "corridor", *SIGNAL_COLUMNS]].assign(source="doc_api_live", source_priority=1)
        frames.append(live)
    combined = pd.concat(frames, ignore_index=True)
    combined = combined.sort_values(["date", "corridor", "source_priority"])
    combined = combined.drop_duplicates(["date", "corridor"], keep="last")
    return combined.drop(columns="source_priority").sort_values(["corridor", "date"]).reset_index(drop=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--historical", type=Path, default=Path("data/gdelt_historical_backfill.csv"))
    parser.add_argument("--live", type=Path, default=Path("data/gdelt_live_signal.csv"))
    parser.add_argument("--output", type=Path, default=Path("data/gdelt_signal_full.csv"))
    args = parser.parse_args()
    live_path = args.live if args.live.exists() else None
    if live_path is None:
        print(f"Live GDELT file not found at {args.live}; continuing with historical data only")
    merged = merge_sources(args.historical, live_path)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    merged.to_csv(args.output, index=False)
    print(merged.groupby("corridor")["date"].agg(["min", "max", "count"]))
