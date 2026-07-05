<div align="center">
  
  # Solvency AI 🧠💳

  **A verdict on creditworthiness — issued in seconds, explained in plain language.**

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Google Gemini](https://img.shields.io/badge/Gemini_2.5_Pro-blue?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
  [![XGBoost](https://img.shields.io/badge/XGBoost-Machine_Learning-F37626?style=for-the-badge)](https://xgboost.readthedocs.io/)

</div>

---

## 📖 Overview

**Solvency AI** is a next-generation credit underwriting platform that combines traditional machine learning with cutting-edge Large Language Models (LLMs). It solves the "black box" problem of AI in finance by not only predicting the probability of default but also generating plain-English narratives explaining exactly *why* a decision was made.

The platform utilizes a **Dual-Engine Architecture**:
1. **Quantitative Engine (XGBoost):** Analyzes structured, tabular financial data (e.g., Debt-to-Income, Credit Utilization) to calculate a baseline Probability of Default (PD).
2. **Cognitive Engine (Gemini 2.5 Pro):** Reads unstructured loan officer notes to extract hidden behavioral risk signals, and translates complex mathematical SHAP values into readable risk narratives and actionable recommendations.

## ✨ Features

- **🧠 Dual-Engine Risk Assessment**: Combines quantitative ML (XGBoost) with qualitative LLM reasoning (Gemini).
- **📝 Explainable AI (XAI)**: Uses SHAP (SHapley Additive exPlanations) to provide mathematical transparency, translated into plain English by Gemini.
- **⚡ Real-Time Intake & Analysis**: Instantaneous evaluation of tabular metrics and unstructured notes.
- **📊 "What-If" Scenario Simulator**: Interactive sliders allow loan officers to adjust borrower metrics in real-time to see how paying off debt impacts risk scoring.
- **🚨 Live Security Alerts**: Global, real-time Firestore listeners trigger UI alerts instantly when a High Risk applicant enters the system.
- **📈 Admin Overwatch**: Comprehensive dashboard featuring 30-day historical trend analysis, geographic risk distribution, and portfolio-wide metrics.
- **📄 Exportable Reports**: One-click generation of clean, print-ready PDF reports for physical underwriting files.
- **✨ Spatial Glassmorphism UI**: A stunning, ultra-premium dark mode interface inspired by Apple visionOS, featuring extreme frosted glass, micro-animations, and dynamic depth.

## 🛠️ Technology Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3)
- **Machine Learning**: `scikit-learn`, `xgboost`, `shap`, `pandas`, `numpy`
- **Generative AI**: `google-generativeai` (Google Gemini 2.5 Pro)
- **Server**: `uvicorn`

### Database & Authentication
- **Provider**: [Firebase](https://firebase.google.com/)
- **Database**: Cloud Firestore (NoSQL, Real-time listeners)
- **Auth**: Firebase Authentication (Google OAuth, Email/Password)

---

## 🚀 Getting Started

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

Configure your environment variables by copying the template:
```bash
cp .env.example .env.local
```
Fill in `.env.local` with your Firebase project credentials.

Start the development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`.

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

Configure your environment variables by copying the template:
```bash
cp .env.example .env
```
Fill in `.env` with your `GEMINI_API_KEY`.

Start the FastAPI server:
```bash
python main.py
```
The backend API will run on `http://localhost:8000`.

---

## 🏗️ Architecture Flow

1. **Data Ingestion**: Loan officer inputs metrics and qualitative notes via the Next.js frontend.
2. **Storage**: Data is securely saved to Firebase Firestore.
3. **Trigger**: Frontend sends a request to the FastAPI backend `/predict` endpoint.
4. **Quantitative Analysis**: XGBoost model predicts baseline default probability and generates SHAP values.
5. **Cognitive Analysis**: Gemini 2.5 Pro extracts a behavioral risk score from the notes and writes a risk narrative based on the SHAP values.
6. **Ensemble & Return**: The final risk tier (Low, Medium, High) is calculated and returned to the UI.
7. **Global Alert**: If the risk is High, Firestore real-time listeners instantly push a notification to the Admin Overwatch dashboard and global Header.

## 🔒 Security
- **API Keys**: All sensitive API keys (Firebase, Gemini) are strictly managed via local environment variables (`.env` and `.env.local`).
- **No Hardcoded Secrets**: Secrets are never checked into version control. Ensure your local `.env` files remain ignored.

## 📄 License
This project is licensed under the MIT License.
