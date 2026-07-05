import os
import json
import google.generativeai as genai
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY", "")
if api_key:
    genai.configure(api_key=api_key)

# We use gemini-2.5-pro for complex extraction, scalability, and robust reasoning
MODEL_NAME = "gemini-2.5-pro" 

def extract_signals(text: str) -> float:
    """
    Extracts structured red-flag signals from unstructured text.
    Returns a risk score from 0.0 to 10.0
    """
    if not api_key or not text.strip():
        return 5.0 # Default neutral score

    prompt = f"""
    Analyze the following unstructured notes or statements about a loan applicant.
    Determine the level of risk mentioned based on factors like job stability, unusual spending, hidden debts, or character flags.
    Return a SINGLE numeric risk score from 0.0 (very low risk) to 10.0 (extremely high risk).
    Only output the number, nothing else.

    Applicant Text:
    {text}
    """
    try:
        model = genai.GenerativeModel(MODEL_NAME)
        response = model.generate_content(prompt)
        score_text = response.text.strip()
        score = float(score_text)
        return min(max(score, 0.0), 10.0)
    except Exception as e:
        print(f"Error extracting signals: {e}")
        return 5.0

def generate_narrative(shap_values_dict: dict, probability: float) -> dict:
    """
    Generates a 2-3 sentence plain-English risk narrative from SHAP values.
    """
    if not api_key:
        return {"narrative": "Unable to generate narrative without API key.", "recommendation": ""}

    prompt = f"""
    You are an expert underwriter assistant. I will provide you with the probability of a borrower defaulting on their loan within 12 months, and the top contributing factors (SHAP values).
    
    You must respond with a VALID JSON object containing exactly two keys:
    1. "narrative": A 2-3 sentence plain-English risk narrative explaining to a loan officer WHY this borrower is assigned this probability.
    2. "recommendation": A 1-2 sentence actionable recommendation for the loan officer (e.g., specific conditions for approval, request for collateral, or outright rejection).
    
    Do not use complex ML jargon like "SHAP values" or "coefficients". Speak about the borrower's risk profile based on these factors.
    
    Probability of Default: {probability:.1%}
    
    Contributing Factors (Positive values increase risk, Negative values decrease risk):
    {json.dumps(shap_values_dict, indent=2)}
    """
    try:
        model = genai.GenerativeModel(MODEL_NAME, generation_config={"response_mime_type": "application/json"})
        response = model.generate_content(prompt)
        result = json.loads(response.text.strip())
        return {
            "narrative": result.get("narrative", ""),
            "recommendation": result.get("recommendation", "")
        }
    except Exception as e:
        print(f"Error generating narrative/recommendation: {e}")
        import traceback
        traceback.print_exc()
        return {
            "narrative": f"Error generating risk narrative: {str(e)}",
            "recommendation": ""
        }
