"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SeismographPulseProps {
  riskTier: "Low Risk" | "Medium Risk" | "High Risk";
  className?: string;
}

export function SeismographPulse({ riskTier, className = "" }: SeismographPulseProps) {
  const [points, setPoints] = useState<string>("");

  useEffect(() => {
    // Generate base points based on risk tier
    const generatePoints = () => {
      const width = 300;
      const numPoints = 60;
      const spacing = width / numPoints;
      
      let amplitude = 2; // Low risk
      if (riskTier === "Medium Risk") amplitude = 15;
      if (riskTier === "High Risk") amplitude = 40;

      let newPoints = `0,50 `;
      for (let i = 1; i < numPoints; i++) {
        const x = i * spacing;
        // Random volatility based on amplitude
        const volatility = (Math.random() - 0.5) * 2; // -1 to 1
        const y = 50 + (volatility * amplitude);
        newPoints += `${x},${y} `;
      }
      newPoints += `${width},50`;
      setPoints(newPoints);
    };

    generatePoints();
    
    // Update interval based on risk (faster for high risk)
    const intervalTime = riskTier === "High Risk" ? 100 : riskTier === "Medium Risk" ? 300 : 800;
    const interval = setInterval(generatePoints, intervalTime);
    
    return () => clearInterval(interval);
  }, [riskTier]);

  const color = 
    riskTier === "High Risk" ? "#f43f5e" : // Coral
    riskTier === "Medium Risk" ? "#f59e0b" : // Amber
    "#10b981"; // Emerald

  return (
    <div className={`w-full overflow-hidden flex items-center ${className}`}>
      <svg 
        viewBox="0 0 300 100" 
        preserveAspectRatio="none" 
        className="w-full h-12"
      >
        <motion.polyline
          points={points || "0,50 300,50"}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          animate={{ points: points || "0,50 300,50" }}
          transition={{ ease: "linear", duration: riskTier === "High Risk" ? 0.1 : 0.3 }}
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );
}
