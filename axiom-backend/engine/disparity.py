"""
Computes fairness metrics across demographic groups.
Returns structured results for the topology map renderer.
"""
import pandas as pd
import numpy as np

def compute_disparity_scores(results_df: pd.DataFrame, protected_attr: str) -> dict:
    """
    Computes:
    - Statistical parity difference (demographic parity)
    - Disparate impact ratio
    - Counterfactual fairness score (our custom metric)
    Returns per-group scores and pairwise comparisons.
    """
    groups = results_df[protected_attr].unique()
    group_rates = {}

    for group in groups:
        group_data = results_df[results_df[protected_attr] == group]
        positive_rate = group_data["outcome"].mean()
        group_rates[group] = round(float(positive_rate), 4)

    # Reference group (most favorable outcome rate)
    max_group = max(group_rates, key=group_rates.get)
    max_rate = group_rates[max_group]

    pairwise = {}
    for group, rate in group_rates.items():
        if group == max_group:
            continue
        pairwise[group] = {
            "positive_rate": rate,
            "disparity_vs_best": round(max_rate - rate, 4),
            "disparate_impact_ratio": round(rate / max_rate, 4) if max_rate > 0 else 0,
            "passes_4_5ths_rule": (rate / max_rate >= 0.8) if max_rate > 0 else True,
        }

    # Counterfactual fairness score (AXIOM's proprietary metric)
    # Measures how often ONLY changing the protected attribute flips the decision
    twin_pairs = results_df[results_df["twin_of"].notna()]
    if len(twin_pairs) > 0:
        flip_rates = {}
        for original_id in twin_pairs["twin_of"].unique():
            pair = twin_pairs[twin_pairs["twin_of"] == original_id]
            original_outcome = pair[pair["is_original"] == True]["outcome"].values
            twin_outcomes = pair[pair["is_original"] == False]["outcome"].values
            if len(original_outcome) > 0 and len(twin_outcomes) > 0:
                flips = (twin_outcomes != original_outcome[0]).mean()
                flip_rates[original_id] = flips

        if len(flip_rates) > 0:
            counterfactual_fairness_score = 1 - np.mean(list(flip_rates.values()))
        else:
            counterfactual_fairness_score = 1.0
    else:
        counterfactual_fairness_score = None

    return {
        "protected_attribute": protected_attr,
        "group_positive_rates": group_rates,
        "reference_group": max_group,
        "pairwise_disparities": pairwise,
        "counterfactual_fairness_score": round(float(counterfactual_fairness_score * 100), 2) if counterfactual_fairness_score else None,
        "overall_bias_severity": _severity_rating(pairwise)
    }

def _severity_rating(pairwise: dict) -> str:
    if not pairwise:
        return "none"
    worst_ratio = min(v["disparate_impact_ratio"] for v in pairwise.values())
    if worst_ratio < 0.6: return "critical"
    elif worst_ratio < 0.8: return "high"
    elif worst_ratio < 0.9: return "moderate"
    else: return "low"
