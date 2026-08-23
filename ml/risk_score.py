"""Transparent corridor-risk calculations shared by live and backtest workflows."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class RiskScore:
    raw_score: float
    smoothed_score: float
    reroute_required: bool
    reason: str


def composite_risk_score(
    event_intensity: float,
    tone_severity: float,
    news_volume_spike: float,
    price_volatility: float,
) -> float:
    """Return a 0-100 fallback score using the documented domain weights."""
    values = [event_intensity, tone_severity, news_volume_spike, price_volatility]
    if any(value < 0 or value > 100 for value in values):
        raise ValueError("All risk signals must be between 0 and 100")
    return round(
        0.35 * event_intensity
        + 0.25 * tone_severity
        + 0.20 * news_volume_spike
        + 0.20 * price_volatility,
        2,
    )


def evaluate_alert(raw_score: float, recent_scores: list[float]) -> RiskScore:
    """Smooth scores and trigger rerouting on sustained or sudden risk."""
    if not recent_scores:
        raise ValueError("recent_scores must contain at least the current score")
    if any(score < 0 or score > 100 for score in recent_scores):
        raise ValueError("Risk scores must be between 0 and 100")
    smoothed = round(sum(recent_scores[-3:]) / min(3, len(recent_scores)), 2)
    sustained = len(recent_scores) >= 2 and all(score >= 60 for score in recent_scores[-2:])
    sudden_jump = len(recent_scores) >= 2 and recent_scores[-1] - recent_scores[-2] >= 20
    if sustained:
        reason = "score sustained at or above 60 for two consecutive days"
    elif sudden_jump:
        reason = "score increased by at least 20 points in 24 hours"
    else:
        reason = "reroute thresholds not met"
    return RiskScore(raw_score, smoothed, sustained or sudden_jump, reason)
