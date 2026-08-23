"""Fetch daily Brent prices from EIA and calculate normalized volatility."""

from __future__ import annotations

import argparse
import os
from pathlib import Path

import numpy as np
import pandas as pd
import requests

EIA_API_BASE = "https://api.eia.gov/v2/petroleum/pri/spt/data/"


def fetch_brent_prices(start: str, end: str, api_key: str | None = None) -> pd.DataFrame:
    api_key = api_key or os.environ.get("EIA_API_KEY")
    if not api_key:
        raise ValueError("Set EIA_API_KEY. Register at https://www.eia.gov/opendata/register.php")
    response = requests.get(EIA_API_BASE, params={
        "api_key": api_key, "frequency": "daily", "data[0]": "value",
        "facets[series][]": "RBRTE", "start": start, "end": end,
        "sort[0][column]": "period", "sort[0][direction]": "asc", "length": 5000,
    }, timeout=45)
    response.raise_for_status()
    records = response.json().get("response", {}).get("data", [])
    if not records:
        raise ValueError("EIA returned no Brent records for the requested period")
    result = pd.DataFrame(records).rename(columns={"period": "date", "value": "brent_price_usd"})
    result["date"] = pd.to_datetime(result["date"], errors="coerce")
    result["brent_price_usd"] = pd.to_numeric(result["brent_price_usd"], errors="coerce")
    return result.dropna(subset=["date", "brent_price_usd"]).sort_values("date").reset_index(drop=True)


def compute_price_volatility(frame: pd.DataFrame, window: int = 5, baseline_window: int = 90) -> pd.DataFrame:
    if window < 2 or baseline_window < window:
        raise ValueError("Use window >= 2 and baseline_window >= window")
    result = frame.copy().sort_values("date")
    result["pct_change"] = result["brent_price_usd"].pct_change().mul(100)
    result["rolling_std"] = result["pct_change"].rolling(window, min_periods=2).std()
    baseline = result["rolling_std"].rolling(baseline_window, min_periods=10).max()
    result["price_volatility"] = result["rolling_std"].div(baseline.replace(0, np.nan)).mul(100).clip(0, 100)
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", default="2015-01-01")
    parser.add_argument("--end", default=pd.Timestamp.utcnow().strftime("%Y-%m-%d"))
    parser.add_argument("--output", type=Path, default=Path("data/brent_prices_daily.csv"))
    args = parser.parse_args()
    prices = compute_price_volatility(fetch_brent_prices(args.start, args.end))
    args.output.parent.mkdir(parents=True, exist_ok=True)
    prices.to_csv(args.output, index=False)
    print(f"Saved {len(prices)} rows to {args.output}")
