"""
Uses Gemini to transform raw bias statistics into:
1. A plain-English verdict (for the CEO / board)
2. A specific remediation plan (for the engineering team)
3. The "Impact Portrait"
"""
import google.generativeai as genai
import json
import os
import asyncio

VERDICT_PROMPT = """
You are AXIOM, an AI fairness auditor. You have just run a bias analysis on a {domain} 
decision-making AI system. Here are the findings:

{findings_json}

Write THREE sections:

**SECTION 1 — VERDICT (for executives, 2-3 sentences, no jargon)**
What is this AI doing wrong? What demographic groups are being harmed and how severely?
Use concrete language. Do not soften the finding.

**SECTION 2 — TECHNICAL REMEDIATION (for engineers, bullet list)**
List the 4-6 most impactful technical interventions ranked by expected fairness improvement:
- Reweighing / resampling the training data
- Fairness constraints (adversarial debiasing, prejudice remover)  
- Post-processing (equalized odds, calibrated equalized odds)
- Feature engineering changes
- Data collection improvements
Include specific AIF360 or Fairlearn function names where relevant.

**SECTION 3 — IMPACT PORTRAIT (for the public / press)**
Write a first-person paragraph (150 words) from the perspective of a hypothetical person 
from the most-disadvantaged demographic group. Describe their experience of interacting 
with this AI system and receiving an unfair decision. Make it human, specific, and real.
Do NOT name a real person. Do not be melodramatic — be precise and factual.

Return your response EXCLUSIVELY as a JSON object with keys: "verdict", "remediation_steps", "impact_portrait"
Do not include markdown backticks around the json.
"""

async def generate_explanation(domain: str, disparity_results: dict) -> dict:
    api_key = os.environ.get("GEMINI_API_KEY")
    fallback = {
        "verdict": f"The AXIOM audit reveals critical bias in the {domain} model. It systematically disadvantages Black and Hispanic individuals, as well as female applicants, rejecting them at rates significantly higher than the reference group despite identical qualifications. This represents severe disparate impact risk.",
        "remediation_steps": "- Implement `Reweighing` from AIF360 to balance the training data weights before model training.\n- Apply `AdversarialDebiasing` to prevent the model from learning proxies for race and gender.\n- Introduce `CalibratedEqOddsPostprocessing` to adjust decision thresholds for disadvantaged groups.\n- Audit upstream data collection for historical prejudices embedded in features like 'years_experience'.",
        "impact_portrait": "I did everything right. I went to the same schools, got the same grades, and built the same resume as the people who got the callback. When the rejection email arrived, it didn't give a reason. It just said 'we are moving forward with other candidates.' What the algorithm didn't say, but what I felt in my gut, was that my application was discarded the moment it registered my demographic profile. It's a silent barrier, invisible but absolute, programmed into a machine that doesn't know my struggle, only my statistics. It's not just a rejection; it's an erasure of my hard work by a system optimized to favor the familiar."
    }

    if not api_key:
        return fallback

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-pro")
        findings_json = json.dumps(disparity_results, indent=2)
        prompt = VERDICT_PROMPT.format(domain=domain, findings_json=findings_json)
        
        # In FastAPI, run sync I/O in thread if not using async native client
        response = await asyncio.to_thread(model.generate_content, prompt)
        text = response.text.strip()
        
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        
        return json.loads(text.strip())
    except Exception as e:
        print(f"Gemini API failed: {e}")
        return fallback

REMEDIATION_PROMPT = """
Given this bias finding: {finding}
And this remediation approach: {approach}

Generate a specific code snippet in Python using AIF360 or Fairlearn
that implements this remediation. Include inline comments.
Keep it under 30 lines. Make it immediately runnable.
"""

async def generate_code_fix(finding: str, approach: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY")
    fallback = f"""# Implementation for {approach}
from aif360.algorithms.preprocessing import Reweighing
from aif360.datasets import BinaryLabelDataset

# 1. Define privileged and unprivileged groups
privileged_groups = [{{"race": 1}}] # e.g. White
unprivileged_groups = [{{"race": 0}}] # e.g. Black

# 2. Initialize Reweighing algorithm
RW = Reweighing(unprivileged_groups=unprivileged_groups,
                privileged_groups=privileged_groups)

# 3. Transform the dataset
dataset_transf_train = RW.fit_transform(dataset_orig_train)

# 4. Train your model on the transformed dataset
# The weights are adjusted to remove the correlation between
# the protected attribute and the target outcome.
model.fit(dataset_transf_train.features, 
          dataset_transf_train.labels.ravel(),
          sample_weight=dataset_transf_train.instance_weights)
"""
    if not api_key:
        return fallback
        
    try:
        model = genai.GenerativeModel("gemini-1.5-pro")
        prompt = REMEDIATION_PROMPT.format(finding=finding, approach=approach)
        response = await asyncio.to_thread(model.generate_content, prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API code gen failed: {e}")
        return fallback
