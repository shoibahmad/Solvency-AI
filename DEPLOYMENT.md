# Solvency AI Deployment Guide

This document outlines the recommended strategies for deploying the Solvency AI platform to production. The application is fully containerized, making it highly portable across different cloud providers.

There are two primary deployment paths:
1. **Single Server (VPS)**: Best for simplicity and cost-effectiveness. Runs everything on one machine using Docker Compose.
2. **Managed Cloud Services**: Best for scalability. Splits the frontend (Vercel) and backend (Render/Cloud Run).

---

## Environment Variables Reference

Regardless of how you deploy, you will need the following environment variables configured in your production environment:

### Backend Required Variables
| Variable | Description | Example |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Your Google Gemini API Key | `AIzaSy...` |
| `ALLOWED_ORIGINS` | Comma-separated list of domains allowed to access the API | `https://your-frontend-domain.com` |

### Frontend Required Variables
| Variable | Description | Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The public URL where the backend is hosted | `https://api.yourdomain.com/predict` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain | `app.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | `solvency-ai-123` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| Firebase Storage Bucket | `solvency-ai.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`| Firebase Sender ID | `1234567890` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID | `1:1234:web:abc` |

---

## Option 1: Single Server VPS Deployment (Recommended for Testing/MVP)

This method involves renting a Virtual Private Server (e.g., DigitalOcean Droplet, AWS EC2, Hetzner) running Ubuntu and deploying the entire stack using `docker-compose`.

### 1. Initial Server Setup
SSH into your Ubuntu server and run the following commands to install Git and Docker:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install prerequisites
sudo apt install ca-certificates curl gnupg git -y

# Add Docker's official GPG key and repository
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Enable Docker on startup
sudo systemctl enable docker
sudo systemctl start docker
```

### 2. Clone the Repository
```bash
git clone https://github.com/shoibahmad/Solvency-AI.git
cd Solvency-AI
```

### 3. Configure Environment Variables
Create the `.env` file required by Docker Compose. **Replace the placeholder values** below with your actual credentials:

```bash
cat << 'EOF' > .env
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_ORIGINS=*
NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:8000/predict

NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EOF
```

### 4. Build and Start the Stack
Start the containers in detached mode:
```bash
sudo docker compose up -d --build
```
Your frontend will be accessible at `http://YOUR_SERVER_IP:3000` and the API at `http://YOUR_SERVER_IP:8000`.

---

## Option 2: Managed Cloud Services (Unified Render Deployment)

For auto-scaling, SSL termination, and zero server maintenance, you can deploy both the frontend and backend together as a single Web Service on Render.

### Deployment Steps
1. Push all your code (including the root `Dockerfile` and `start.sh`) to your GitHub repository.
2. Create an account on [Render](https://render.com).
3. Click **New +** > **Web Service**.
4. Connect your GitHub repository.
5. **Important:** Leave the **Root Directory** field BLANK.
6. Render will automatically detect the `Dockerfile` at the root of the project.
7. Scroll down to **Environment Variables** and add the following:
   - `GEMINI_API_KEY`: (Your Google Gemini API Key)
   - `ALLOWED_ORIGINS`: `*`
   - `NEXT_PUBLIC_API_URL`: `/predict` *(This exact value is crucial! It tells the frontend to use the internal proxy)*
   - Add all your `NEXT_PUBLIC_FIREBASE_*` variables exactly as they are in your `.env.global` or `.env.local` file.
8. Click **Deploy**.

Render will now build your unified container (installing Python, Node, building Next.js, etc.) and launch it. You will be given a single URL (e.g., `https://solvency-app.onrender.com`) where your full-stack application will be live!

---

## Troubleshooting

- **CORS Errors**: If the frontend console shows CORS errors when trying to analyze a borrower, ensure that the `ALLOWED_ORIGINS` environment variable on the backend perfectly matches the frontend's domain (including `https://` and excluding any trailing slashes).
- **Docker Build Fails**: If the backend Docker build fails on the `pip install` step, ensure your server has at least 1GB of RAM, as `scikit-learn` and `xgboost` require memory to compile/install.
- **Analysis Failed Error**: This usually means the frontend cannot reach the backend URL specified in `NEXT_PUBLIC_API_URL`. Verify the URL is correct and the backend server is running.
