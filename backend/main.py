from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import os
import uvicorn

from services.gemini_service import extract_signals, generate_narrative
from services.ml_service import predict

load_dotenv()

app = FastAPI(title="Solvency AI API", description="AI-powered loan default prediction platform")

# Retrieve allowed origins from env, default to allow all if not set
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BorrowerRequest(BaseModel):
    income: float
    existing_loans: int
    credit_utilization: float
    dti_ratio: float
    account_vintage_months: int
    missed_payments_6m: int
    late_payments_12m: int
    loan_type: str # 'Personal', 'Home', 'Auto', 'Mortgage'
    
    # New features
    employment_length_months: int
    liquid_assets: float
    loan_amount_requested: float
    previous_defaults: int
    education_level: str
    
    unstructured_notes: Optional[str] = ""

@app.get("/")
def read_root():
    return {"message": "Welcome to Solvency AI API v2.0"}

@app.post("/predict")
def predict_default(request: BorrowerRequest):
    try:
        # 1. Extract signals from unstructured text via Gemini
        alternate_score = extract_signals(request.unstructured_notes)
        
        # Prepare features for ML model
        features = {
            'income': request.income,
            'existing_loans': request.existing_loans,
            'credit_utilization': request.credit_utilization,
            'dti_ratio': request.dti_ratio,
            'account_vintage_months': request.account_vintage_months,
            'missed_payments_6m': request.missed_payments_6m,
            'late_payments_12m': request.late_payments_12m,
            'loan_type': request.loan_type,
            'employment_length_months': request.employment_length_months,
            'liquid_assets': request.liquid_assets,
            'loan_amount_requested': request.loan_amount_requested,
            'previous_defaults': request.previous_defaults,
            'education_level': request.education_level,
            'alternate_signal_risk_score': alternate_score
        }
        
        # 2. Run ML Scoring Pipeline
        prediction_result = predict(features)
        
        # 3. Generate Explainability Narrative via Gemini
        gemini_result = generate_narrative(
            shap_values_dict=prediction_result["shap_factors"],
            probability=prediction_result["probability"]
        )
        
        # Assemble final response
        return {
            "probability": prediction_result["probability"],
            "risk_tier": prediction_result["risk_tier"],
            "shap_top_factors": prediction_result["shap_factors"],
            "narrative": gemini_result["narrative"],
            "recommendation": gemini_result["recommendation"],
            "model_version": prediction_result["model_version"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
