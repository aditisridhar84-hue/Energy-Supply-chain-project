"""Train and evaluate a historical energy-supply risk classifier.

Input CSV must contain a date column, the numeric feature columns below, and a
binary disruption_label target: 0 for normal conditions and 1 for a verified
disruption window. Rows are split chronologically to prevent future information
leaking into training.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, balanced_accuracy_score, f1_score, precision_score, recall_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

FEATURE_COLUMNS = [
    "event_intensity",
    "tone_severity",
    "news_volume_spike",
    "price_volatility",
]
TARGET_COLUMN = "disruption_label"
DATE_COLUMN = "date"
LABELS = [0, 1]


def validate_data(frame: pd.DataFrame) -> pd.DataFrame:
    required = {DATE_COLUMN, TARGET_COLUMN, *FEATURE_COLUMNS}
    missing = sorted(required - set(frame.columns))
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(missing)}")

    cleaned = frame.copy()
    cleaned[DATE_COLUMN] = pd.to_datetime(cleaned[DATE_COLUMN], errors="coerce")
    cleaned[TARGET_COLUMN] = pd.to_numeric(cleaned[TARGET_COLUMN], errors="coerce")
    invalid_dates = int(cleaned[DATE_COLUMN].isna().sum())
    invalid_labels = sorted(set(cleaned[TARGET_COLUMN].dropna()) - set(LABELS))
    if invalid_dates:
        raise ValueError(f"Found {invalid_dates} invalid date value(s)")
    if invalid_labels:
        raise ValueError(f"Unsupported disruption_label value(s): {', '.join(map(str, invalid_labels))}")
    if cleaned[TARGET_COLUMN].isna().any():
        raise ValueError("disruption_label contains missing or non-numeric values")

    for column in FEATURE_COLUMNS:
        cleaned[column] = pd.to_numeric(cleaned[column], errors="coerce")
        if cleaned[column].isna().all():
            raise ValueError(f"Feature '{column}' contains no numeric values")

    cleaned = cleaned.sort_values(DATE_COLUMN).reset_index(drop=True)
    if len(cleaned) < 30:
        raise ValueError("At least 30 chronological rows are required for a meaningful split")
    if cleaned[TARGET_COLUMN].nunique() < 2:
        raise ValueError("disruption_label must contain both 0 (normal) and 1 (disruption)")
    return cleaned


def chronological_split(frame: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    train_end = int(len(frame) * 0.60)
    validation_end = int(len(frame) * 0.80)
    train = frame.iloc[:train_end]
    validation = frame.iloc[train_end:validation_end]
    test = frame.iloc[validation_end:]
    if min(len(train), len(validation), len(test)) == 0:
        raise ValueError("Chronological split produced an empty partition")
    return train, validation, test


def make_models() -> dict[str, Pipeline]:
    preprocess = [("imputer", SimpleImputer(strategy="median"))]
    return {
        "logistic_regression": Pipeline(
            preprocess + [("scaler", StandardScaler()), ("classifier", LogisticRegression(max_iter=2000, class_weight="balanced"))]
        ),
        "hist_gradient_boosting": Pipeline(
            preprocess + [("classifier", HistGradientBoostingClassifier(max_iter=150, learning_rate=0.05, l2_regularization=1.0))]
        ),
    }


def metrics(model: Pipeline, features: pd.DataFrame, target: pd.Series) -> dict[str, float]:
    predictions = model.predict(features)
    return {
        "accuracy": round(float(accuracy_score(target, predictions)), 4),
        "balanced_accuracy": round(float(balanced_accuracy_score(target, predictions)), 4),
        "macro_f1": round(float(f1_score(target, predictions, average="macro", zero_division=0)), 4),
        "precision": round(float(precision_score(target, predictions, zero_division=0)), 4),
        "recall": round(float(recall_score(target, predictions, zero_division=0)), 4),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input_csv", type=Path)
    parser.add_argument("--output-dir", type=Path, default=Path("ml/artifacts"))
    args = parser.parse_args()

    frame = validate_data(pd.read_csv(args.input_csv))
    train, validation, test = chronological_split(frame)
    x_train, y_train = train[FEATURE_COLUMNS], train[TARGET_COLUMN]
    x_validation, y_validation = validation[FEATURE_COLUMNS], validation[TARGET_COLUMN]
    x_test, y_test = test[FEATURE_COLUMNS], test[TARGET_COLUMN]

    models = make_models()
    models["majority_baseline"] = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("classifier", DummyClassifier(strategy="most_frequent")),
        ]
    )
    validation_metrics: dict[str, dict[str, float]] = {}
    for name, model in models.items():
        model.fit(x_train, y_train)
        validation_metrics[name] = metrics(model, x_validation, y_validation)

    candidates = [name for name in models if name != "majority_baseline"]
    selected_name = max(candidates, key=lambda name: validation_metrics[name]["macro_f1"])
    selected_model = make_models()[selected_name]
    fit_features = pd.concat([x_train, x_validation])
    fit_target = pd.concat([y_train, y_validation])
    selected_model.fit(fit_features, fit_target)
    test_metrics = metrics(selected_model, x_test, y_test)

    args.output_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(selected_model, args.output_dir / "risk_model.joblib")
    report = {
        "task": "historical energy supply risk classification",
        "target": TARGET_COLUMN,
        "features": FEATURE_COLUMNS,
        "labels": {"0": "normal", "1": "disruption"},
        "rows": {"total": len(frame), "train": len(train), "validation": len(validation), "test": len(test)},
        "date_range": {"start": frame[DATE_COLUMN].min().date().isoformat(), "end": frame[DATE_COLUMN].max().date().isoformat()},
        "validation_metrics": validation_metrics,
        "selected_model": selected_name,
        "test_metrics": test_metrics,
        "warning": "Metrics are estimates on this historical sample, not a guarantee of future accuracy.",
    }
    (args.output_dir / "metrics.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
