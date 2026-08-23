"""Collect live corridor news signals from public RSS feeds without an API key.

This is a fallback/live complement to GDELT DOC. It intentionally uses article
counts and transparent keyword rules rather than pretending RSS has a native
sentiment score. Output matches the GDELT live schema so downstream scripts can
consume either source.
"""

from __future__ import annotations

import argparse
import re
import time
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
import requests

FEEDS = {
    "bbc_world": "https://feeds.bbci.co.uk/news/world/rss.xml",
    "aljazeera": "https://www.aljazeera.com/xml/rss/all.xml",
    "guardian_world": "https://www.theguardian.com/world/rss",
}
CORRIDORS = {
    "hormuz": {
        "keywords": ["hormuz", "strait of hormuz"],
        "conflict_keywords": ["attack", "strike", "blockade", "seize", "tanker", "missile", "sanction", "military"],
    },
    "red_sea": {
        "keywords": ["red sea", "houthi", "bab el-mandeb"],
        "conflict_keywords": ["attack", "strike", "missile", "ship", "tanker", "blockade", "military"],
    },
    "iran_supply": {
        "keywords": ["iran oil", "iran crude", "iran export", "iran sanctions"],
        "conflict_keywords": ["sanction", "attack", "strike", "blockade", "military", "export"],
    },
}


def _text(element: ET.Element | None) -> str:
    return " ".join(element.itertext()).strip() if element is not None else ""


def _parse_items(xml_bytes: bytes) -> list[dict[str, str]]:
    root = ET.fromstring(xml_bytes)
    items = root.findall(".//item")
    if not items:
        items = root.findall(".//{http://www.w3.org/2005/Atom}entry")
    records = []
    for item in items:
        title = _text(item.find("title")) or _text(item.find("{http://www.w3.org/2005/Atom}title"))
        description = _text(item.find("description")) or _text(item.find("{http://www.w3.org/2005/Atom}summary"))
        published = _text(item.find("pubDate")) or _text(item.find("{http://www.w3.org/2005/Atom}published"))
        records.append({"text": f"{title} {description}".lower(), "published": published})
    return records


def _date(value: str) -> pd.Timestamp:
    parsed = pd.to_datetime(value, errors="coerce", utc=True)
    return parsed if not pd.isna(parsed) else pd.Timestamp.now(tz="UTC")


def fetch_rss_signals(start: str, end: str, timeout: int = 30) -> pd.DataFrame:
    start_date, end_date = pd.Timestamp(start, tz="UTC"), pd.Timestamp(end, tz="UTC") + pd.Timedelta(days=1)
    session = requests.Session()
    session.headers.update({"User-Agent": "Fairway-Energy-Resilience/0.1 RSS research prototype"})
    articles = []
    for name, url in FEEDS.items():
        response = session.get(url, timeout=timeout)
        response.raise_for_status()
        for item in _parse_items(response.content):
            published = _date(item["published"])
            if start_date <= published < end_date:
                articles.append({"source": name, "date": published.normalize(), "text": item["text"]})
        time.sleep(1)

    rows = []
    for corridor, config in CORRIDORS.items():
        corridor_articles = [article for article in articles if any(keyword in article["text"] for keyword in config["keywords"])]
        for date in pd.date_range(start_date.normalize(), (end_date - pd.Timedelta(days=1)).normalize(), freq="D", tz="UTC"):
            daily = [article for article in corridor_articles if article["date"] == date]
            conflict_count = sum(any(keyword in article["text"] for keyword in config["conflict_keywords"]) for article in daily)
            rows.append({
                "date": date.date().isoformat(),
                "corridor": corridor,
                "avg_tone": round(-10 * conflict_count / max(len(daily), 1), 3),
                "article_volume_pct": len(daily),
                "conflict_keyword_volume_pct": conflict_count,
                "source": "public_rss",
            })
    return pd.DataFrame(rows)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", default=(pd.Timestamp.now(tz="UTC") - pd.Timedelta(days=7)).strftime("%Y-%m-%d"))
    parser.add_argument("--end", default=pd.Timestamp.now(tz="UTC").strftime("%Y-%m-%d"))
    parser.add_argument("--output", type=Path, default=Path("data/rss_live_signal.csv"))
    args = parser.parse_args()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    result = fetch_rss_signals(args.start, args.end)
    result.to_csv(args.output, index=False)
    print(f"Saved {len(result)} rows to {args.output}")
    print(f"Feeds: {', '.join(FEEDS)}")
