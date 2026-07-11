"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Activity, ArrowLeft, ShieldAlert, Cpu, Download, SlidersHorizontal, RefreshCcw, CheckCircle } from "lucide-react";
import Link from "next/link";
import { SeismographPulse } from "@/components/ui/SeismographPulse";
import { useToast } from "@/components/ui/ToastProvider";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";
import { getBorrowerById, updateBorrower } from "@/lib/borrowers";
import Tilt from "react-parallax-tilt";

export function BorrowerDetailView() {
  const { id } = useParams();
  const { showToast } = useToast();
  const { role } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [overrideLoading, setOverrideLoading] = useState(false);
  const [simLoading, setSimLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [borrowerName, setBorrowerName] = useState<string>("");
  const [originalFeatures, setOriginalFeatures] = useState<any>(null);
  
  // Simulation State
  const [simMode, setSimMode] = useState(false);
  const [simFeatures, setSimFeatures] = useState<any>(null);
  
  // Animation controls for the counting effect
  const [displayProb, setDisplayProb] = useState(0);

  const [errorMsg, setErrorMsg] = useState<string>("");

  const fetchPrediction = async (featuresToUse: any, isSimulation = false) => {
    try {
      if (isSimulation) setSimLoading(true);
      else setLoading(true);
      setErrorMsg("");

      const defaultApiUrl = typeof window !== "undefined" 
        ? `http://${window.location.hostname}:8000/predict`
        : "http://localhost:8000/predict";
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || defaultApiUrl;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(featuresToUse)
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API Error (${res.status}): ${errText}`);
      }
      
      const data = await res.json();
      setResult(data);
      
      // Only update Firestore if it's the real data, not a simulation
      if (!isSimulation) {
        await updateBorrower(id as string, {
          riskTier: data.risk_tier,
          probability: data.probability
        });
        showToast("Borrower profile analyzed successfully", "success");
      } else {
        showToast("Simulation completed", "success");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      showToast(`Failed to analyze: ${err.message}`, "error");
    } finally {
      setLoading(false);
      setSimLoading(false);
    }
  };

  useEffect(() => {
    async function loadInitial() {
      try {
        const borrowerData: any = await getBorrowerById(id as string);
        if (!borrowerData) throw new Error("Borrower record not found.");
        
        setBorrowerName(borrowerData.name || "");
        
        const features = {
          income: Number(borrowerData.income) || 45000,
          existing_loans: Number(borrowerData.existing_loans) || 0,
          credit_utilization: Number(borrowerData.credit_utilization) || 0.2,
          dti_ratio: Number(borrowerData.dti_ratio) || 0.3,
          account_vintage_months: Number(borrowerData.account_vintage_months) || 12,
          missed_payments_6m: Number(borrowerData.missed_payments_6m) || 0,
          late_payments_12m: Number(borrowerData.late_payments_12m) || 0,
          loan_type: borrowerData.loanType || "Personal",
          employment_length_months: Number(borrowerData.employment_length_months) || 24,
          liquid_assets: Number(borrowerData.liquid_assets) || 10000,
          loan_amount_requested: Number(borrowerData.loan_amount_requested) || 50000,
          previous_defaults: Number(borrowerData.previous_defaults) || 0,
          education_level: borrowerData.education_level || "Bachelor",
          unstructured_notes: borrowerData.unstructured_notes || ""
        };
        
        setOriginalFeatures(features);
        setSimFeatures(features);
        await fetchPrediction(features, false);
      } catch(err) {
        setLoading(false);
      }
    }
    loadInitial();
  }, [id]);

  useEffect(() => {
    if (result) {
      const target = result.probability * 100;
      let start = 0;
      const duration = 1500; 
      const startTime = performance.now();
      
      const animateCount = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setDisplayProb(start + (target - start) * easeOut);
        
        if (progress < 1) requestAnimationFrame(animateCount);
      };
      requestAnimationFrame(animateCount);
    }
  }, [result]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-9 w-32 bg-white/10 rounded animate-pulse"></div>
            <div className="h-9 w-32 bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="h-10 w-96 bg-white/10 rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 h-64 bg-white/5 border border-white/10 rounded-3xl animate-pulse"></div>
          <div className="col-span-1 md:col-span-2 h-64 bg-white/5 border border-white/10 rounded-3xl animate-pulse"></div>
        </div>
        <div className="h-96 bg-white/5 border border-white/10 rounded-3xl animate-pulse mt-8"></div>
      </div>
    );
  }

  if (!result || errorMsg) {
    return (
      <div className="p-8 flex flex-col items-center pt-32 text-rose-500">
        <ShieldAlert className="w-12 h-12 mb-4 opacity-50" />
        <h1 className="text-2xl font-bold font-mono tracking-widest uppercase mb-2">Analysis Failed</h1>
        <p className="text-sm text-white/40 max-w-md text-center font-mono">
          {errorMsg || "Ensure the FastAPI backend is running and connected."}
        </p>
        <Link href="/dashboard" className="mt-8 text-rose-500 hover:text-rose-400 text-sm font-bold uppercase tracking-widest font-mono">
          &larr; Return to Dashboard
        </Link>
      </div>
    );
  }

  const { risk_tier, shap_top_factors, narrative, recommendation, model_version } = result;
  
  const shapEntries = Object.entries(shap_top_factors as Record<string, number>);
  const maxAbsShap = Math.max(...shapEntries.map(([_, v]) => Math.abs(v)), 1.0);

  const riskColor = risk_tier === "High Risk" ? "var(--color-risk-high)" : risk_tier === "Medium Risk" ? "var(--color-risk-med)" : "var(--color-risk-low)";

  const handleSimulate = () => {
    fetchPrediction(simFeatures, true);
  };

  const handleResetSim = () => {
    setSimFeatures(originalFeatures);
    fetchPrediction(originalFeatures, true); // re-run with original to reset UI
  };

  const handleOverride = async (newTier: string) => {
    try {
      setOverrideLoading(true);
      await updateBorrower(id as string, { riskTier: newTier, overridden: true, overriddenBy: role });
      setResult({ ...result, risk_tier: newTier });
      showToast(`Risk tier overridden to ${newTier}`, "success");
    } catch(err: any) {
      showToast(`Override failed: ${err.message}`, "error");
    } finally {
      setOverrideLoading(false);
    }
  };

  return (
    <div className="p-8 print:p-0 print:bg-black print:text-white print:min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background-color: black !important; }
          .print-hide { display: none !important; }
        }
      `}} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-8 print:space-y-4"
      >
        <div className="flex justify-between items-center print-hide">
          <Link href="/dashboard" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
          </Link>
          <div className="flex gap-4">
            <button 
              onClick={() => setSimMode(!simMode)} 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors ${simMode ? 'bg-blue-500 text-white' : 'bg-white/5 text-blue-300 hover:bg-white/10'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> {simMode ? "Exit Sim" : "What-If Simulator"}
            </button>
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        <header className="flex justify-between items-end border-b border-white/10 pb-6 print:border-white/20 print:pb-4">
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              Borrower Analysis: <span className="text-amber-500 font-mono">{borrowerName || id}</span>
              {simMode && <span className="ml-4 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 align-middle print-hide">SIMULATION MODE</span>}
            </h1>
            <p className="text-gray-400 text-sm flex items-center gap-2 text-mono">
              <Cpu className="w-4 h-4" /> Model Architecture: {model_version}
            </p>
          </div>
        </header>

        {simMode && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="panel p-6 bg-blue-500/5 border-blue-500/20 print-hide">
            <h3 className="text-blue-400 font-bold mb-4 uppercase tracking-widest text-sm flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Adjust Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2 flex justify-between">Income <span>${simFeatures.income}</span></label>
                <input type="range" min="10000" max="250000" step="5000" value={simFeatures.income} onChange={e => setSimFeatures({...simFeatures, income: Number(e.target.value)})} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2 flex justify-between">Credit Util <span>{(simFeatures.credit_utilization * 100).toFixed(0)}%</span></label>
                <input type="range" min="0" max="1" step="0.05" value={simFeatures.credit_utilization} onChange={e => setSimFeatures({...simFeatures, credit_utilization: Number(e.target.value)})} className="w-full accent-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2 flex justify-between">DTI Ratio <span>{(simFeatures.dti_ratio * 100).toFixed(0)}%</span></label>
                <input type="range" min="0" max="1" step="0.05" value={simFeatures.dti_ratio} onChange={e => setSimFeatures({...simFeatures, dti_ratio: Number(e.target.value)})} className="w-full accent-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={handleResetSim} className="text-white/40 hover:text-white text-sm font-semibold transition-colors">Reset</button>
              <button onClick={handleSimulate} disabled={simLoading} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                {simLoading ? <Activity className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} Run Simulation
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} scale={1.02} transitionSpeed={2000} className="col-span-1 h-full">
            <div className="panel h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden print:border print:border-white/20">
              <div className="absolute inset-0 opacity-20 blur-3xl print-hide" style={{ backgroundColor: riskColor }} />
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4 z-10">12M Default Probability</div>
              <div className="text-6xl font-bold text-mono mb-4 z-10" style={{ color: riskColor, textShadow: `0 0 20px ${riskColor}40` }}>
                {displayProb.toFixed(1)}%
              </div>
              <div className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest z-10 backdrop-blur-md border border-white/10 print:border-white/30" style={{ color: riskColor, backgroundColor: `${riskColor}15` }}>
                {risk_tier}
              </div>
              <div className="absolute bottom-0 left-0 w-full opacity-20 z-0 mix-blend-screen pointer-events-none print-hide">
                <SeismographPulse riskTier={risk_tier as any} />
              </div>

              {(role === "Admin" || role === "Senior Underwriter") && !simMode && (
                <div className="absolute bottom-4 left-0 w-full px-8 z-20 flex justify-center print-hide">
                  <div className="flex gap-2 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-2xl">
                    <button onClick={() => handleOverride("Low Risk")} disabled={overrideLoading} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors ${risk_tier === "Low Risk" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "text-white/40 hover:text-white hover:bg-white/10"}`}>Low</button>
                    <button onClick={() => handleOverride("Medium Risk")} disabled={overrideLoading} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors ${risk_tier === "Medium Risk" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-white/40 hover:text-white hover:bg-white/10"}`}>Med</button>
                    <button onClick={() => handleOverride("High Risk")} disabled={overrideLoading} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors ${risk_tier === "High Risk" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "text-white/40 hover:text-white hover:bg-white/10"}`}>High</button>
                  </div>
                </div>
              )}
            </div>
          </Tilt>

          <Tilt tiltMaxAngleX={2} tiltMaxAngleY={2} scale={1.01} transitionSpeed={2000} className="col-span-1 md:col-span-2 h-full">
            <div className="panel h-full p-8 flex flex-col justify-center relative overflow-hidden print:border print:border-white/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 print:border print:border-amber-500/30">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h2 className="font-semibold text-lg text-white tracking-wide">AI Underwriter Narrative</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-[15px] mb-6">
                {narrative}
              </p>
              
              {recommendation && (
                <>
                  <div className="h-px w-full bg-white/10 mb-6 print:bg-white/20"></div>
                  <div className="flex gap-3">
                    <div className="mt-1 text-emerald-500">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-2">Actionable Recommendation</h3>
                      <p className="text-emerald-400/90 text-sm leading-relaxed">{recommendation}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Tilt>
        </div>

        <div className="panel p-8 print:border print:border-white/20">
          <h2 className="font-semibold mb-8 text-lg">SHAP Force Plot</h2>
          
          <div className="relative w-full h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10 flex">
            {/* Base Probability Marker */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 z-20 flex flex-col items-center">
              <div className="text-[10px] bg-black/80 px-1 rounded -mt-4 text-white/50">Base Risk</div>
            </div>

            {/* Negative (Green) Features pushing left */}
            <div className="w-1/2 flex justify-end h-full">
              {shapEntries.filter(([_, v]) => v <= 0).map(([k, v], i) => {
                const width = (Math.abs(v) / maxAbsShap) * 100;
                return (
                  <div key={k} className="h-full border-r border-black/20 group relative cursor-help transition-all hover:opacity-80" 
                       style={{ width: `${Math.max(width, 2)}%`, backgroundColor: '#10b981' }}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 z-30">
                      <span className="text-[10px] font-bold text-black drop-shadow-md truncate px-1">{k}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Positive (Red) Features pushing right */}
            <div className="w-1/2 flex justify-start h-full">
              {shapEntries.filter(([_, v]) => v > 0).map(([k, v], i) => {
                const width = (Math.abs(v) / maxAbsShap) * 100;
                return (
                  <div key={k} className="h-full border-l border-black/20 group relative cursor-help transition-all hover:opacity-80" 
                       style={{ width: `${Math.max(width, 2)}%`, backgroundColor: '#f43f5e' }}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 z-30">
                      <span className="text-[10px] font-bold text-white drop-shadow-md truncate px-1">{k}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Legend & Details */}
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40 mt-4 mb-6">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Reduces Risk</div>
            <div className="flex items-center gap-2">Increases Risk <div className="w-3 h-3 bg-rose-500 rounded-sm"></div></div>
          </div>

          {/* Detailed Waterfall Table */}
          <div className="space-y-3 mt-6">
            {shapEntries.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).map(([category, value]) => {
              const isPositive = value > 0;
              return (
                <div key={category} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span className="text-sm text-gray-400 font-mono">{category}</span>
                  <span className="text-sm font-mono font-medium" style={{ color: isPositive ? '#f43f5e' : '#10b981' }}>
                    {isPositive ? '+' : ''}{value.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </motion.div>
    </div>
  );
}
