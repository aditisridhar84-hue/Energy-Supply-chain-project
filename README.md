#  Fairway — India Petroleum Supply-Chain Resilience

> **From geopolitical disruption to actionable supply-chain intelligence.**

Fairway is a frontend-based decision-support prototype that visualizes how disruptions in critical maritime routes—such as the **Strait of Hormuz**—can cascade through India's petroleum supply chain.

It connects the entire chain:

**Geopolitical Event → Shipping Disruption → Crude Price Shock → India's Import Cost → Alternative Suppliers & Routes → Refinery & Logistics Risk → Recommended Response**

The goal is to help decision-makers understand **where the risk originates, how it propagates, and what actions can reduce India's exposure.**

---

##  Problem Statement

India imports a significant share of its crude oil requirements, making its energy security sensitive to:

* Geopolitical conflicts
* Disruptions in major shipping routes
* Crude oil price volatility
* Supplier concentration
* Freight and insurance cost increases
* Refinery dependence on specific crude grades
* Port and logistics bottlenecks

A disruption in a strategic chokepoint such as the **Strait of Hormuz** can therefore create effects far beyond shipping.

However, these effects are often viewed separately.

### The gap

There is a lack of a simple, integrated interface that allows users to move from:

> **"What happened?"**

to

> **"How does it affect India's petroleum supply chain?"**

to

> **"What should we consider doing next?"**

Fairway addresses this gap through an interactive supply-chain risk dashboard.

---

##  Our Solution

Fairway models the petroleum supply chain as a connected risk network.

Instead of showing isolated statistics, the platform explains the **cause-and-effect relationship** between geopolitical events and downstream petroleum risks.

### Core workflow

```text
┌──────────────────────┐
│  GEOPOLITICAL EVENT  │
│  Strait of Hormuz   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ SHIPPING DISRUPTION  │
│ Route / transit risk │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ CRUDE PRICE SHOCK    │
│ Price & freight risk │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ INDIA IMPORT IMPACT  │
│ Cost & exposure      │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ ALTERNATIVE SOURCES  │
│ Suppliers / routes   │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ REFINERY & LOGISTICS │
│ Operational exposure │
└──────────┬───────────┘
           ↓
┌──────────────────────┐
│ RECOMMENDATION       │
│ Risk-based response  │
└──────────────────────┘
```

---

#  Key Features

## 1. Geopolitical Risk Overview

Provides an at-a-glance view of the disruption scenario and its potential implications for India's energy security.

Users can understand:

* What the triggering event is
* Why the event matters
* Which supply-chain components are exposed
* The potential severity of the disruption

---

## 2. Supply-Chain Exposure Mapping

Fairway connects geopolitical risk to India's petroleum ecosystem.

The platform considers multiple layers:

**Route → Imports → Suppliers → Refineries → Logistics**

This allows users to identify potential bottlenecks instead of looking at crude prices alone.

---

## 3. Crude Price Impact

The dashboard visualizes how a supply disruption can translate into crude-price pressure.

Key factors include:

* Global crude price movement
* Shipping disruption
* Freight exposure
* Supply-demand imbalance
* Import cost pressure

---

## 4. Alternative Supplier & Route Analysis

When a major supply route becomes risky, diversification becomes critical.

Fairway highlights alternative options such as:

* Alternative crude suppliers
* Alternative maritime routes
* Diversification opportunities
* Relative route/supply-chain risk

The purpose is not simply to identify another supplier, but to understand the **trade-offs associated with switching supply sources.**

---

## 5. Refinery & Logistics Risk

Different refineries may have different exposure depending on:

* Crude requirements
* Port accessibility
* Transportation routes
* Supplier dependence
* Logistics constraints

Fairway presents these risks in a simplified decision-support format.

---

## 6. AI-Assisted Recommendation Layer

Fairway converts the available risk indicators into an actionable recommendation.

The current prototype uses a **rule-based recommendation engine** rather than a backend machine-learning model.

Example:

```text
IF
    route risk = HIGH
    AND
    supplier concentration = HIGH
    AND
    crude price pressure = HIGH

THEN

    Recommendation:
    Prioritize supplier diversification,
    evaluate alternative routes,
    and increase short-term strategic inventory.
```

