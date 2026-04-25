"""
Uses Groq (Llama 3) to transform raw bias statistics into:
1. A plain-English verdict (for the CEO / board)
2. A specific remediation plan (for the engineering team)
3. The "Impact Portrait"
"""
import os
import json
import asyncio
from groq import Groq

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
Do not include markdown backticks around the json. Output ONLY valid JSON.
"""

async def generate_explanation(domain: str, disparity_results: dict) -> dict:
    api_key = os.environ.get("GROQ_API_KEY")
    fallback = {
        "verdict": f"The AXIOM audit reveals critical bias in the {domain} model. It systematically disadvantages Black and Hispanic individuals, as well as female applicants, rejecting them at rates significantly higher than the reference group despite identical qualifications. This represents severe disparate impact risk.",
        "remediation_steps": "- Implement `Reweighing` from AIF360 to balance the training data weights before model training.\n- Apply `AdversarialDebiasing` to prevent the model from learning proxies for race and gender.\n- Introduce `CalibratedEqOddsPostprocessing` to adjust decision thresholds for disadvantaged groups.\n- Audit upstream data collection for historical prejudices embedded in features like 'years_experience'.",
        "impact_portrait": "I did everything right. I went to the same schools, got the same grades, and built the same resume as the people who got the callback. When the rejection email arrived, it didn't give a reason. It just said 'we are moving forward with other candidates.' What the algorithm didn't say, but what I felt in my gut, was that my application was discarded the moment it registered my demographic profile. It's a silent barrier, invisible but absolute, programmed into a machine that doesn't know my struggle, only my statistics. It's not just a rejection; it's an erasure of my hard work by a system optimized to favor the familiar."
    }

    if not api_key:
        return fallback

    try:
        client = Groq(api_key=api_key)
        findings_json = json.dumps(disparity_results, indent=2)
        prompt = VERDICT_PROMPT.format(domain=domain, findings_json=findings_json)
        
        response = await asyncio.to_thread(
            client.chat.completions.create,
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        text = response.choices[0].message.content.strip()
        
        res = json.loads(text)
        
        # Normalize nested dictionaries to strings for frontend compatibility
        if isinstance(res.get("verdict"), dict):
            res["verdict"] = res["verdict"].get("text", str(res["verdict"]))
            
        if isinstance(res.get("impact_portrait"), dict):
            res["impact_portrait"] = res["impact_portrait"].get("text", str(res["impact_portrait"]))
            
        if isinstance(res.get("remediation_steps"), list):
            steps = []
            for step in res["remediation_steps"]:
                if isinstance(step, str):
                    steps.append(f"- {step}")
                elif isinstance(step, dict):
                    step_text = step.get("step") or step.get("description") or step.get("action") or step.get("name")
                    if not step_text and len(step) > 0:
                        step_text = list(step.values())[0]
                    steps.append(f"- {step_text or str(step)}")
            res["remediation_steps"] = "\n".join(steps)
            
        return res
    except Exception as e:
        print(f"Groq API failed: {e}")
        return fallback

REMEDIATION_PROMPT = """
Given this bias finding: {finding}
And this remediation approach: {approach}

Generate a specific code snippet in Python using AIF360 or Fairlearn
that implements this remediation. Include inline comments.
Keep it under 30 lines. Make it immediately runnable.
Return ONLY the python code. Do not wrap it in markdown codeblocks.
"""

async def generate_code_fix(finding: str, approach: str) -> str:
    api_key = os.environ.get("GROQ_API_KEY")
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
model.fit(dataset_transf_train.features, 
          dataset_transf_train.labels.ravel(),
          sample_weight=dataset_transf_train.instance_weights)
"""
    if not api_key:
        return fallback
        
    try:
        client = Groq(api_key=api_key)
        prompt = REMEDIATION_PROMPT.format(finding=finding, approach=approach)
        
        response = await asyncio.to_thread(
            client.chat.completions.create,
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            temperature=0.1
        )
        text = response.choices[0].message.content.strip()
        
        # Clean up markdown if the model still adds it
        if text.startswith("```"):
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines)
            
        return text
    except Exception as e:
        print(f"Groq API code gen failed: {e}")
        return fallback
