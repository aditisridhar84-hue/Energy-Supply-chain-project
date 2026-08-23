"""Apply independently sourced disruption-window labels to feature data."""

from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd

KNOWN_DISRUPTIONS = [
    ("hormuz", "2019-05-12", "2019-07-21", "2019 Hormuz tanker campaign; dates cover Fujairah sabotage, Gulf of Oman attacks, and Stena Impero seizure. Sources: UK Government, CNN, Wikipedia."),
    ("red_sea", "2023-10-19", "2024-07-19", "2023-2024 Houthi attacks on Red Sea shipping. Sources: Wikipedia timeline, Wilson Center, Washington Institute."),
    ("hormuz", "2026-02-28", None, "2026 Strait of Hormuz crisis, ongoing at collection time. Source: cited crisis timeline and independent reporting."),
]


def label_disruptions(frame: pd.DataFrame, lead_days: int = 5, dataset_end: str | None = None) -> pd.DataFrame:
    required = {"date", "corridor"}
    missing = required - set(frame.columns)
    if missing:
        raise ValueError(f"Feature file missing columns: {', '.join(sorted(missing))}")
    result = frame.copy()
    result["date"] = pd.to_datetime(result["date"])
    result["disruption_label"] = 0
    result["disruption_label_source"] = ""
    for corridor, start, end, source in KNOWN_DISRUPTIONS:
        start_date = pd.Timestamp(start) - pd.Timedelta(days=lead_days)
        end_date = pd.Timestamp(end) if end else pd.Timestamp(dataset_end or result["date"].max())
        mask = result["corridor"].eq(corridor) & result["date"].between(start_date, end_date)
        result.loc[mask, "disruption_label"] = 1
        result.loc[mask, "disruption_label_source"] = source
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=Path("data/corridor_daily_features.csv"))
    parser.add_argument("--output", type=Path, default=Path("data/corridor_daily_features_labeled.csv"))
    parser.add_argument("--lead-days", type=int, default=5)
    parser.add_argument("--dataset-end")
    args = parser.parse_args()
    if args.lead_days < 0:
        raise ValueError("lead-days cannot be negative")
    labeled = label_disruptions(pd.read_csv(args.input, parse_dates=["date"]), args.lead_days, args.dataset_end)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    labeled.to_csv(args.output, index=False)
    print(labeled.groupby("corridor")["disruption_label"].value_counts())
    print(f"Saved {len(labeled)} rows to {args.output}")
