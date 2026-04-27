---
title: AXIOM Auditor
emoji: ⚖️
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
pinned: false
---
<div align="center">

```
    ╔═══════════════════════════════════════════════════════════════╗
    ║                                                               ║
    ║      ▄▄▄     ▀▄ ▄▀  ██  ▄▄▄  ███▄   ███                     ║
    ║     ▀█▀█▀     ▄▀▄   ██ ██  █ █   █ █                         ║
    ║      █ █     █   █  ██ ██  █ █   █  ███                       ║
    ║     ▄█▄█▄   ▀▀ ▀▀   ██  ▀▀▀  ███▀     █                      ║
    ║                                                               ║
    ╚═══════════════════════════════════════════════════════════════╝
```

# AXIOM
### *Adversarial eXplainable Intelligence for Outcome Monitoring*

> **"Don't just audit your AI. Make it confess."**

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-r184-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br/>

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ⚡  10,000 synthetic personas generated in seconds           │
│   🔬  Counterfactual twin injection to expose hidden bias       │
│   🌐  3D Bias Topology Map live, interactive, breathtaking   │
│   🤖  LLM-powered verdict + remediation code generation        │
│   🎨  Dark/Light theme with glass-morphism design system       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

</div>

---

## 📑 Table of Contents

- [What is AXIOM?](#-what-is-axiom)
- [The Problem We Solve](#-the-problem-we-solve)
- [How It Works The Science](#-how-it-works--the-science)
- [Architecture Overview](#-architecture-overview)
- [Feature Deep-Dive](#-feature-deep-dive)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Backend Reference](#-backend-reference)
- [Frontend Reference](#-frontend-reference)
- [The Audit Pipeline](#-the-audit-pipeline)
- [Fairness Metrics Explained](#-fairness-metrics-explained)
- [Configuration & Customization](#-configuration--customization)
- [Screenshots & UI Walkthrough](#-screenshots--ui-walkthrough)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)

---

## 🧠 What is AXIOM?

**AXIOM** is an end-to-end AI fairness auditing platform that uses **counterfactual twin injection** to expose hidden discrimination inside black-box AI decision-making systems. Unlike traditional bias audits that merely inspect training data statistics, AXIOM *actively probes* a model by creating demographic clones personas that are **identical in every way except one protected attribute** then measures outcome deltas.

The result: irrefutable, causal evidence of discriminatory behaviour, presented through a jaw-dropping **3D Bias Topology Map**, an LLM-generated executive verdict, a first-person impact portrait, and actionable remediation code all in a single seamless experience.

### Who is it for?

| Stakeholder | What AXIOM gives them |
|------------|----------------------|
| **AI/ML Engineers** | Quantified bias metrics, specific technical interventions, ready-to-run AIF360/Fairlearn code |
| **Legal & Compliance Teams** | Disparate impact ratios, 4/5ths rule pass/fail, counterfactual fairness scores |
| **Executives & Board** | Plain-English verdict, severity rating, lived-experience portraits |
| **Journalists & Advocates** | Visual evidence of bias magnitude across demographic groups |
| **Researchers** | Novel counterfactual fairness metric, extensible persona factory |

---

## 🔴 The Problem We Solve

Modern AI systems make high-stakes decisions about who gets hired, who receives a loan, and who gets recommended medical treatment. These systems routinely encode and amplify historical societal biases but proving this is **fiendishly hard**.

Traditional approaches fail because:

```
❌  Correlation ≠ Causation  
    "The model uses zip code, not race" but zip code proxies race.

❌  Aggregate statistics miss intersectionality  
    A model may be fair to Black men and fair to women overall,
    but catastrophically unfair to Black women.

❌  Audits are opaque and slow  
    Months of consulting, thousands of pages, no actionable output.

❌  The "black box" problem  
    You only see inputs and outputs. You can't inspect weights.
```

**AXIOM solves all of these at once** with a principled counterfactual methodology that provides:

```
✅  Causal proof of discrimination (not just correlation)
✅  Intersectional analysis across race × gender × age simultaneously
✅  Results in minutes, not months
✅  Works on any black-box model (API, file, endpoint)
✅  Actionable output with implementation code
```

---

## 🔬 How It Works The Science

### Step 1 Persona Factory

AXIOM generates **10,000 synthetic human personas** with realistic, US-census-calibrated demographic distributions.

```python
# Realistic population proportions
RACE_DIST  = ["white", "black", "hispanic", "asian", "other"]
RACE_PROBS = [0.60,   0.13,   0.19,      0.06,   0.02  ]

GENDER_DIST  = ["male", "female", "nonbinary"]
GENDER_PROBS = [0.49,   0.50,     0.01       ]

# Age drawn from Normal(38, 12), clipped to [18, 70]
```

Each persona includes domain-specific features with realistic correlations:

```
Domain: HIRING
├── years_experience    ← correlated with age
├── education_level     ← categorical [0,1,2,3]
├── gpa                 ← Normal(3.2, 0.5), clipped to [2.0, 4.0]
├── zip_code_income_quartile
├── num_previous_jobs   ← Poisson(3)
└── has_employment_gap  ← Bernoulli(0.22)
```

### Step 2 Counterfactual Twin Injection

For each sampled persona, AXIOM creates **demographic clones** identical twins that differ in exactly **one** protected attribute. This is the core innovation.

```
Original Persona P:
  ├── race: "black"         ← VARY THIS
  ├── gender: "female"
  ├── age_group: "middle"
  ├── years_experience: 8
  ├── gpa: 3.7
  └── education_level: 3

↓  Creates counterfactual twins:

Twin P₁: race="white",    all else IDENTICAL
Twin P₂: race="hispanic", all else IDENTICAL
Twin P₃: race="asian",    all else IDENTICAL
Twin P₄: race="other",    all else IDENTICAL
```

The model is queried with each twin. The **outcome difference is the discrimination**. There is no confounding variable the only thing that changed was the protected attribute.

### Step 3 Disparity Computation

Three fairness metrics are computed per protected attribute group:

```
1. STATISTICAL PARITY DIFFERENCE
   Δ = P(Ŷ=1 | group=A) - P(Ŷ=1 | group=B)
   Ideal: Δ = 0

2. DISPARATE IMPACT RATIO
   DI = P(Ŷ=1 | unprivileged) / P(Ŷ=1 | privileged)
   Legal threshold: DI ≥ 0.80 (4/5ths rule, EEOC)

3. COUNTERFACTUAL FAIRNESS SCORE  ← AXIOM's novel metric
   CFS = 1 - E[I(f(x_A) ≠ f(x_B))]
   "How often does changing ONLY the protected attribute flip the decision?"
   Ideal: CFS = 1.0 (100%)
```

### Step 4 LLM Explanation Engine

Results are passed to an LLM (Gemini/Llama-3.1-8b) with a structured three-part prompt that generates:

```
SECTION 1 VERDICT (for executives)
   Plain-English, no jargon, specific harm description.

SECTION 2 TECHNICAL REMEDIATION (for engineers)
   4-6 ranked interventions with AIF360/Fairlearn function names.

SECTION 3 IMPACT PORTRAIT (for the public)
   First-person 150-word narrative from the most-disadvantaged
   demographic group's perspective.
```

### Step 5 Bias Topology Map

All disparity data is projected into 3D space:

```
X-axis  →  Demographic group index
Z-axis  →  Protected attribute index (race, gender, age)
Y-axis  →  Disparity magnitude (height of spike)
Color   →  Severity classification
```

The result is an interactive, auto-rotating 3D landscape where bias literally towers above the floor.

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        AXIOM PLATFORM                           │
│                                                                 │
│  ┌──────────────┐         ┌───────────────────────────────┐    │
│  │   BROWSER    │  HTTP   │       FastAPI Backend          │    │
│  │              │ ──────► │                               │    │
│  │  React 19    │         │  ┌─────────────────────────┐ │    │
│  │  Three.js    │ ◄────── │  │    Audit Pipeline        │ │    │
│  │  Framer      │   SSE   │  │                         │ │    │
│  │  Recharts    │         │  │  persona_factory.py     │ │    │
│  │  Tailwind    │         │  │  counterfactual.py      │ │    │
│  └──────────────┘         │  │  disparity.py           │ │    │
│                           │  │  gemini_explainer.py    │ │    │
│                           │  └─────────────────────────┘ │    │
│                           │                               │    │
│                           │  ┌──────────────────────────┐│    │
│                           │  │  In-Memory Session Store  ││    │
│                           │  │  sessions: Dict[str, Any] ││    │
│                           │  └──────────────────────────┘│    │
│                           │                               │    │
│                           │  ┌──────────────────────────┐│    │
│                           │  │     Gemini Cloud API        ││    │
│                           │  │   Llama-3.1-8b-instant    ││    │
│                           │  └──────────────────────────┘│    │
│                           └───────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Selects Domain
        │
        ▼
POST /api/audit/start
        │
        ▼ (Background Task)
┌───────────────────────────────────────────────────────────┐
│  Stage 1: generate_personas(domain, n=10000)              │  ← 10s
│  Stage 2: run_counterfactual_experiment(personas, attr)   │  ← 30s
│           × 3 attributes (race, gender, age_group)        │
│  Stage 3: compute_disparity_scores(results_df, attr)      │  ← 55s
│           × 3 attributes                                  │
│  Stage 4: generate_explanation(domain, disparity_results)  │  ← 75s
│  Stage 5: build_topology_data(disparity_results)          │  ← 90s
└───────────────────────────────────────────────────────────┘
        │
        │  Progress streamed via SSE
        ▼
GET /api/audit/{id}/stream  →  EventSource in browser
        │
        ▼
GET /api/audit/{id}/results →  Full JSON payload to React
```

---

## ✨ Feature Deep-Dive

### 🎬 Upload Portal

The entry point of AXIOM. A cinematic landing screen with:

- **Animated hero heading** with italic accent on "X" in AXIOM
- **Drag-and-drop data zone** (COMPAS demo dataset pre-loaded)
- **Domain selector** Hiring, Lending, or Healthcare, each with its own accent colour and icon
- **Protected attributes display** Race (purple), Gender (rose), Age Group (mint)
- **Ambient radial gradient orb** in the background for depth
- **Spring-physics button animations** via Framer Motion

### ⚡ Audit Pulse (Live Progress Screen)

A real-time audit dashboard that makes the waiting feel like watching a rocket launch:

- **Animated SVG progress ring** smooth stroke-dash animation
- **Live persona counter** counts up to 10,000 in real-time
- **Decision flip counter** increments as counterfactual flips are detected
- **Stage checklist** with animated timeline dots and checkmarks
- **Server-Sent Events (SSE)** for real-time progress without polling overhead
- The entire pipeline has **fake dramatic delays** for demo theatrics

### 🌐 3D Bias Topology Map

The centrepiece of AXIOM a fully interactive WebGL scene:

```
Severity → Colour Mapping:
┌─────────────────────────────────┐
│  CRITICAL  →  #F5A0B5  (rose)  │
│  HIGH      →  #F5C888  (sand)  │
│  MODERATE  →  #B8CCEE  (blue)  │
│  LOW       →  #98D5B0  (mint)  │
│  NONE      →  #3A3A3A  (grey)  │
└─────────────────────────────────┘

Spike height = abs(group_rate - reference_rate) × 15
```

- **OrbitControls** with auto-rotate at 0.3 speed, clamped polar angle
- **Fog** fades distant spikes for depth perception
- **Hover tooltips** with group name, attribute, disparity %, severity badge
- **Group labels** rendered as 3D text above critical spikes
- **Ground glow planes** beneath each spike (subtle opacity)
- **Environment preset** from `@react-three/drei` for realistic lighting
- **Theme-aware** switches between black and near-white ground

### 📊 Verdict Dashboard

A four-panel executive summary screen:

```
┌────────────────────────┬────────────────────────┐
│  VERDICT CARD          │  DISPARITY CHART       │
│                        │                        │
│  Severity badge        │  Horizontal bar chart  │
│  Plain-English         │  Recharts + custom     │
│  verdict text          │  cell colouring        │
│  Background icon       │  (reference=iris,      │
│  (AlertTriangle /      │   others=rose)         │
│   ShieldCheck)         │                        │
├────────────────────────┼────────────────────────┤
│  IMPACT PORTRAIT       │  COUNTERFACTUAL SCORE  │
│                        │                        │
│  First-person          │  Large serif number    │
│  narrative blockquote  │  with iris "%" accent  │
│  with decorative "     │  Explanatory tagline   │
│  quote mark            │  in monospace          │
└────────────────────────┴────────────────────────┘
```

### 🔧 Remediation Lab

An interactive code generation environment:

- **Checklist of 4-6 remediation steps** extracted from LLM output
- **Click any step** to trigger live code generation
- **Typewriter animation** code appears character by character at 10ms intervals
- **Animated blinking cursor** while generating
- **Pulse indicator** (ping animation) in the terminal header
- **AIF360/Fairlearn-specific code** with inline comments

### 🌗 Dark / Light Theme System

Full CSS custom property theming with 50+ design tokens:

```css
/* Dark (default) */
--theme-bg:           #000000;
--theme-iris:         #C4A8F5;
--theme-rose:         #F5A0B5;
--theme-mint:         #98D5B0;
--theme-sand:         #F5C888;
--theme-periwinkle:   #B8CCEE;

/* Light */
--theme-bg:           #FAFAFA;
--theme-iris:         #7C3AED;
--theme-rose:         #E11D48;
--theme-mint:         #059669;
--theme-sand:         #D97706;
--theme-periwinkle:   #2563EB;
```

All transitions are animated with `transition: background-color 0.25s, border-color 0.25s, color 0.15s`.

---

## 🛠 Tech Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.10+ | Core language |
| **FastAPI** | Latest | REST API + SSE streaming |
| **Uvicorn** | Latest | ASGI server |
| **Pandas** | Latest | DataFrame operations |
| **NumPy** | Latest | Numerical computing |
| **scikit-learn** | Latest | ML utilities |
| **Gemini Python SDK** | Latest | LLM API client (Llama-3.1) |
| **sse-starlette** | Latest | Server-Sent Events |
| **python-multipart** | Latest | Form data parsing |
| **python-dotenv** | Latest | Environment variables |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.5 | UI framework |
| **TypeScript** | 6.0.3 | Type safety |
| **Vite** | 8.0.10 | Build tool & dev server |
| **Three.js** | 0.184.0 | 3D WebGL rendering |
| **@react-three/fiber** | 9.6.0 | React renderer for Three.js |
| **@react-three/drei** | 10.7.7 | Three.js helpers (OrbitControls, Text, Environment) |
| **Framer Motion** | 12.38.0 | Animations & page transitions |
| **Recharts** | 3.8.1 | Data visualisation (bar charts) |
| **Tailwind CSS** | 4.2.4 | Utility-first styling |
| **Lucide React** | 1.11.0 | Icon library |
| **React Router DOM** | 7.14.2 | Client-side routing |

### Infrastructure

| Component | Technology |
|-----------|-----------|
| LLM Provider | Gemini Cloud (Llama-3.1-8b-instant) |
| Session Store | In-memory Python dict (hackathon-optimised) |
| Real-time Updates | SSE (Server-Sent Events) |
| Fonts | DM Serif Display, Plus Jakarta Sans, JetBrains Mono |

---

## 📂 Project Structure

```
axiom/
│
├── 📁 axiom-backend/
│   ├── 📁 engine/
│   │   ├── __init__.py              # Package marker
│   │   ├── persona_factory.py       # Synthetic persona generation (10k personas)
│   │   ├── counterfactual.py        # Twin injection + model probing
│   │   ├── disparity.py             # Fairness metric computation
│   │   └── gemini_explainer.py      # LLM verdict + code generation (Gemini)
│   │
│   ├── main.py                      # FastAPI app + all endpoints + pipeline orchestrator
│   ├── requirements.txt             # Python dependencies
│   └── .env                         # Gemini_API_KEY (you create this)
│
├── 📁 axiom-frontend/
│   ├── 📁 public/
│   │   ├── favicon.svg              # Custom AXIOM lightning bolt SVG
│   │   └── icons.svg                # Social icons sprite sheet
│   │
│   ├── 📁 src/
│   │   ├── 📁 assets/
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── 📁 components/
│   │   │   ├── UploadPortal.tsx     # Landing / domain selector screen
│   │   │   ├── AuditPulse.tsx       # Real-time progress with SSE
│   │   │   ├── BiasTopologyMap.tsx  # 3D WebGL bias landscape
│   │   │   ├── VerdictDashboard.tsx # 4-panel executive summary
│   │   │   └── RemediationLab.tsx   # Interactive code generator
│   │   │
│   │   ├── App.tsx                  # Root: state machine + theme context
│   │   ├── App.css                  # Legacy styles (minimal)
│   │   ├── index.css                # Design system tokens + Tailwind config
│   │   └── main.tsx                 # React DOM entry point
│   │
│   ├── index.html                   # HTML shell + Google Fonts
│   ├── package.json                 # NPM dependencies
│   ├── vite.config.ts               # Vite + Tailwind + API proxy
│   ├── tsconfig.json                # TypeScript project references
│   ├── tsconfig.app.json            # App-specific TS config
│   ├── tsconfig.node.json           # Node-specific TS config
│   └── eslint.config.js             # ESLint flat config
│
├── .gitignore
├── .vscode/
│   └── settings.json                # Tailwind at-rule suppression
├── scratch_script.js                # Dev utility: bulk class replacements
└── scratch_script2.js               # Dev utility: component-specific replacements
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

```bash
# Check versions
python --version    # Needs 3.10+
node --version      # Needs 20.19+ or 22.12+
npm --version       # Needs 10+
```

You'll also need a **Gemini API key** (free tier available):
→ https://console.Gemini.com/keys

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/axiom.git
cd axiom
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd axiom-backend

# Create and activate virtual environment
python -m venv venv

# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install all Python dependencies
pip install -r requirements.txt
```

Create your environment file:

```bash
# Create .env file in axiom-backend/
touch .env
```

Add your Gemini API key to `.env`:

```env
Gemini_API_KEY=gsk_your_Gemini_api_key_here
```

> **Note:** AXIOM works without a Gemini API key it falls back to pre-written example outputs for the verdict, remediation steps, impact portrait, and code snippets. The 3D map and all metrics still function perfectly.

Start the backend server:

```bash
# From axiom-backend/ directory
python main.py

# OR using uvicorn directly (with hot-reload for development)
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

You should see:

```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [xxxxx] using StatReload
INFO:     Started server process [xxxxx]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

Verify the backend is running:

```bash
curl http://localhost:8000/docs
# Opens interactive Swagger UI documentation
```

### 3. Frontend Setup

Open a **new terminal window/tab**:

```bash
# Navigate to frontend directory (from project root)
cd axiom-frontend

# Install all Node dependencies
npm install

# Start the Vite development server
npm run dev
```

You should see:

```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 4. Open AXIOM

Navigate to **http://localhost:5173** in your browser.

> The Vite dev server proxies all `/api` requests to `http://localhost:8000`, so CORS is handled automatically in development.

---

### Production Build

```bash
# Build optimised frontend bundle
cd axiom-frontend
npm run build

# Preview the production build locally
npm run preview
```

The built assets are output to `axiom-frontend/dist/`.

---

## 📡 Backend Reference

### API Endpoints

#### `POST /api/audit/start`

Initiates a new audit session. Kicks off the 5-stage pipeline as a FastAPI background task.

**Request:** `multipart/form-data`

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `domain` | string | `"hiring"` | One of `"hiring"`, `"lending"`, `"healthcare"` |
| `file` | file | `null` | Optional CSV upload (future feature) |

**Response:** `application/json`

```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing"
}
```

---

#### `GET /api/audit/{session_id}/stream`

SSE stream of live audit progress. The browser connects here via `EventSource`.

**Response:** `text/event-stream`

Each event is a JSON-encoded session object:

```json
{
  "status": "probing_model",
  "progress": 30,
  "stage_label": "Running adversarial simulation...",
  "domain": "hiring"
}
```

When complete, the final event includes all result fields:

```json
{
  "status": "completed",
  "progress": 100,
  "stage_label": "Audit complete.",
  "disparity_results": { ... },
  "explanation": { ... },
  "topology_data": [ ... ],
  "overall_severity": "critical"
}
```

---

#### `GET /api/audit/{session_id}/results`

Fetch the complete audit results at any time (polling alternative to SSE).

**Response:** Full session object (same schema as completed SSE event).

---

#### `POST /api/audit/fix`

Generate remediation code for a specific bias finding and approach.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `finding` | string | The verdict text describing the bias |
| `approach` | string | The specific remediation technique to implement |

**Response:** `application/json`

```json
{
  "code": "# Implementation for Reweighing\nfrom aif360.algorithms.preprocessing import Reweighing\n..."
}
```

---

### Pipeline Stages & Progress

```
Stage                    │ Status Key             │ Progress
─────────────────────────┼────────────────────────┼─────────
Initializing             │ started                │  0%
Generating personas      │ generating_personas     │ 10%
Running simulations      │ probing_model           │ 30%
Computing disparities    │ computing_disparities   │ 55%
LLM explanation          │ generating_explanation  │ 75%
Building visualization   │ building_visualization  │ 90%
Complete                 │ completed              │100%
```

---

### Engine Modules

#### `persona_factory.py`

| Function | Signature | Description |
|----------|-----------|-------------|
| `generate_personas` | `(domain: str, n: int=10000, seed: int=42) → pd.DataFrame` | Generates synthetic personas with domain-specific features |
| `age_to_group` | `(age: int) → str` | Maps integer age to categorical group string |

**Supported domains and their features:**

```
hiring:     age, gender, race, years_experience, education_level,
            gpa, zip_code_income_quartile, num_previous_jobs, has_employment_gap

lending:    age, gender, race, annual_income, debt_ratio, credit_score,
            employment_length, home_ownership, num_credit_lines

healthcare: age, gender, race, insurance_type, zip_code_income_quartile,
            bmi, num_prior_visits, primary_language, has_regular_doctor
```

#### `counterfactual.py`

| Function | Signature | Description |
|----------|-----------|-------------|
| `create_counterfactual_twins` | `(persona, protected_attr, all_values) → list[dict]` | Creates N clones, one per attribute value |
| `mock_biased_model_probe` | `(persona: dict) → dict` | Simulates biased model (demo) |
| `run_counterfactual_experiment` | `(personas_df, protected_attr, sample_size=500) → pd.DataFrame` | Full experiment pipeline |

**Built-in bias in the demo model:**

```python
# Hidden biases in mock_biased_model_probe:
race == "black"     → score -= 0.25   # 25 point penalty
race == "hispanic"  → score -= 0.18   # 18 point penalty
gender == "female"  → score -= 0.12   # 12 point penalty
age_group == "older" → score -= 0.15  # 15 point penalty

# Plus Gaussian noise: N(0, 0.05)
# Decision threshold: score > 0.60
```

#### `disparity.py`

| Function | Signature | Description |
|----------|-----------|-------------|
| `compute_disparity_scores` | `(results_df, protected_attr) → dict` | Computes all fairness metrics |
| `_severity_rating` | `(pairwise: dict) → str` | Classifies bias severity level |

**Severity thresholds:**

```
DI Ratio < 0.60  →  "critical"
DI Ratio < 0.80  →  "high"
DI Ratio < 0.90  →  "moderate"
DI Ratio ≥ 0.90  →  "low"
```

#### `gemini_explainer.py`

| Function | Signature | Description |
|----------|-----------|-------------|
| `generate_explanation` | `async (domain, disparity_results) → dict` | Generates verdict + portrait + remediation |
| `generate_code_fix` | `async (finding, approach) → str` | Generates remediation Python code |

Both functions include **graceful fallback** to pre-written example content when the Gemini API is unavailable.

---

## 🖥 Frontend Reference

### Application State Machine

The app is a linear state machine managed in `App.tsx`:

```
'upload' → 'pulse' → 'map' → 'verdict' → 'lab'
    │          │        │         │          │
    │          │        │         │          └─ RemediationLab
    │          │        │         └──────────── VerdictDashboard
    │          │        └────────────────────── BiasTopologyMap
    │          └─────────────────────────────── AuditPulse
    └────────────────────────────────────────── UploadPortal
```

Each transition is animated via Framer Motion's `<AnimatePresence mode="wait">`.

### Theme Context

```tsx
// Access theme anywhere in the component tree
import { useTheme } from '../App';

const { theme, toggleTheme } = useTheme();
// theme: 'dark' | 'light'
```

The theme value is stored in React state and written to `document.documentElement.setAttribute('data-theme', theme)`, which triggers CSS custom property swaps.

### Component Props

#### `<UploadPortal>`

```typescript
interface Props {
  onStart: (domain: string) => void;
}
```

#### `<AuditPulse>`

```typescript
interface Props {
  sessionId: string;
  onComplete: (data: AuditResults) => void;
}
```

#### `<BiasTopologyMap>`

```typescript
interface Props {
  topologyData: TopologyPoint[];
}

interface TopologyPoint {
  x: number;        // Group index (X-axis in 3D)
  y: number;        // Attribute index (Z-axis in 3D)
  z: number;        // Disparity magnitude (spike height)
  group: string;    // e.g. "black", "female"
  attribute: string; // e.g. "race", "gender"
  rate: number;     // Raw positive outcome rate
  severity: string; // "critical" | "high" | "moderate" | "low" | "none"
}
```

#### `<VerdictDashboard>`

```typescript
interface Props {
  data: AuditResults;
  onNext: () => void;
}
```

#### `<RemediationLab>`

```typescript
interface Props {
  explanation: {
    verdict: string;
    remediation_steps: string;  // Newline-separated "- step" lines
    impact_portrait: string;
  };
}
```

### Design System

#### Typography Scale

```
DM Serif Display → Headlines, numbers, serif accent text
Plus Jakarta Sans → Body text, UI labels (weight 300-600)
JetBrains Mono   → Code, mono labels, metric values, badges
```

#### Spacing & Layout

All major sections use `max-w-7xl mx-auto` with `p-8` padding. The main grid is `grid-cols-1 lg:grid-cols-2` responsive.

#### The `glass-panel` Class

```css
.glass-panel {
  background: var(--theme-card-bg);     /* rgba with 0.85 opacity */
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--theme-border);
}
```

#### Dot Grid Background

```css
.dot-grid {
  background-image: radial-gradient(circle, var(--theme-border) 1px, transparent 1px);
  background-size: 24px 24px;
  position: fixed;
  inset: 0;
  opacity: 0.4; /* 0.25 in light mode */
}
```

---

## 🔄 The Audit Pipeline

Here is the complete end-to-end data flow in detail:

```
1. USER ACTION
   User selects "Hiring & Recruitment" and clicks "Begin Audit Sequence"
   
   ↓
   
2. HTTP REQUEST
   POST http://localhost:8000/api/audit/start
   Body: domain=hiring
   
   ↓
   
3. SESSION CREATION
   session_id = str(uuid.uuid4())
   sessions[session_id] = { status: "started", progress: 0, ... }
   → Response: { session_id, status: "processing" }
   
   ↓
   
4. SSE CONNECTION
   Browser opens EventSource to /api/audit/{id}/stream
   Frontend renders <AuditPulse> component
   
   ↓
   
5. BACKGROUND PIPELINE (runs concurrently)

   ╔══ STAGE 1: PERSONA FACTORY ══════════════════════╗
   ║  generate_personas("hiring", n=10000, seed=42)   ║
   ║  → np.random.seed(42)                            ║
   ║  → Draw race from multinomial distribution       ║
   ║  → Draw gender from multinomial distribution     ║
   ║  → Draw age from Normal(38, 12), clip [18, 70]   ║
   ║  → Compute age_group categorical                 ║
   ║  → Draw domain features with correlations        ║
   ║  → Assign unique persona_id (P000000 ... P009999)║
   ║  → Return pd.DataFrame(10000 × 10 columns)      ║
   ║  Progress: 10%                                   ║
   ╚══════════════════════════════════════════════════╝
   
   ╔══ STAGE 2: COUNTERFACTUAL EXPERIMENT ════════════╗
   ║  For each attr in ["race", "gender", "age_group"]║
   ║    sample = personas.sample(500, random_state=42)║
   ║    For each persona in sample:                   ║
   ║      twins = create_counterfactual_twins(...)    ║
   ║      For each twin:                              ║
   ║        outcome = mock_biased_model_probe(twin)   ║
   ║        record: twin + outcome + confidence       ║
   ║  → cf_results: dict[attr → pd.DataFrame]        ║
   ║  → Total records: 3 × 500 × N_values ≈ 6,000+  ║
   ║  Progress: 30%                                   ║
   ╚══════════════════════════════════════════════════╝
   
   ╔══ STAGE 3: DISPARITY ANALYSIS ═══════════════════╗
   ║  For each attr, results_df:                      ║
   ║    Compute group_positive_rates                  ║
   ║    Identify reference_group (highest rate)       ║
   ║    Compute pairwise disparities                  ║
   ║    Compute disparate_impact_ratio per group      ║
   ║    Check 4/5ths rule compliance                  ║
   ║    Compute counterfactual_fairness_score         ║
   ║    Classify overall_bias_severity                ║
   ║  → disparity_results: dict[attr → metrics]      ║
   ║  Progress: 55%                                   ║
   ╚══════════════════════════════════════════════════╝
   
   ╔══ STAGE 4: LLM EXPLANATION ══════════════════════╗
   ║  Build prompt with domain + all metrics JSON     ║
   ║  POST to Gemini API (llama-3.1-8b-instant)         ║
   ║  Parse JSON response with 3 sections             ║
   ║  Normalise any nested dict structures            ║
   ║  → explanation: { verdict, remediation, portrait}║
   ║  Progress: 75%                                   ║
   ╚══════════════════════════════════════════════════╝
   
   ╔══ STAGE 5: TOPOLOGY BUILD ════════════════════════╗
   ║  For each attr, group:                           ║
   ║    x = group_index                               ║
   ║    y = attr_index                                ║
   ║    z = abs(rate - reference_rate)                ║
   ║  → topology_data: list of 3D point dicts        ║
   ║  Progress: 90%                                   ║
   ╚══════════════════════════════════════════════════╝
   
   ╔══ FINALIZATION ═══════════════════════════════════╗
   ║  Compute overall_severity (worst across attrs)   ║
   ║  sessions[session_id].update({ status: "done" })║
   ║  Progress: 100%                                  ║
   ╚══════════════════════════════════════════════════╝
   
   ↓
   
6. SSE FINAL EVENT
   Frontend receives status: "completed"
   Calls onComplete(data) after 1500ms delay
   
   ↓
   
7. 3D MAP RENDER
   React renders <BiasTopologyMap> with topology_data
   Three.js canvas boots, camera set to [10, 8, 10]
   BiasSpike meshes placed by (x, z) coordinates
   Heights set by disparity magnitude × 15
   Auto-rotate begins at 0.3 speed
   
   ↓
   
8. VERDICT & REMEDIATION
   User clicks through to VerdictDashboard
   Recharts renders horizontal bar chart
   User clicks to RemediationLab
   Each fix click → POST /api/audit/fix → typewriter animation
```

---

## 📐 Fairness Metrics Explained

### Statistical Parity Difference (SPD)

Measures the absolute difference in positive outcome rates between groups.

```
SPD = P(Ŷ=1 | group=privileged) - P(Ŷ=1 | group=unprivileged)

Range: [-1, 1]
Ideal: 0
Example: White applicants hired 72%, Black applicants 47% → SPD = 0.25
```

### Disparate Impact Ratio (DIR)

The ratio of positive outcome rates. The legal standard under US EEOC guidelines.

```
DIR = P(Ŷ=1 | unprivileged) / P(Ŷ=1 | privileged)

Range: [0, ∞]
Legal threshold: ≥ 0.80 (the "4/5ths rule")
Example: 47% / 72% = 0.65 → FAILS legal threshold → "high" severity
```

### Counterfactual Fairness Score (CFS) AXIOM's Novel Metric

Measures how often changing ONLY a protected attribute changes the model's decision.

```
CFS = 1 - E_persona[P(f(x_clone) ≠ f(x_original) | clone differs only in protected attr)]

Range: [0, 1] expressed as percentage
Ideal: 1.0 (100%) the protected attribute never changes the outcome
Example: 73.4% means 26.6% of the time, merely changing race flips the decision
```

This metric is particularly powerful because it:
1. Proves **causal** discrimination (not just correlation)
2. Works on **any** black-box model
3. Is **interpretable** to non-technical stakeholders

---

## ⚙️ Configuration & Customization

### Adding a New Domain

In `axiom-backend/engine/persona_factory.py`, add your domain to the `DOMAINS` dict:

```python
DOMAINS = {
    "my_domain": {
        "features": ["feature1", "feature2", "age", "gender", "race", ...],
        "protected": ["gender", "race", "age_group"],
        "target": "my_outcome_variable"
    },
    # ... existing domains
}
```

Then add feature generation logic in `generate_personas()`:

```python
if domain == "my_domain":
    data["feature1"] = np.random.normal(50, 10, n)
    data["feature2"] = np.random.choice(["A", "B", "C"], n)
```

### Connecting a Real Model

Replace `mock_biased_model_probe` in `counterfactual.py` with your actual model:

```python
def mock_biased_model_probe(persona: dict) -> dict:
    """Replace this with your real model endpoint."""
    import requests
    
    response = requests.post(
        "https://your-model-api.com/predict",
        json=persona,
        headers={"Authorization": f"Bearer {os.environ['MODEL_API_KEY']}"}
    )
    result = response.json()
    return {
        "decision": result["approved"],      # 0 or 1
        "confidence": result["probability"]  # float [0, 1]
    }
```

### Changing the LLM

In `gemini_explainer.py`, swap the Gemini client for any OpenAI-compatible client:

```python
# Using OpenAI
from openai import OpenAI
client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": prompt}],
    temperature=0.3,
    response_format={"type": "json_object"}
)
```

### Adding a New Protected Attribute

In `counterfactual.py`:

```python
PROTECTED_ATTRIBUTES = {
    "race": ["white", "black", "hispanic", "asian", "other"],
    "gender": ["male", "female", "nonbinary"],
    "age_group": ["young (18-35)", "middle (36-55)", "older (56+)"],
    "disability_status": ["none", "physical", "cognitive"]  # ← Add here
}
```

Then add the attribute to your domain's `"protected"` list in `persona_factory.py`.

### Scaling the Sample Size

In `main.py`, adjust the `sample_size` parameter:

```python
cf_results[attr] = run_counterfactual_experiment(
    personas, attr, sample_size=2000  # default: 500, increase for production
)
```

Note: Each increase of 100 samples ≈ +10% computation time.

---

## 🖼 Screenshots & UI Walkthrough

### Screen 1 Upload Portal

```
╔══════════════════════════════════════════════════════════════╗
║  ☀                                                    🌙   ║
║                                                              ║
║              A X I O M                                      ║
║         Adversarial eXplainable Intelligence                ║
║         for Outcome Monitoring                              ║
║         Don't just audit your AI. Make it confess.          ║
║                                                              ║
║  ┌─────────────────────────────────────────────────────┐   ║
║  │  ┌─────────────────────┐  ┌─────────────────────┐  │   ║
║  │  │   ⬆️ Connect Data   │  │  🔧 Audit Config    │  │   ║
║  │  │                     │  │                     │  │   ║
║  │  │   ☁️ ↑              │  │  ◉ Hiring           │  │   ║
║  │  │                     │  │  ○ Lending          │  │   ║
║  │  │   Drag & drop CSV   │  │  ○ Healthcare       │  │   ║
║  │  │   ● COMPAS Loaded   │  │                     │  │   ║
║  │  │                     │  │  [Race][Gender][Age]│  │   ║
║  │  │                     │  │                     │  │   ║
║  │  │                     │  │  ✨ Begin Audit      │  │   ║
║  │  └─────────────────────┘  └─────────────────────┘  │   ║
║  └─────────────────────────────────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════╝
```

### Screen 2 Audit Pulse

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                    ╭──────────────╮                         ║
║                   ╱               ╲                          ║
║                  │     65%         │                         ║
║                  │   processing    │                         ║
║                   ╲               ╱                          ║
║                    ╰──────────────╯                         ║
║                                                              ║
║           4,532          127                                 ║
║        Personas       Decision Flips                        ║
║                                                              ║
║  • ✓ Generating 10,000 synthetic human personas             ║
║  • ✓ Running adversarial simulation probing model         ║
║  • ◉ Computing fairness metrics across all groups           ║
║  • ○ Gemini analyzing patterns and drafting verdict         ║
║  • ○ Building bias topology map                             ║
║                                                              ║
║     Computing fairness metrics across all groups...         ║
╚══════════════════════════════════════════════════════════════╝
```

### Screen 3 3D Bias Topology Map

```
╔══════════════════════════════════════════════════════════════╗
║  Bias Topology Map                                  ┌──────┐ ║
║  Height = Disparity Magnitude                       │CRIT. │ ║
║  Peaks indicate severe bias.                        │HIGH  │ ║
║                                                     │MOD.  │ ║
║      [3D WebGL Canvas]                              │LOW   │ ║
║                                                     │NONE  │ ║
║    📊  ████ ██  █     ██  █  ██  █  █              └──────┘ ║
║       tall spikes = bias peaks                               ║
║       auto-rotating 3D landscape                            ║
║       hover for tooltip with group stats                     ║
║                                                              ║
║              [ View Executive Verdict → ]                   ║
╚══════════════════════════════════════════════════════════════╝
```

### Screen 4 Verdict Dashboard

```
╔══════════════════════════════════════════════════════════════╗
║  Audit Results                          [Remediation Lab →]  ║
║                                                              ║
║  ┌─────────────────────────┐  ┌────────────────────────┐   ║
║  │  [CRITICAL RISK]        │  │  Outcome Disparity     │   ║
║  │  Executive Verdict      │  │  ════════════════════  │   ║
║  │                         │  │  white    ██████ 72%   │   ║
║  │  "This AI system        │  │  asian    █████  61%   │   ║
║  │   systematically        │  │  hispanic ████   49%   │   ║
║  │   disadvantages Black   │  │  black    ████   47%   │   ║
║  │   and Hispanic          │  │  other    ███    38%   │   ║
║  │   applicants..."        │  │                        │   ║
║  └─────────────────────────┘  └────────────────────────┘   ║
║                                                              ║
║  ┌─────────────────────────┐  ┌────────────────────────┐   ║
║  │  Lived Experience       │  │ Counterfactual Score   │   ║
║  │  ──────────────────     │  │                        │   ║
║  │  "I did everything      │  │       73.4%            │   ║
║  │   right. When the       │  │                        │   ║
║  │   rejection arrived..." │  │  "Changing only race   │   ║
║  └─────────────────────────┘  │   flips 26.6% of       │   ║
║                                │   decisions"           │   ║
║                                └────────────────────────┘   ║
╚══════════════════════════════════════════════════════════════╝
```

### Screen 5 Remediation Lab

```
╔══════════════════════════════════════════════════════════════╗
║  🪄 Remediation Lab                                          ║
║  Gemini-recommended technical interventions                  ║
║                                                              ║
║  ┌──────────────────────────┐  ┌──────────────────────────┐ ║
║  │  RECOMMENDED ACTIONS     │  │  gemini-code-gen.py  ● │ ║
║  │                          │  │──────────────────────────│ ║
║  │  ✓ Implement Reweighing  │  │                          │ ║
║  │    [◉ Generate Code]     │  │ from aif360.algorithms  │ ║
║  │                          │  │ .preprocessing import   │ ║
║  │  ○ Apply Adversarial     │  │ Reweighing              │ ║
║  │    Debiasing             │  │                          │ ║
║  │    [◎ Generate Code]     │  │ # Define groups         │ ║
║  │                          │  │ privileged_groups = ... │ ║
║  │  ○ CalibratedEqOdds     │  │ unprivileged_groups = ..│ ║
║  │    Postprocessing        │  │                          │ ║
║  │    [◎ Generate Code]     │  │ RW = Reweighing(...)    │ ║
║  │                          │  │ dataset_transf = ...▌   │ ║
║  └──────────────────────────┘  └──────────────────────────┘ ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🗺 Roadmap

### v1.1 Real Model Integration
- [ ] Live HTTP endpoint probing (replace mock model)
- [ ] CSV upload parsing to create custom personas
- [ ] Support for multi-class outcomes (beyond binary)

### v1.2 Enhanced Analytics
- [ ] Intersectional analysis (race × gender heatmap)
- [ ] Temporal bias tracking (how bias changes across model versions)
- [ ] Confidence interval reporting on all metrics

### v1.3 Enterprise Features
- [ ] PostgreSQL persistent session storage
- [ ] Audit report PDF export
- [ ] Team collaboration with shared audit history
- [ ] Scheduled automated audit runs

### v2.0 Platform
- [ ] Plugin system for custom domain schemas
- [ ] API key management for external model connections
- [ ] Compliance report templates (GDPR, EU AI Act, EEOC)
- [ ] Webhook notifications for bias threshold violations

---

## 🤝 Contributing

Contributions are warmly welcome! Here's how to get started:

### Development Setup

```bash
# Fork and clone the repository
git clone https://github.com/your-username/axiom.git
cd axiom

# Create a feature branch
git checkout -b feature/my-new-feature

# Set up backend
cd axiom-backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Set up frontend
cd ../axiom-frontend
npm install
```

### Code Style

**Backend (Python):**
- Follow PEP 8
- All engine functions should have Google-style docstrings
- Use type hints on all public functions

**Frontend (TypeScript/React):**
- Use functional components with hooks only
- Props interfaces defined inline above each component
- CSS: prefer Tailwind utilities; CSS custom properties for theming
- No `any` types unless interoperating with external JSON payloads

### Submitting a Pull Request

1. Ensure your branch is up to date with `main`
2. Run `npm run lint` in the frontend (zero warnings)
3. Manually test the full audit pipeline
4. Write a clear PR description explaining:
   - What the change does
   - Why it's needed
   - How to test it

### Reporting Bugs

Open an issue with:
- AXIOM version / commit hash
- Browser and OS
- Steps to reproduce
- Expected vs actual behaviour
- Console errors (if any)

---

<div align="center">

```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   Built with ♥ to make AI accountable.           ║
║                                                   ║
║   Every model has a story to tell.               ║
║   AXIOM makes it confess.                        ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

**[⬆ Back to Top](#axiom)**

</div>