This makes the recommendation **explainable** rather than treating AI as a black box.

---

# 🧠 What Makes Fairway Different?

Most dashboards answer:

> **"What is happening?"**

Fairway aims to answer:

> **"Why does it matter to India, where is the exposure, and what can be considered next?"**

### Our differentiation

| Conventional Dashboard                   | Fairway                                  |
| ---------------------------------------- | ---------------------------------------- |
| Shows isolated statistics                | Connects events across the supply chain  |
| Focuses on current indicators            | Shows cascading impact                   |
| Static information                       | Interactive decision-support interface   |
| Price-focused                            | Price + route + supplier + refinery risk |
| Data visualization                       | Data → risk → recommendation             |
| Black-box AI can be difficult to explain | Explainable rule-based recommendations   |

---

# 🏗️ System Architecture

Fairway is intentionally designed as a **frontend-first prototype**.

```text
                    USER
                     │
                     ▼
             ┌───────────────┐
             │   FAIRWAY UI  │
             └───────┬───────┘
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
   Risk View     Supply Chain   Analytics
                     │
                     ▼
              Scenario Data
                     │
                     ▼
          Rule-Based Risk Engine
                     │
                     ▼
              Recommendation
```

### Current architecture

* **Frontend:** React
* **Build Tool:** Vite
* **Styling:** CSS
* **Data Visualization:** Frontend charting/visualization components
* **Recommendation Engine:** Rule-based logic
* **Deployment:** Netlify
* **Version Control:** Git + GitHub

---

# 🛠️ Technology Stack

| Technology | Purpose                        |
| ---------- | ------------------------------ |
| React      | User interface                 |
| Vite       | Development & production build |
| JavaScript | Application logic              |
| HTML/CSS   | Structure and styling          |
| Git        | Version control                |
| GitHub     | Source-code hosting            |
| Netlify    | Deployment                     |

---

# 📊 Data & Methodology

Fairway is a **prototype decision-support system**.

The application combines scenario inputs and petroleum supply-chain indicators to demonstrate how geopolitical disruptions can propagate through India's energy ecosystem.

The recommendation layer is currently **rule-based**, allowing each recommendation to be traced back to the risk conditions that triggered it.

### Important distinction

Fairway is designed to demonstrate the **decision-support methodology**, not to claim that its prototype predictions are official forecasts.

For production deployment, the system can be connected to continuously updated sources for:

* Crude prices
* Shipping rates
* Vessel traffic
* Import volumes
* Supplier data
* Port congestion
* Refinery operations
* Geopolitical events

---

# 🔄 Future Scope

Fairway can be extended from a frontend prototype into a production-grade energy intelligence platform.

### Phase 1 — Live Data

Integrate APIs and trusted datasets for:

* Brent / WTI prices
* Indian crude imports
* Shipping and freight rates
* Vessel movement
* Port congestion
* Supplier volumes

### Phase 2 — Backend

Introduce a backend for:

* Automated data ingestion
* Historical data storage
* Scheduled updates
* User scenarios
* Risk calculations

### Phase 3 — Advanced AI/ML

Replace or augment the rule engine with models for:

* Crude-price forecasting
* Supply disruption prediction
* Supplier-risk scoring
* Route-risk prediction
* Scenario simulation

### Phase 4 — Digital Twin / What-if Simulation

Allow users to ask:

> "What happens if Hormuz remains disrupted for 30 days?"

or:

> "What happens if crude prices increase by 20%?"

The system could then estimate the potential impact across:

**Imports → Cost → Refinery → Logistics → Consumer**

---

# 🌏 Potential Impact

Fairway can support multiple stakeholders.

### Government & Policy Makers

* Identify strategic vulnerabilities
* Compare diversification strategies
* Support energy-security planning

### Oil & Gas Companies

* Monitor supplier and route exposure
* Evaluate alternative sourcing
* Identify operational bottlenecks

### Analysts & Researchers

* Understand geopolitical-to-economic transmission
* Explore scenario-based risk
* Visualize petroleum supply-chain dependencies

### Students & Public

* Understand the relationship between geopolitics and energy prices
* Explore India's petroleum dependence through an interactive interface

