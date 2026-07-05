import sys
import os

# Add the backend dir to the path so we can import services
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.ml_service import predict

features = {
    'income': 50000.0,
    'existing_loans': 2,
    'credit_utilization': 0.5,
    'dti_ratio': 0.4,
    'account_vintage_months': 24,
    'missed_payments_6m': 0,
    'late_payments_12m': 1,
    'loan_type': 'Personal',
    'alternate_signal_risk_score': 5.0
}

try:
    print(predict(features))
except Exception as e:
    import traceback
    traceback.print_exc()
