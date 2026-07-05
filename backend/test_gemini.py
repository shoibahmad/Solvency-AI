import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY", "")
print(f"API Key present: {bool(api_key)}")

if api_key:
    genai.configure(api_key=api_key)

try:
    print("Testing gemini-2.5-flash...")
    model = genai.GenerativeModel("gemini-2.5-flash")
    response = model.generate_content("Hello, this is a test. Reply with 'OK'.")
    print(f"Response: {response.text}")
except Exception as e:
    import traceback
    print("ERROR encountered:")
    traceback.print_exc()
