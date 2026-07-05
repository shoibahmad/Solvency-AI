"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, FileText, Database } from "lucide-react";
import Link from "next/link";
import { addBorrower } from "@/lib/borrowers";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/ToastProvider";

export default function IntakePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    income: "",
    loanType: "Personal",
    existing_loans: "0",
    credit_utilization: "0.2",
    dti_ratio: "0.3",
    account_vintage_months: "12",
    missed_payments_6m: "0",
    late_payments_12m: "0",
    state: "CA",
    unstructured_notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addBorrower(formData);
      showToast("Applicant record committed to Firebase Firestore.", "success");
      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err: any) {
      showToast(err.message, "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-6 md:p-10">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-rose-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-4xl mx-auto space-y-8 relative z-10"
      >
        <Link href="/dashboard" className="text-white/40 hover:text-white flex items-center gap-2 w-fit text-sm transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Return to Terminal
        </Link>

        <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              New Applicant Intake
            </h1>
            <p className="text-white/40 text-sm font-medium">Provision new entity into the risk assessment pipeline.</p>
          </div>
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-mono bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
            <Database className="w-4 h-4" /> Firebase Cloud Mode
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Structured Data Panel */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="panel p-8 space-y-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white tracking-wide">Structured Telemetry</h3>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent mb-6"></div>
              
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Applicant Entity Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/5 focus:border-indigo-500/50 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 placeholder-white/20" placeholder="e.g. John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">State / Region</label>
                    <select name="state" value={formData.state} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/5 focus:border-indigo-500/50 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer">
                      <option value="CA">California (CA)</option>
                      <option value="NY">New York (NY)</option>
                      <option value="TX">Texas (TX)</option>
                      <option value="FL">Florida (FL)</option>
                      <option value="IL">Illinois (IL)</option>
                      <option value="WA">Washington (WA)</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Annual Income ($)</label>
                    <input type="number" name="income" value={formData.income} onChange={handleChange} required className="text-mono w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/5 focus:border-indigo-500/50 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20" placeholder="75000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Loan Class</label>
                    <select name="loanType" value={formData.loanType} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/5 focus:border-indigo-500/50 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer">
                      <option value="Personal">Personal</option>
                      <option value="Home">Home</option>
                      <option value="Auto">Auto</option>
                      <option value="Mortgage">Mortgage</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Active Loans</label>
                    <input type="number" name="existing_loans" value={formData.existing_loans} onChange={handleChange} className="text-mono w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/5 focus:border-indigo-500/50 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Credit Util. (0-1)</label>
                    <input type="number" step="0.01" name="credit_utilization" value={formData.credit_utilization} onChange={handleChange} className="text-mono w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/5 focus:border-indigo-500/50 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Account Age (mo)</label>
                    <input type="number" name="account_vintage_months" value={formData.account_vintage_months} onChange={handleChange} className="text-mono w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/5 focus:border-indigo-500/50 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">DTI Ratio</label>
                    <input type="number" step="0.01" name="dti_ratio" value={formData.dti_ratio} onChange={handleChange} className="text-mono w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/5 focus:border-indigo-500/50 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Unstructured Data Panel */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="panel p-8 space-y-6 flex flex-col"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-rose-400" />
                <h3 className="font-bold text-white tracking-wide">Unstructured Narratives</h3>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-white/20 to-transparent mb-6"></div>
              
              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Officer Notes & Bank Statement OCR</label>
                <textarea 
                  name="unstructured_notes"
                  value={formData.unstructured_notes}
                  onChange={handleChange}
                  className="flex-1 w-full min-h-[250px] bg-black/20 border border-white/10 rounded-xl px-4 py-4 text-white focus:bg-white/5 focus:border-rose-500/50 outline-none resize-none transition-all focus:ring-2 focus:ring-rose-500/20 placeholder-white/20"
                  placeholder="Enter raw unstructured text here. The Solvency AI LLM cluster will automatically extract hidden behavioral risk signals and embed them into the primary prediction matrix..."
                ></textarea>
                
                <div className="mt-4 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                  <p className="text-xs text-rose-200/70 font-medium leading-relaxed">
                    <span className="text-rose-400 font-bold">LLM Pipeline Active:</span> This text will be processed by the Solvency AI Underwriter Agent to extract implicit risk vectors (-10 to +10 scale) before being fed into the XGBoost classification model.
                  </p>
                </div>
              </div>
            </motion.div>
            
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end pt-4"
          >
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] disabled:opacity-50 hover:-translate-y-1"
            >
              {loading ? (
                <>Processing...</>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Commit Record
                </>
              )}
            </button>
          </motion.div>
        </form>

      </motion.div>
    </div>
  );
}
