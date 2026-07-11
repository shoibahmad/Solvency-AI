import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/predict',
        destination: 'http://127.0.0.1:8000/predict',
      },
    ]
  },
};

export default nextConfig;
