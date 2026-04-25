from fastapi import FastAPI, UploadFile, File, BackgroundTasks, Form
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
import pandas as pd
import uuid
import json
import asyncio
from typing import Dict, Any
import os
from dotenv import load_dotenv

from engine.persona_factory import generate_personas
from engine.counterfactual import run_counterfactual_experiment
from engine.disparity import compute_disparity_scores
from engine.gemini_explainer import generate_explanation, generate_code_fix

load_dotenv()

app = FastAPI(title="AXIOM Bias Detection API")
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"]
)

sessions: Dict[str, Dict[str, Any]] = {}

@app.post("/api/audit/start")
async def start_audit(
    background_tasks: BackgroundTasks,
    domain: str = Form("hiring"),
    file: UploadFile = File(None)
):
    session_id = str(uuid.uuid4())
    
    sessions[session_id] = {
        "status": "started",
        "domain": domain,
        "progress": 0,
        "stage_label": "Initializing AXIOM engine..."
    }

    background_tasks.add_task(run_full_audit_pipeline, session_id, domain)
    
    return {"session_id": session_id, "status": "processing"}

@app.get("/api/audit/{session_id}/stream")
async def stream_audit_progress(session_id: str):
    async def event_generator():
        prev_progress = -1
        timeout = 300  
        elapsed = 0
        
        while elapsed < timeout:
            data = sessions.get(session_id)
            if data:
                progress = data.get("progress", 0)
                status = data.get("status", "processing")
                
                if progress != prev_progress:
                    yield {
                        "event": "message",
                        "id": str(elapsed),
                        "retry": 15000,
                        "data": json.dumps(data)
                    }
                    prev_progress = progress
                
                if status in ["completed", "failed"]:
                    break
            
            await asyncio.sleep(0.5)
            elapsed += 0.5
            
    return EventSourceResponse(event_generator())

@app.get("/api/audit/{session_id}/results")
async def get_audit_results(session_id: str):
    data = sessions.get(session_id)
    if not data:
        return {"error": "Session not found"}
    return data

@app.post("/api/audit/fix")
async def get_remediation_code(finding: str = Form(...), approach: str = Form(...)):
    code = await generate_code_fix(finding, approach)
    return {"code": code}

async def run_full_audit_pipeline(session_id: str, domain: str):
    try:
        
        sessions[session_id].update({"status": "generating_personas", "progress": 10,
                     "stage_label": "Generating 10,000 synthetic personas..."})
        await asyncio.sleep(1) 
        personas = generate_personas(domain, n=10000)

        sessions[session_id].update({"status": "probing_model", "progress": 30,
                     "stage_label": "Running adversarial simulation..."})
        await asyncio.sleep(1.5)
        
        cf_results = {}
        for attr in ["race", "gender", "age_group"]:
            cf_results[attr] = run_counterfactual_experiment(
                personas, attr, sample_size=500
            )

        sessions[session_id].update({"status": "computing_disparities", "progress": 55,
                     "stage_label": "Computing fairness metrics..."})
        await asyncio.sleep(1)
        
        disparity_results = {}
        for attr, results_df in cf_results.items():
            disparity_results[attr] = compute_disparity_scores(results_df, attr)

        sessions[session_id].update({"status": "generating_explanation", "progress": 75,
                     "stage_label": "Gemini 1.5 Pro drafting verdict..."})
        
        explanation = await generate_explanation(domain, disparity_results)

        sessions[session_id].update({"status": "building_visualization", "progress": 90,
                     "stage_label": "Building bias topology map..."})
        await asyncio.sleep(0.5)
        
        topology_data = build_topology_data(disparity_results)

        overall_severity = "none"
        if disparity_results:
             sev_ranks = {"none": 0, "low": 1, "moderate": 2, "high": 3, "critical": 4}
             overall_severity = max(
                 (d["overall_bias_severity"] for d in disparity_results.values()),
                 key=lambda s: sev_ranks.get(s, 0)
             )
             
        sessions[session_id].update({
            "status": "completed",
            "progress": 100,
            "stage_label": "Audit complete.",
            "disparity_results": disparity_results,
            "explanation": explanation,
            "topology_data": topology_data,
            "overall_severity": overall_severity
        })
        
    except Exception as e:
        print(f"Pipeline failed: {e}")
        sessions[session_id].update({"status": "failed", "error": str(e), "progress": 100})

def build_topology_data(disparity_results: dict) -> list:
    points = []
    for attr_idx, (attr, results) in enumerate(disparity_results.items()):
        for group_idx, (group, rate) in enumerate(results["group_positive_rates"].items()):
            ref_rate = results["group_positive_rates"].get(results["reference_group"], rate)
            disparity = abs(rate - ref_rate)
            points.append({
                "x": group_idx,
                "y": attr_idx,
                "z": round(disparity, 4),
                "group": group,
                "attribute": attr,
                "rate": rate,
                "severity": results["overall_bias_severity"]
            })
    return points

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
