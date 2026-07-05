"use client";

import { motion } from "framer-motion";
import { Brain, Network, Zap, ShieldCheck, Database, Cpu } from "lucide-react";

export default function ModelsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 pt-32">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-6 relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
            <Cpu className="w-8 h-8 text-blue-400 relative z-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white/70 mb-4">
            Solvency AI Engine Architecture
          </h1>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Our dual-engine architecture combines traditional, highly-interpretable gradient boosting with cutting-edge Large Language Models to deliver unprecedented accuracy and transparency in credit risk assessment.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* XGBoost Section */}
          <motion.div variants={itemVariants} className="panel p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Network className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">XGBoost Core</h2>
                <p className="text-emerald-400/80 font-mono text-sm tracking-widest uppercase">Structured Risk Predictor</p>
              </div>
            </div>

            <div className="space-y-4 text-white/60 text-sm leading-relaxed mb-8">
              <p>
                The foundational quantitative model for Solvency AI is built upon <strong>XGBoost (Extreme Gradient Boosting)</strong>. It is trained on historical loan data to evaluate tabular, structured financial metrics.
              </p>
              <p>
                This model handles features such as <code className="bg-black/30 px-1 py-0.5 rounded text-white/80">debt_to_income_ratio</code>, <code className="bg-black/30 px-1 py-0.5 rounded text-white/80">credit_utilization</code>, and <code className="bg-black/30 px-1 py-0.5 rounded text-white/80">account_vintage</code> to output a baseline Probability of Default (PD).
              </p>
              <p>
                We utilize <strong>SHAP (SHapley Additive exPlanations)</strong> to interpret this model in real-time. SHAP provides a mathematical breakdown of exactly how much each financial feature contributed to the final risk probability, ensuring total regulatory compliance and transparency.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400/70 text-xs font-bold uppercase tracking-widest mb-1">
                  <Database className="w-4 h-4" /> Data Type
                </div>
                <div className="text-white/90 font-medium">Tabular Financials</div>
              </div>
              <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-emerald-400/70 text-xs font-bold uppercase tracking-widest mb-1">
                  <ShieldCheck className="w-4 h-4" /> Interpretability
                </div>
                <div className="text-white/90 font-medium">Mathematical (SHAP)</div>
              </div>
            </div>
          </motion.div>

          {/* Gemini 2.5 Pro Section */}
          <motion.div variants={itemVariants} className="panel p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
            
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full animate-pulse" />
                <Brain className="w-6 h-6 text-blue-400 relative z-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Google Gemini 2.5 Pro</h2>
                <p className="text-blue-400/80 font-mono text-sm tracking-widest uppercase">Cognitive Risk Engine</p>
              </div>
            </div>

            <div className="space-y-4 text-white/60 text-sm leading-relaxed mb-8">
              <p>
                Operating in tandem with our quantitative model is our cognitive layer, powered by Google's flagship <strong>Gemini 2.5 Pro</strong> Large Language Model (LLM).
              </p>
              <p>
                Gemini 2.5 Pro performs two critical functions:
                <br />
                <strong>1. Unstructured Data Extraction:</strong> It analyzes raw loan officer notes, behavioral indicators, and unstructured applicant histories to extract hidden risk signals that traditional models miss, outputting a quantifiable <code className="bg-black/30 px-1 py-0.5 rounded text-white/80">behavioral_risk_score</code>.
                <br />
                <strong>2. Narrative Generation:</strong> It ingests the complex mathematical SHAP outputs from the XGBoost model and translates them into a highly readable, plain-English "Risk Narrative" for loan officers, explaining exactly <em>why</em> a decision was reached.
              </p>
              <p>
                Gemini 2.5 Pro was chosen for its unmatched contextual reasoning, scale, and ability to securely process complex financial terminology without hallucinating facts.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-400/70 text-xs font-bold uppercase tracking-widest mb-1">
                  <Database className="w-4 h-4" /> Data Type
                </div>
                <div className="text-white/90 font-medium">Unstructured Notes</div>
              </div>
              <div className="bg-black/30 border border-white/5 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-blue-400/70 text-xs font-bold uppercase tracking-widest mb-1">
                  <Zap className="w-4 h-4" /> Capabilities
                </div>
                <div className="text-white/90 font-medium">Reasoning & GenAI</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Architecture Diagram Placeholder */}
        <motion.div 
          variants={itemVariants}
          initial="hidden"
          animate="show"
          className="mt-8 panel p-8 flex flex-col items-center justify-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-rose-500/5 to-transparent pointer-events-none" />
          <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-widest">Ensemble Pipeline</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full max-w-3xl">
            <div className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-center">
              <div className="text-xs text-white/40 uppercase tracking-widest mb-2 font-bold">Input Data</div>
              <div className="text-sm font-medium text-white/80">Tabular + Notes</div>
            </div>
            
            <div className="hidden md:block w-8 border-t-2 border-dashed border-white/20"></div>
            
            <div className="flex flex-col gap-4 flex-1">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <div className="text-emerald-400 font-bold mb-1">XGBoost</div>
                <div className="text-xs text-white/60">PD Calculation</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                <div className="text-blue-400 font-bold mb-1">Gemini 2.5 Pro</div>
                <div className="text-xs text-white/60">Signal & Narrative</div>
              </div>
            </div>
            
            <div className="hidden md:block w-8 border-t-2 border-dashed border-white/20"></div>
            
            <div className="flex-1 bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-center shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              <div className="text-rose-400 font-bold mb-1">Solvency Decision</div>
              <div className="text-xs text-white/60">Final Output</div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
