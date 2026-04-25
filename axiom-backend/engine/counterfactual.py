import pandas as pd
import numpy as np
from copy import deepcopy

PROTECTED_ATTRIBUTES = {
    "race": ["white", "black", "hispanic", "asian", "other"],
    "gender": ["male", "female", "nonbinary"],
    "age_group": ["young (18-35)", "middle (36-55)", "older (56+)"]
}

def create_counterfactual_twins(
    persona: dict,
    protected_attr: str,
    all_values: list
) -> list[dict]:
    twins = []
    for value in all_values:
        twin = deepcopy(persona)
        twin[protected_attr] = value
        twin["twin_of"] = persona["persona_id"]
        twin["varied_attr"] = protected_attr
        twin["varied_value"] = value
        twin["is_original"] = (value == persona[protected_attr])
        twins.append(twin)
    return twins

def mock_biased_model_probe(persona: dict) -> dict:
    base_score = 0.5

    if "years_experience" in persona:
        base_score += (persona["years_experience"] / 40) * 0.4
    if "gpa" in persona:
        base_score += ((persona["gpa"] - 2.0) / 2.0) * 0.2

    if persona.get("race") == "black":
        base_score -= 0.25
    elif persona.get("race") == "hispanic":
        base_score -= 0.18
        
    if persona.get("gender") == "female":
        base_score -= 0.12
        
    if persona.get("age_group") == "older (56+)":
        base_score -= 0.15

    score = base_score + np.random.normal(0, 0.05)

    approved = int(score > 0.6)
    
    return {
        "decision": approved,
        "confidence": float(np.clip(score, 0, 1))
    }

def run_counterfactual_experiment(
    personas_df: pd.DataFrame,
    protected_attr: str,
    sample_size: int = 500
) -> pd.DataFrame:
    sample = personas_df.sample(min(sample_size, len(personas_df)), random_state=42)
    all_results = []

    for _, persona in sample.iterrows():
        twins = create_counterfactual_twins(
            persona.to_dict(),
            protected_attr,
            PROTECTED_ATTRIBUTES.get(protected_attr, [])
        )
        for twin in twins:
            outcome = mock_biased_model_probe(twin)
            twin["outcome"] = outcome["decision"]
            twin["confidence"] = outcome.get("confidence", None)
            all_results.append(twin)

    return pd.DataFrame(all_results)
