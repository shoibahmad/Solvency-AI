<div align="center">
  
  # Solvency AI 🧠💳

  **A verdict on creditworthiness — issued in seconds, explained in plain language.**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Google Gemini](https://img.shields.io/badge/Gemini_2.5_Pro-blue?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![XGBoost](https://img.shields.io/badge/XGBoost-Machine_Learning-F37626?style=for-the-badge)](https://xgboost.readthedocs.io/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 Executive Summary

**Solvency AI** is a next-generation credit underwriting and risk assessment platform that bridges the gap between complex machine learning and human interpretability. It tackles the "black box" problem prevalent in AI-driven finance by not only predicting the probability of default but also generating plain-English risk narratives that explain exactly *why* a decision was made.

By combining traditional quantitative ML modeling with the qualitative reasoning capabilities of Large Language Models (LLMs), Solvency AI provides loan officers with a holistic, transparent, and actionable view of every applicant.

---

## 🏗️ The Dual-Engine Architecture

Solvency AI operates on a sophisticated **Dual-Engine Architecture**:

1. **Quantitative Engine (XGBoost & SHAP):** 
   - Analyzes 14 distinct structured, tabular financial data points (e.g., Debt-to-Income, Credit Utilization, Account Vintage).
   - Calculates a highly accurate baseline Probability of Default (PD).
   - Generates SHAP (SHapley Additive exPlanations) values to mathematically quantify the contribution of each feature to the final risk score.

2. **Cognitive Engine (Google Gemini 2.5 Pro):** 
   - **Signal Extraction:** Reads unstructured loan officer notes to extract hidden behavioral risk signals (like sudden job changes or undisclosed debts), quantifying them into a 0.0 - 10.0 risk score that feeds into the XGBoost model.
   - **Explainable AI (XAI):** Translates the complex mathematical SHAP values from the XGBoost model into readable, 2-3 sentence plain-English risk narratives and actionable recommendations.

---

## ✨ Core Features

- **🧠 Dual-Engine Risk Assessment**: Seamlessly merges tabular quantitative data with unstructured text analysis.
- **📝 Explainable AI (XAI)**: No more "computer says no". Every prediction comes with a human-readable narrative explaining the primary risk drivers.
- **⚡ Real-Time Intake & Analysis**: Evaluate applicants instantaneously with a highly optimized FastAPI backend.
- **🚨 Live Security & Risk Alerts**: Global, real-time Firestore listeners trigger UI alerts instantly when a High-Risk applicant enters the system, alerting admins immediately.
- **📊 Admin Overwatch Dashboard**: Comprehensive command center featuring portfolio-wide metrics, historical trend analysis, and geographic risk distribution.
- **✨ Spatial Glassmorphism UI**: A stunning, ultra-premium dark mode interface inspired by modern design trends, featuring extreme frosted glass, micro-animations, and dynamic depth using Tailwind CSS and Framer Motion.

---

## 🗃️ Data Dictionary (Model Features)

The XGBoost model evaluates the following features to determine the probability of default:

| Feature Name | Type | Description |
| :--- | :--- | :--- |
| `income` | Numeric | Annual income in USD. |
| `existing_loans` | Numeric | Number of active loans the applicant currently holds. |
| `credit_utilization` | Numeric | Ratio of current revolving credit used vs. available. |
| `dti_ratio` | Numeric | Debt-to-Income ratio. |
| `account_vintage_months`| Numeric | Age of the applicant's oldest credit account in months. |
| `missed_payments_6m` | Numeric | Count of missed payments in the last 6 months. |
| `late_payments_12m` | Numeric | Count of late payments in the last 12 months. |
| `loan_type` | Categorical| Type of loan requested (Personal, Home, Auto, Mortgage). |
| `employment_length_months`| Numeric | Total time employed at current job in months. |
| `liquid_assets` | Numeric | Total cash on hand and liquid investments in USD. |
| `loan_amount_requested` | Numeric | The principal amount the applicant is requesting. |
| `previous_defaults` | Numeric | Count of historical loan defaults (carries heavy penalty). |
| `education_level` | Categorical| Highest degree earned (High School, Bachelor, Master, PhD). |
| `alternate_signal_risk_score`| Numeric| AI-generated score (0-10) extracted from unstructured notes by Gemini. |

---

## 🔌 API Documentation

### `POST /predict`
The core endpoint for evaluating a loan applicant.

**Request Body (`application/json`):**
```json
{
  "income": 75000.0,
  "existing_loans": 2,
  "credit_utilization": 0.35,
  "dti_ratio": 0.42,
  "account_vintage_months": 48,
  "missed_payments_6m": 0,
  "late_payments_12m": 1,
  "loan_type": "Personal",
  "employment_length_months": 36,
  "liquid_assets": 15000.0,
  "loan_amount_requested": 25000.0,
  "previous_defaults": 0,
  "education_level": "Bachelor",
  "unstructured_notes": "Applicant seems stable but mentioned they might be switching careers soon."
}
```

**Response (`application/json`):**
```json
{
  "probability": 0.45,
  "risk_tier": "Medium Risk",
  "shap_top_factors": {
    "Repayment behavior": -0.5,
    "Indebtedness": 1.2,
    "Credit history": -0.8,
    "Alternate data": 0.3
  },
  "narrative": "The applicant shows medium risk primarily driven by high existing indebtedness and the requested loan amount. However, this is partially offset by a strong history of timely repayments and decent account vintage.",
  "recommendation": "Approve with conditions: Request proof of liquid assets and consider slightly higher interest rate.",
  "model_version": "xgb_v1.0"
}
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3)
- **Machine Learning**: `scikit-learn`, `xgboost`, `shap`, `pandas`, `numpy`
- **Generative AI**: `google-generativeai` (Google Gemini 2.5 Pro)
- **Server**: `uvicorn`

### Database & Authentication
- **Provider**: [Firebase](https://firebase.google.com/)
- **Database**: Cloud Firestore (NoSQL, Real-time listeners)
- **Auth**: Firebase Authentication

---

## 🚀 Installation & Local Setup Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- A Firebase Project (with Firestore and Auth enabled)
- A Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/shoibahmad/Solvency-AI.git
cd Solvency-AI
```

### 2. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd frontend
npm install
```

**Environment Variables:**
Create a `.env.local` file in the `frontend` directory by copying the template:
```bash
cp .env.example .env.local
```
Fill in `.env.local` with your Firebase project credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Start the Development Server:**
```bash
npm run dev
```
The frontend will be accessible at `http://localhost:3000`.

### 3. Backend Setup
Open a new terminal window, navigate to the backend directory, and set up your Python environment:
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**Model Training:**
Before starting the server, generate the synthetic dataset and train the XGBoost model. This will create `.joblib` files in the `models/` directory.
```bash
cd model_training
python train.py
cd ..
```

**Environment Variables:**
Create a `.env` file in the `backend` directory by copying the template:
```bash
cp .env.example .env
```
Fill in `.env` with your Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Start the FastAPI Server:**
```bash
python main.py
```
The backend API will be accessible at `http://localhost:8000`.

---

## 🧪 Testing

The backend includes several test scripts to verify the core services are operating correctly. Run these from the `backend/` directory:

- **Test ML Model Prediction**: `python test_predict.py`
- **Test Gemini Signal Extraction**: `python test_gemini.py`
- **Test Gemini Narrative Generation**: `python test_narrative.py`

---

## 🔒 Security

- **API Keys**: All sensitive API keys (Firebase, Gemini) are strictly managed via local environment variables (`.env` and `.env.local`).
- **No Hardcoded Secrets**: Secrets are never checked into version control. Ensure your local `.env` files remain ignored by Git.

---

## 📄 License
This project is licensed under the MIT License.
