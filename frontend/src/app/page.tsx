"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap, BrainCircuit, ChevronRight, ArrowRight, Database, Network } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function LandingPage() {
  const { user } = useAuth();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] relative overflow-hidden flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-20 pb-32 max-w-7xl mx-auto w-full">
        
        {/* Hero Section */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={stagger}
          className="text-center max-w-4xl mx-auto flex flex-col items-center"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <Zap className="w-3.5 h-3.5" />
            <span>The Future of Underwriting</span>
          </motion.div>
          
          <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-8 leading-[1.1]">
            A verdict on creditworthiness. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
              Explained in seconds.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/50 max-w-2xl mb-12 leading-relaxed">
            Solvency AI combines quantitative machine learning with cognitive Large Language Models to instantly underwrite loans and generate plain-English risk narratives. No more black boxes.
          </motion.p>
          
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4">
            {user ? (
              <Link href="/dashboard" className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-blue-600 rounded-lg overflow-hidden transition-all hover:bg-blue-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]">
                <span className="relative z-10 flex items-center gap-2">Go to Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-blue-600 rounded-lg overflow-hidden transition-all hover:bg-blue-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]">
                  <span className="relative z-10 flex items-center gap-2">Start Underwriting <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></span>
                </Link>
                <Link href="/models" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white/80 bg-white/5 border border-white/10 rounded-lg transition-all hover:bg-white/10 hover:text-white">
                  Explore Architecture
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid md:grid-cols-3 gap-6 mt-32 w-full"
        >
          <motion.div variants={fadeIn} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white/90 mb-3">Cognitive XAI</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Gemini 2.5 Pro translates complex mathematical SHAP values into readable, plain-English narratives explaining exactly why a borrower was approved or denied.
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white/90 mb-3">XGBoost Core</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Powered by advanced gradient boosting algorithms to analyze structured financial metrics like Debt-to-Income, generating a highly accurate Probability of Default (PD).
            </p>
          </motion.div>

          <motion.div variants={fadeIn} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-500/30 hover:bg-white/[0.04] transition-all group shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-rose-400" />
            </div>
            <h3 className="text-xl font-bold text-white/90 mb-3">Global Security Alerts</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Real-time Firestore listeners trigger instantaneous UI alerts across the entire network whenever a High Risk applicant is ingested, ensuring rapid manual review.
            </p>
          </motion.div>
        </motion.div>

      </main>
    </div>
  );
}
