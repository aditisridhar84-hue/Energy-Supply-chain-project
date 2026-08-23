"""FastAPI service for Fairway risk, scenario, and procurement endpoints."""

from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from ml.risk_score import composite_risk_score, evaluate_alert

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
ARTIFACT_DIR = ROOT / "ml" / "artifacts"

app = FastAPI(title="Fairway Energy Resilience API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


class ScenarioRequest(BaseModel):
    scenario: str = Field(default="HORMUZ")
    severity_pct: float = Field(default=70, ge=0, le=100)


class RiskRequest(BaseModel):
    event_intensity: float = Field(ge=0, le=100)
    tone_severity: float = Field(ge=0, le=100)
    news_volume_spike: float = Field(ge=0, le=100)
    price_volatility: float = Field(ge=0, le=100)
    recent_scores: list[float] = Field(default_factory=list)


SCENARIOS = {
    "NORMAL": {"hormuz": 0, "red_sea": 0, "price": 0, "gap": 0},
    "HORMUZ": {"hormuz": 100, "red_sea": 10, "price": 73, "gap": 29},
    "RED_SEA": {"hormuz": 5, "red_sea": 100, "price": 22, "gap": 6},
    "SEVERE_MULTI": {"hormuz": 95, "red_sea": 90, "price": 95, "gap": 38},
}

SUPPLIERS = [
    {"supplier_id": "russia", "supplier": "Russia / CIS", "route": "Non-Hormuz", "risk": "LOW", "availability": "Alternative available", "risk_pct": 15, "capacity_pct": 50, "cost_premium_pct": 4, "transit_days": 24},
    {"supplier_id": "united-states", "supplier": "United States", "route": "Non-Hormuz", "risk": "LOW", "availability": "Alternative available", "risk_pct": 8, "capacity_pct": 10, "cost_premium_pct": 8, "transit_days": 35},
    {"supplier_id": "latin-america", "supplier": "Latin America", "route": "Non-Hormuz", "risk": "LOW", "availability": "Alternative available", "risk_pct": 10, "capacity_pct": 11, "cost_premium_pct": 7, "transit_days": 32},
    {"supplier_id": "uae", "supplier": "UAE", "route": "Partial Hormuz bypass", "risk": "MEDIUM", "availability": "Alternative available", "risk_pct": 45, "capacity_pct": 8, "cost_premium_pct": 5, "transit_days": 12},
]


def _data_files() -> dict[str, bool]:
    return {
        "historical_gdelt": (DATA_DIR / "gdelt_historical_backfill.csv").exists(),
        "live_gdelt": (DATA_DIR / "gdelt_live_signal.csv").exists(),
        "live_rss": (DATA_DIR / "rss_live_signal.csv").exists(),
        "prices": (DATA_DIR / "brent_prices_daily.csv").exists(),
        "trained_model": (ARTIFACT_DIR / "risk_model.joblib").exists(),
    }


def _scenario_result(request: ScenarioRequest) -> dict:
    values = SCENARIOS.get(request.scenario.upper(), SCENARIOS["NORMAL"])
    factor = request.severity_pct / 100
    price_impact = round(values["price"] * factor, 1)
    return {
        "scenario": request.scenario.upper() if request.scenario.upper() in SCENARIOS else "NORMAL",
        "severity_pct": request.severity_pct,
        "hormuz_disruption_pct": round(values["hormuz"] * factor),
        "red_sea_disruption_pct": round(values["red_sea"] * factor),
        "price_impact_pct": price_impact,
        "supply_gap_pct": round(values["gap"] * factor, 1),
        "price_usd_per_bbl": round(69 * (1 + price_impact / 100), 1),
        "refinery_risk": "CRITICAL" if values["gap"] * factor >= 25 else "HIGH" if values["gap"] * factor >= 15 else "MEDIUM" if values["gap"] * factor >= 5 else "LOW",
        "source": "modelled scenario using transparent formula",
    }


@app.get("/api/health")
def health() -> dict:
    files = _data_files()
    live_signal = files["live_gdelt"] or files["live_rss"]
    return {"status": "ok", "service": "fairway-api", "data": files, "mode": "live" if live_signal else "demo-fallback"}


@app.post("/api/risk/score")
def score_risk(request: RiskRequest) -> dict:
    raw = composite_risk_score(request.event_intensity, request.tone_severity, request.news_volume_spike, request.price_volatility)
    recent = request.recent_scores or [raw]
    alert = evaluate_alert(raw, recent)
    return {"risk_score": raw, "smoothed_score": alert.smoothed_score, "reroute_required": alert.reroute_required, "reason": alert.reason, "model": "transparent-fallback"}


@app.post("/api/scenarios/simulate")
def simulate(request: ScenarioRequest) -> dict:
    return _scenario_result(request)


@app.get("/api/recommendations")
def recommendations(hormuz_disruption_pct: float = 55) -> dict:
    if not 0 <= hormuz_disruption_pct <= 100:
        raise HTTPException(status_code=400, detail="hormuz_disruption_pct must be between 0 and 100")
    ranked = []
    for supplier in SUPPLIERS:
        safety = 100 - supplier["risk_pct"]
        capacity = min(supplier["capacity_pct"], 30)
        cost = max(0, 100 - supplier["cost_premium_pct"] * 5)
        transit = max(0, 100 - supplier["transit_days"] * 2)
        score = round(0.35 * safety + 0.25 * capacity + 0.20 * cost + 0.20 * transit)
        ranked.append({**supplier, "confidence": score, "suitability_score": score, "reason": "Ranked by route safety, available capacity, cost premium, and transit time."})
    ranked.sort(key=lambda item: item["suitability_score"], reverse=True)
    return {"hormuz_disruption_pct": hormuz_disruption_pct, "recommendations": ranked[:3], "model": "transparent-ranking"}


@app.get("/api/model/metrics")
def model_metrics() -> dict:
    metrics_path = ARTIFACT_DIR / "metrics.json"
    if not metrics_path.exists():
        return {"available": False, "message": "Train a model to publish evaluation metrics."}
    return {"available": True, **json.loads(metrics_path.read_text(encoding="utf-8"))}
