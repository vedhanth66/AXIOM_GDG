"""
Generates 10,000 synthetic human personas with realistic intersectional
demographic distributions for a given domain (hiring, lending, healthcare).
Uses domain-specific feature schemas so that personas are semantically valid.
"""
import numpy as np
import pandas as pd
from dataclasses import dataclass
from typing import Literal

DOMAINS = {
    "hiring": {
        "features": ["age", "gender", "race", "years_experience",
                     "education_level", "gpa", "zip_code_income_quartile",
                     "num_previous_jobs", "has_employment_gap"],
        "protected": ["gender", "race", "age_group"],
        "target": "hired"
    },
    "lending": {
        "features": ["age", "gender", "race", "annual_income", "debt_ratio",
                     "credit_score", "employment_length", "home_ownership",
                     "num_credit_lines"],
        "protected": ["gender", "race", "age_group"],
        "target": "loan_approved"
    },
    "healthcare": {
        "features": ["age", "gender", "race", "insurance_type",
                     "zip_code_income_quartile", "bmi", "num_prior_visits",
                     "primary_language", "has_regular_doctor"],
        "protected": ["gender", "race", "age_group"],
        "target": "recommended_procedure"
    }
}

RACE_DIST = ["white", "black", "hispanic", "asian", "other"]
RACE_PROBS = [0.60, 0.13, 0.19, 0.06, 0.02]
GENDER_DIST = ["male", "female", "nonbinary"]
GENDER_PROBS = [0.49, 0.50, 0.01]

def age_to_group(age: int) -> str:
    if age <= 35: return "young (18-35)"
    elif age <= 55: return "middle (36-55)"
    else: return "older (56+)"

def generate_personas(domain: str, n: int = 10000, seed: int = 42) -> pd.DataFrame:
    np.random.seed(seed)
    if domain not in DOMAINS:
        domain = "hiring"
        
    data = {}

    # Protected attributes — drawn from realistic US distributions
    data["race"] = np.random.choice(RACE_DIST, n, p=RACE_PROBS)
    data["gender"] = np.random.choice(GENDER_DIST, n, p=GENDER_PROBS)
    ages = np.clip(np.random.normal(38, 12, n).astype(int), 18, 70)
    data["age"] = ages
    data["age_group"] = [age_to_group(a) for a in ages]

    # Domain-specific correlated features (simplified illustration)
    if domain == "hiring":
        data["years_experience"] = np.clip(
            (data["age"] - 22) + np.random.normal(0, 3, n), 0, 40
        ).astype(int)
        data["education_level"] = np.random.choice(
            [0, 1, 2, 3], n, p=[0.1, 0.3, 0.4, 0.2]
        )
        data["gpa"] = np.clip(np.random.normal(3.2, 0.5, n), 2.0, 4.0)
        data["zip_code_income_quartile"] = np.random.choice([1, 2, 3, 4], n)
        data["num_previous_jobs"] = np.clip(
            np.random.poisson(3, n), 0, 15
        )
        data["has_employment_gap"] = (np.random.random(n) < 0.22).astype(int)

    df = pd.DataFrame(data)
    df["persona_id"] = [f"P{i:06d}" for i in range(n)]
    return df
