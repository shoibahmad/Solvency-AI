import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, average_precision_score, f1_score
from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
import shap

# Generate Synthetic Data
def generate_synthetic_data(n_samples=5000):
    np.random.seed(42)
    
    # Dates for time-based split
    dates = pd.date_range(start='2021-01-01', periods=n_samples, freq='h')
    
    # Features (v1)
    income = np.random.lognormal(mean=11.0, sigma=0.5, size=n_samples) # Mean ~ $60k
    existing_loans = np.random.poisson(lam=1.5, size=n_samples)
    credit_utilization = np.random.beta(a=2, b=5, size=n_samples) # Mostly low, some high
    dti_ratio = np.random.beta(a=2, b=6, size=n_samples)
    account_vintage_months = np.random.randint(1, 120, size=n_samples)
    missed_payments_6m = np.random.poisson(lam=0.2, size=n_samples)
    late_payments_12m = np.random.poisson(lam=0.5, size=n_samples)
    loan_types = np.random.choice(['Personal', 'Home', 'Auto', 'Mortgage'], size=n_samples)
    alternate_signal_risk_score = np.random.uniform(0, 10, size=n_samples)
    
    # New Features (v2)
    employment_length_months = np.random.randint(0, 360, size=n_samples) # 0 to 30 years
    liquid_assets = np.random.lognormal(mean=10.0, sigma=1.0, size=n_samples) # Cash on hand
    loan_amount_requested = np.random.lognormal(mean=10.5, sigma=0.8, size=n_samples)
    previous_defaults = np.random.poisson(lam=0.1, size=n_samples) # Rare but heavy penalty
    education_level = np.random.choice(['High School', 'Bachelor', 'Master', 'PhD'], size=n_samples, p=[0.4, 0.4, 0.15, 0.05])
    
    df = pd.DataFrame({
        'date': dates,
        'income': income,
        'existing_loans': existing_loans,
        'credit_utilization': credit_utilization,
        'dti_ratio': dti_ratio,
        'account_vintage_months': account_vintage_months,
        'missed_payments_6m': missed_payments_6m,
        'late_payments_12m': late_payments_12m,
        'alternate_signal_risk_score': alternate_signal_risk_score,
        'loan_type': loan_types,
        
        'employment_length_months': employment_length_months,
        'liquid_assets': liquid_assets,
        'loan_amount_requested': loan_amount_requested,
        'previous_defaults': previous_defaults,
        'education_level': education_level
    })
    
    # Calculate synthetic risk
    risk_score = (
        (df['credit_utilization'] * 2.0) +
        (df['dti_ratio'] * 3.0) +
        (df['missed_payments_6m'] * 2.5) +
        (df['late_payments_12m'] * 1.5) +
        (df['alternate_signal_risk_score'] * 0.5) -
        (np.log1p(df['income']) * 0.5) -
        (df['account_vintage_months'] * 0.01) -
        (df['employment_length_months'] * 0.005) -
        (np.log1p(df['liquid_assets']) * 0.3) +
        (np.log1p(df['loan_amount_requested']) * 0.4) +
        (df['previous_defaults'] * 5.0) # Huge penalty for past defaults
    )
    
    # Add noise
    risk_score += np.random.normal(0, 1.5, size=n_samples)
    
    # Determine default (1) or not (0). Baseline is ~20%
    threshold = np.percentile(risk_score, 80)
    df['default_12m'] = (risk_score > threshold).astype(int)
    
    # Sort by date for time-based split
    df = df.sort_values('date')
    
    return df

def main():
    print("Generating synthetic data v2.0...")
    df = generate_synthetic_data(10000)
    
    # Time-based split: First 80% train, last 20% test
    split_idx = int(len(df) * 0.8)
    train_df = df.iloc[:split_idx]
    test_df = df.iloc[split_idx:]
    
    features = [
        'income', 'existing_loans', 'credit_utilization', 'dti_ratio',
        'account_vintage_months', 'missed_payments_6m', 'late_payments_12m',
        'alternate_signal_risk_score', 'loan_type',
        'employment_length_months', 'liquid_assets', 'loan_amount_requested',
        'previous_defaults', 'education_level'
    ]
    target = 'default_12m'
    
    X_train = train_df[features]
    y_train = train_df[target]
    X_test = test_df[features]
    y_test = test_df[target]
    
    # Preprocessing
    categorical_features = ['loan_type', 'education_level']
    numeric_features = [f for f in features if f not in categorical_features]
    
    encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    
    # Fit and transform categorical
    encoded_train = encoder.fit_transform(X_train[categorical_features])
    encoded_test = encoder.transform(X_test[categorical_features])
    
    # Feature names
    cat_feature_names = encoder.get_feature_names_out(categorical_features)
    all_feature_names = numeric_features + list(cat_feature_names)
    
    # Construct final dataframes
    X_train_proc = pd.DataFrame(
        np.hstack((X_train[numeric_features].values, encoded_train)),
        columns=all_feature_names
    )
    
    X_test_proc = pd.DataFrame(
        np.hstack((X_test[numeric_features].values, encoded_test)),
        columns=all_feature_names
    )
    
    # Calculate scale_pos_weight
    pos_count = y_train.sum()
    neg_count = len(y_train) - pos_count
    scale_pos_weight = neg_count / pos_count
    
    print("Training XGBoost v2.0...")
    xgb_model = XGBClassifier(
        n_estimators=150,
        max_depth=5,
        learning_rate=0.08,
        scale_pos_weight=scale_pos_weight,
        random_state=42
    )
    xgb_model.fit(X_train_proc, y_train)
    
    # Evaluate
    print("Evaluating XGBoost v2.0...")
    y_pred = xgb_model.predict(X_test_proc)
    y_prob = xgb_model.predict_proba(X_test_proc)[:, 1]
    
    print(classification_report(y_test, y_pred))
    print(f"AUC-PR: {average_precision_score(y_test, y_prob):.4f}")
    print(f"F1: {f1_score(y_test, y_pred):.4f}\n")
    
    # Save the primary model and the encoder
    os.makedirs('../models', exist_ok=True)
    joblib.dump(xgb_model, '../models/xgb_model.joblib')
    joblib.dump(encoder, '../models/encoder.joblib')
    joblib.dump(all_feature_names, '../models/feature_names.joblib')
    print("Models saved successfully in backend/models.")

if __name__ == "__main__":
    main()
