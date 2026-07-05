import os
from dotenv import load_dotenv

load_dotenv()

from services.gemini_service import generate_narrative

shap_dict = {
    'Repayment behavior': -0.4445260167121887, 
    'Indebtedness': 0.8063476905226707, 
    'Credit history': 0.6082216431677807, 
    'Alternate data': -0.5527724623680115
}

probability = 0.6029

print("Testing generate_narrative...")
try:
    narrative = generate_narrative(shap_dict, probability)
    print("NARRATIVE:", narrative)
except Exception as e:
    import traceback
    traceback.print_exc()
