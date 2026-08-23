"""Build daily corridor features from merged GDELT and EIA files."""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import pandas as pd

FEATURE_COLUMNS = ["event_intensity", "tone_severity", "news_volume_spike", "price_volatility"]


def rolling_zscore_to_100(series: pd.Series, window: int = 90) -> pd.Series:
    mean = series.rolling(window, min_periods=10).mean()
    std = series.rolling(window, min_periods=10).std().replace(0, np.nan)
    zscore = (series - mean).div(std)
    return (50 + zscore.clip(-3, 3).mul(50 / 3)).fillna(50)


def rolling_percentile_to_100(series: pd.Series, window: int = 730) -> pd.Series:
    def percentile(values: pd.Series) -> float:
        return float(values.rank(pct=True).iloc[-1] * 100) if len(values) >= 10 else 50.0
    return series.rolling(window, min_periods=10).apply(percentile, raw=False).fillna(50)


def build_daily_features(gdelt_csv: Path, price_csv: Path, smooth_days: int = 3) -> pd.DataFrame:
    if smooth_days < 1:
        raise ValueError("smooth_days must be at least 1")
    gdelt = pd.read_csv(gdelt_csv, parse_dates=["date"])
    prices = pd.read_csv(price_csv, parse_dates=["date"])
    required_gdelt = {"date", "corridor", "avg_tone", "article_volume_pct", "conflict_keyword_volume_pct"}
    missing = required_gdelt - set(gdelt.columns)
    if missing:
        raise ValueError(f"GDELT file missing columns: {', '.join(sorted(missing))}")
    if "price_volatility" not in prices:
        raise ValueError("Price file must contain price_volatility; run fetch_eia_prices.py first")

    frames = []
    for corridor, group in gdelt.groupby("corridor", sort=False):
        group = group.sort_values("date").copy()
        group["event_intensity"] = rolling_percentile_to_100(group["conflict_keyword_volume_pct"].fillna(0))
        group["tone_severity"] = ((-group["avg_tone"].fillna(0)).clip(-10, 10) + 10) * 5
        group["news_volume_spike"] = rolling_zscore_to_100(group["article_volume_pct"].fillna(0))
        group = group.merge(prices[["date", "price_volatility"]], on="date", how="left")
        group["price_volatility"] = group["price_volatility"].ffill().bfill().fillna(50)
        group[FEATURE_COLUMNS] = group[FEATURE_COLUMNS].rolling(smooth_days, min_periods=1).mean().round(2)
        frames.append(group[["date", "corridor", *FEATURE_COLUMNS]])
    return pd.concat(frames, ignore_index=True).sort_values(["corridor", "date"]).reset_index(drop=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--gdelt", type=Path, default=Path("data/gdelt_signal_full.csv"))
    parser.add_argument("--prices", type=Path, default=Path("data/brent_prices_daily.csv"))
    parser.add_argument("--output", type=Path, default=Path("data/corridor_daily_features.csv"))
    args = parser.parse_args()
    features = build_daily_features(args.gdelt, args.prices)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    features.to_csv(args.output, index=False)
    print(f"Saved {len(features)} rows to {args.output}")
