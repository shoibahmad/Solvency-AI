import sys
import os
import json

# Add current directory to path so we can import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.gemini_service import extract_signals, generate_narrative
from services.ml_service import predict

def run_debug_pipeline():
    print("="*50)
    print("🚀 STARTING BACKEND PIPELINE DEBUG 🚀")
    print("="*50)

    # 1. Mock Data
    mock_request = {
        "income": 75000.0,
        "existing_loans": 2,
        "credit_utilization": 0.45,
        "dti_ratio": 0.35,
        "account_vintage_months": 36,
        "missed_payments_6m": 0,
        "late_payments_12m": 1,
        "loan_type": "Personal",
        "employment_length_months": 48,
        "liquid_assets": 15000.0,
        "loan_amount_requested": 20000.0,
        "previous_defaults": 0,
        "education_level": "Bachelor",
        "unstructured_notes": "Applicant seems stable but mentioned they might be taking unpaid leave soon due to family reasons."
    }

    print("\n📦 INPUT DATA:")
    print(json.dumps(mock_request, indent=2))
    
    print("\n" + "-"*50)
    print("STEP 1: Extracting Signals from Unstructured Text (Gemini)")
    print("-"*50)
    print(f"Notes: '{mock_request['unstructured_notes']}'")
    
    alternate_score = extract_signals(mock_request["unstructured_notes"])
    print(f"✅ Alternate Risk Score generated: {alternate_score}")

    print("\n" + "-"*50)
    print("STEP 2: Preparing Features for ML Model")
    print("-"*50)
    features = {
        'income': mock_request["income"],
        'existing_loans': mock_request["existing_loans"],
        'credit_utilization': mock_request["credit_utilization"],
        'dti_ratio': mock_request["dti_ratio"],
        'account_vintage_months': mock_request["account_vintage_months"],
        'missed_payments_6m': mock_request["missed_payments_6m"],
        'late_payments_12m': mock_request["late_payments_12m"],
        'loan_type': mock_request["loan_type"],
        'employment_length_months': mock_request["employment_length_months"],
        'liquid_assets': mock_request["liquid_assets"],
        'loan_amount_requested': mock_request["loan_amount_requested"],
        'previous_defaults': mock_request["previous_defaults"],
        'education_level': mock_request["education_level"],
        'alternate_signal_risk_score': alternate_score
    }
    print("✅ Features Dict:")
    print(json.dumps(features, indent=2))

    print("\n" + "-"*50)
    print("STEP 3: Running ML Scoring Pipeline (XGBoost + SHAP)")
    print("-"*50)
    try:
        prediction_result = predict(features)
        print(f"✅ Probability of Default: {prediction_result['probability']:.1%}")
        print(f"✅ Risk Tier: {prediction_result['risk_tier']}")
        print("✅ SHAP Top Factors:")
        print(json.dumps(prediction_result['shap_factors'], indent=2))
    except Exception as e:
        print(f"❌ Error during ML prediction: {e}")
        return

    print("\n" + "-"*50)
    print("STEP 4: Generating Explainability Narrative (Gemini)")
    print("-"*50)
    try:
        gemini_result = generate_narrative(
            shap_values_dict=prediction_result["shap_factors"],
            probability=prediction_result["probability"]
        )
        
        print("✅ Generated Narrative:")
        print(gemini_result["narrative"])
        print("\n✅ Generated Recommendation:")
        print(gemini_result["recommendation"])
    except Exception as e:
        print(f"❌ Error generating narrative: {e}")

    print("\n" + "="*50)
    print("🎉 PIPELINE DEBUG COMPLETE 🎉")
    print("="*50)

if __name__ == "__main__":
    run_debug_pipeline()