---

# 🔐 Limitations

This version is a **hackathon/academic prototype**.

Current limitations include:

* Frontend-only architecture
* No continuously running backend
* No live vessel-tracking pipeline
* Rule-based rather than trained ML recommendations
* Prototype scenario data may not represent real-time market conditions
* Recommendations should not be treated as operational or financial advice

## Historical model training

The repository includes a reproducible training pipeline at `ml/train_risk_model.py`.
It learns binary disruption risk from daily historical corridor features rather than
claiming that a language model can predict supply events. The expected CSV columns are
documented in `ml/historical_data_schema.csv`:
`date`, `event_intensity`, `tone_severity`, `news_volume_spike`, `price_volatility`,
and `disruption_label` (`0` for normal, `1` for a verified disruption window).

The pipeline sorts rows by date and uses a 60/20/20 chronological train/validation/test
split. It compares a majority baseline, logistic regression, and histogram gradient
boosting; preprocessing is fitted only on training data. The model with the best
validation macro-F1 is retrained on train plus validation data and evaluated once on the
held-out test period. Accuracy is reported alongside balanced accuracy, precision,
recall, and macro-F1 because disruption days may be rare.

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python ml\train_risk_model.py path\to\corridor_daily_features.csv
```

The command writes `ml/artifacts/risk_model.joblib` and `ml/artifacts/metrics.json`.
The current frontend snapshot is not a training dataset: it has too few observations,
no daily signal history, and no verified disruption labels. Do not fabricate rows to
improve accuracy; collect historical GDELT/news and EIA price data, define disruption
windows from independent sources, and backtest on an unseen event.

These limitations define the next stage of development rather than the core concept of the platform.

---

# 🎥 Prototype Demonstration

The recommended demonstration flow is:

```text
1. Open Dashboard
        ↓
2. Select geopolitical scenario
        ↓
3. Observe route disruption
        ↓
4. Examine crude-price impact
        ↓
5. View India's import exposure
        ↓
6. Compare alternative suppliers/routes
        ↓
7. Examine refinery/logistics risk
        ↓
8. Generate risk-based recommendation
```

This demonstrates the complete **event-to-decision pipeline**.

---

# 📁 Project Structure

```text
hormuz-india-resilience/
│
├── public/
│
├── src/
│   ├── components/
│   ├── assets/
│   ├── data/
│   ├── App.*
│   └── main.*
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

*The exact contents of `src/` may vary depending on the current implementation.*

---

# 💻 Running the Project

### Prerequisites

* Node.js
* npm
* Git

### Installation

```bash
git clone https://github.com/YOUR-USERNAME/hormuz-india-resilience.git

cd hormuz-india-resilience

npm install
```

### Start development server

```bash
npm run dev
```

The application will be available through the local Vite development URL.

### Production build

```bash
npm run build
```

---

# Deployment

The project can be deployed directly through **Netlify** using the GitHub repository.

### Build command

```text
npm run build
```

### Publish directory

```text
dist
```

---

# Hackathon Value Proposition

### Fairway transforms:

**Geopolitical uncertainty**

⬇️

**Supply-chain exposure**

⬇️

**Economic impact**

⬇️

**Operational risk**

⬇️

**Actionable recommendation**

into one interactive platform.

> **"Don't just monitor the disruption. Understand how it propagates."**

---

# 👥 Team: BINARY BRAINS

**Project:** Fairway — India Petroleum Supply-Chain Resilience

**Built for:** Hackathon / Academic Prototype

**Team Members:**

* Member 1 — ADITI S AMIN
* Member 2 — AYUSHI SINGH


---

#  Project Status

**Current Status:** 🟢 Working Prototype

**Architecture:** Frontend-only

**Recommendation Engine:** Explainable rule-based system

**Deployment:** Web-based

**Future Direction:** Live-data + backend + AI/ML-powered energy risk intelligence

---

##  Vision

Fairway aims to evolve into a broader **energy-supply-chain resilience platform for India**, capable of connecting geopolitical events, global energy markets, maritime logistics, domestic infrastructure, and AI-driven scenario analysis.

**From "What happened?" to "What does it mean for India?"**
