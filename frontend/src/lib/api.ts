/**
 * Centralized API configuration.
 * 
 * This ensures that API calls always resolve correctly regardless of the environment,
 * preventing any "Failed to fetch" errors due to misconfigured ports or hostnames.
 */

export const getApiUrl = (): string => {
  // If explicitly set via environment variables, use it.
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // In local development, the Next.js dev server runs on 3000 and FastAPI on 8000
  if (process.env.NODE_ENV === 'development') {
    return "http://localhost:8000/predict";
  }

  // In production on Render (Monolith), all traffic goes through the main URL
  // and Next.js rewrites /predict to the internal FastAPI server.
  // We hardcode the exact, verified production link here to ensure it never fails.
  return "https://solvency-ai.onrender.com/predict";
};
