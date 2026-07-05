"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, ArrowRight, ShieldAlert } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rose-500/5 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 p-6"
      >
        <div className="panel p-8 md:p-10 relative overflow-hidden group">
          {/* Subtle hover effect on the panel itself */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-indigo-500/0 group-hover:from-emerald-500/5 group-hover:to-indigo-500/5 transition-colors duration-700 pointer-events-none"></div>

          <div className="flex justify-center mb-6">
            <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Activity className="w-8 h-8" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            Request Access
          </h1>
          <p className="text-white/40 text-center text-sm mb-8 font-medium tracking-wide">
            Register for Solvency AI risk assessment system
          </p>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm p-3 rounded-xl mb-6 shadow-[0_0_15px_rgba(244,63,94,0.1)] flex items-start gap-2"
            >
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleEmailSignup} className="space-y-5 relative z-10">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">New Officer Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:bg-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="new_officer@solvency.ai"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Secure Passcode</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:bg-white/5 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 mt-2 flex justify-center items-center gap-2"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>Register Clearance <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-white/10"></div>
            <span className="px-4 text-xs font-bold text-white/30 uppercase tracking-widest text-mono">OR</span>
            <div className="flex-1 border-t border-white/10"></div>
          </div>

          <button
            onClick={handleGoogleSignup}
            disabled={loading}
            className="relative z-10 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <div className="mt-8 pt-6 border-t border-white/5 text-sm text-center text-white/40 font-medium relative z-10">
            Already authorized? <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors hover:underline">Return to login</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
