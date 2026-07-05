import os
import joblib
import pandas as pd
import numpy as np
import shap

# Load models and encoders
MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))
try:
    xgb_model = joblib.load(os.path.join(MODEL_DIR, 'xgb_model.joblib'))
    encoder = joblib.load(os.path.join(MODEL_DIR, 'encoder.joblib'))
    feature_names = joblib.load(os.path.join(MODEL_DIR, 'feature_names.joblib'))
    
    # Initialize SHAP explainer
    explainer = shap.TreeExplainer(xgb_model)
    print("Models and Explainer loaded successfully.")
except Exception as e:
    print(f"Warning: Could not load models. Please run train.py first. Error: {e}")
    xgb_model, encoder, feature_names, explainer = None, None, None, None

def get_risk_tier(probability: float) -> str:
    if probability < 0.3:
        return "Low Risk"
    elif probability < 0.7:
        return "Medium Risk"
    else:
        return "High Risk"

def group_shap_factors(shap_values, feature_names_local):
    """
    Groups SHAP values into 4 fixed categories: 
    Repayment behavior, Indebtedness, Credit history, Alternate data
    """
    categories = {
        "Repayment behavior": 0.0,
        "Indebtedness": 0.0,
        "Credit history": 0.0,
        "Alternate data": 0.0
    }
    
    mapping = {
        'missed_payments_6m': 'Repayment behavior',
        'late_payments_12m': 'Repayment behavior',
        'existing_loans': 'Indebtedness',
        'credit_utilization': 'Indebtedness',
        'dti_ratio': 'Indebtedness',
        'income': 'Indebtedness', # Income offsets indebtedness
        'account_vintage_months': 'Credit history',
        'alternate_signal_risk_score': 'Alternate data'
    }
    
    for i, feature in enumerate(feature_names_local):
        # Handle one-hot encoded categorical features (loan_type_*)
        if feature.startswith('loan_type_'):
            cat = 'Credit history'
        else:
            cat = mapping.get(feature, 'Alternate data')
            
        categories[cat] += float(shap_values[i])
        
    return categories

def predict(borrower_features: dict):
    if not xgb_model:
        raise RuntimeError("ML model is not loaded.")
        
    # Convert input to DataFrame
    df = pd.DataFrame([borrower_features])
    
    # Separate categorical and numeric
    categorical_features = ['loan_type']
    numeric_features = [f for f in borrower_features.keys() if f not in categorical_features]
    
    # Encode categorical
    encoded_cat = encoder.transform(df[categorical_features])
    
    # Reconstruct exact feature order
    X_proc = pd.DataFrame(
        np.hstack((df[numeric_features].values, encoded_cat)),
        columns=feature_names
    )
    
    # Predict Probability
    # XGBoost predict_proba returns [prob_class_0, prob_class_1]
    probability = float(xgb_model.predict_proba(X_proc)[0][1])
    risk_tier = get_risk_tier(probability)
    
    # SHAP Explainability
    shap_vals = explainer.shap_values(X_proc)[0]
    grouped_shap = group_shap_factors(shap_vals, feature_names)
    
    return {
        "probability": probability,
        "risk_tier": risk_tier,
        "shap_factors": grouped_shap,
        "model_version": "xgb_v1.0"
    }
