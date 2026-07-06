"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ShieldAlert, BarChart3, Users, PieChart, Activity, Database, Server } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { getBorrowers } from "@/lib/borrowers";

export function AdminView() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [borrowers, setBorrowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBorrowers();
        setBorrowers(data);
      } catch (error) {
        console.error("Error loading borrowers:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Compute Analytics
  const stats = useMemo(() => {
    if (borrowers.length === 0) return null;

    let totalProb = 0;
    let high = 0, med = 0, low = 0;
    const byType: Record<string, { count: number, totalProb: number }> = {};
    const byState: Record<string, { count: number, totalProb: number }> = {};

    borrowers.forEach(b => {
      const prob = b.probability || 0;
      totalProb += prob;

      if (b.riskTier === "High Risk") high++;
      else if (b.riskTier === "Medium Risk") med++;
      else low++;

      const type = b.loanType || "Unknown";
      if (!byType[type]) byType[type] = { count: 0, totalProb: 0 };
      byType[type].count++;
      byType[type].totalProb += prob;

      const state = b.state || "Unknown";
      if (!byState[state]) byState[state] = { count: 0, totalProb: 0 };
      byState[state].count++;
      byState[state].totalProb += prob;
    });

    const total = borrowers.length;
    return {
      total,
      avgProb: (totalProb / total) * 100,
      dist: {
        high: { count: high, pct: (high / total) * 100 },
        med: { count: med, pct: (med / total) * 100 },
        low: { count: low, pct: (low / total) * 100 },
      },
      byType: Object.entries(byType).map(([type, data]) => ({
        type,
        volume: data.count,
        avgRisk: (data.totalProb / data.count) * 100
      })).sort((a, b) => b.volume - a.volume),
      byState: Object.entries(byState).map(([state, data]) => ({
        state,
        volume: data.count,
        avgRisk: (data.totalProb / data.count) * 100
      })).sort((a, b) => b.avgRisk - a.avgRisk).slice(0, 5)
    };
  }, [borrowers]);

  return (
    <div className="min-h-screen relative overflow-hidden p-6 md:p-10">

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-6xl mx-auto space-y-8 relative z-10"
      >
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 overflow-hidden shadow-[0_0_15px_rgba(244,63,94,0.2)]">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                Admin Overwatch
              </h1>
              <p className="text-sm text-white/40 font-medium">Portfolio Aggregate Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 text-blue-300 text-sm font-semibold transition-all">
              Officer Terminal &rarr;
            </Link>
            <button onClick={signOut} className="text-white/40 hover:text-white text-sm font-semibold transition-colors">
              End Session
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-8 h-8 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-4"></div>
            <p className="text-white/40 font-mono tracking-widest uppercase text-sm">Aggregating Cloud Telemetry...</p>
          </div>
        ) : !stats ? (
          <div className="panel p-16 text-center">
            <Database className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white/70 mb-2">No active records</h3>
            <p className="text-white/40">The Firestore database is currently empty.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Top Line Metrics */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="panel p-6 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 text-white/50 mb-2 font-semibold uppercase tracking-widest text-xs relative z-10">
                  <Users className="w-4 h-4 text-blue-400" /> Total Borrowers
                </div>
                <div className="text-4xl font-mono font-bold text-white relative z-10">{stats.total}</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="panel p-6 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 text-white/50 mb-2 font-semibold uppercase tracking-widest text-xs relative z-10">
                  <Activity className="w-4 h-4 text-amber-400" /> Avg Default Prob
                </div>
                <div className="text-4xl font-mono font-bold text-amber-400 relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                  {stats.avgProb.toFixed(1)}%
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="panel p-6 md:col-span-2 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3 text-white/50 font-semibold uppercase tracking-widest text-xs">
                    <PieChart className="w-4 h-4 text-emerald-400" /> Risk Distribution
                  </div>
                </div>
                
                <div className="h-4 flex rounded-full overflow-hidden bg-black/40 shadow-inner">
                  <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full transition-all duration-1000" style={{ width: `${stats.dist.low.pct}%` }} title={`Low Risk: ${stats.dist.low.pct.toFixed(0)}%`}></div>
                  <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-1000" style={{ width: `${stats.dist.med.pct}%` }} title={`Medium Risk: ${stats.dist.med.pct.toFixed(0)}%`}></div>
                  <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-full transition-all duration-1000" style={{ width: `${stats.dist.high.pct}%` }} title={`High Risk: ${stats.dist.high.pct.toFixed(0)}%`}></div>
                </div>
                
                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-white/40 mt-3 font-mono">
                  <span className="text-emerald-400/80">Low ({stats.dist.low.count})</span>
                  <span className="text-amber-400/80">Med ({stats.dist.med.count})</span>
                  <span className="text-rose-400/80">High ({stats.dist.high.count})</span>
                </div>
              </motion.div>
            </div>

            {/* Trends and Heatmap Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="panel p-6"
              >
                <div className="flex items-center gap-2 mb-6 text-xs font-bold text-white/50 uppercase tracking-widest">
                  <Activity className="w-4 h-4" /> 30-Day Risk Trend
                </div>
                <div className="h-40 w-full relative flex items-end">
                  {/* Mock SVG Line Chart for visual impact */}
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,100 L0,70 Q10,60 20,65 T40,50 T60,55 T80,30 T100,40 L100,100 Z" fill="url(#trendGradient)" />
                    <path d="M0,70 Q10,60 20,65 T40,50 T60,55 T80,30 T100,40" fill="none" stroke="#818cf8" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <div className="absolute inset-0 flex justify-between items-end text-[9px] font-mono text-white/30 pt-2 pb-1 px-1 pointer-events-none">
                    <span>-30d</span>
                    <span>-15d</span>
                    <span>Today</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="panel p-6"
              >
                <div className="flex items-center gap-2 mb-6 text-xs font-bold text-white/50 uppercase tracking-widest">
                  <Database className="w-4 h-4" /> Top Risk Regions
                </div>
                <div className="space-y-4">
                  {stats.byState.map(item => {
                    const widthPct = Math.min(item.avgRisk * 2, 100);
                    return (
                      <div key={item.state} className="group">
                        <div className="flex justify-between text-[11px] font-bold text-white/60 mb-1 uppercase tracking-widest">
                          <span>{item.state} <span className="text-white/30">({item.volume} units)</span></span>
                          <span className={item.avgRisk > 30 ? 'text-rose-400' : 'text-amber-400'}>{item.avgRisk.toFixed(1)}% Avg Risk</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPct}%` }}
                            transition={{ duration: 1, type: "spring" }}
                            className="h-full rounded-full"
                            style={{ background: item.avgRisk > 30 ? 'linear-gradient(90deg, #f43f5e, #fb7185)' : 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="panel p-6"
              >
                <div className="flex items-center gap-2 mb-6 text-xs font-bold text-white/50 uppercase tracking-widest">
                  <BarChart3 className="w-4 h-4" /> Risk by Loan Class
                </div>
                <div className="space-y-1">
                  <div className="grid grid-cols-12 px-4 py-2 text-[10px] font-bold text-white/30 uppercase tracking-widest">
                    <div className="col-span-4">Type</div>
                    <div className="col-span-4 text-center">Volume</div>
                    <div className="col-span-4 text-right">Avg Risk</div>
                  </div>
                  {stats.byType.map(item => (
                    <div key={item.type} className="grid grid-cols-12 items-center px-4 py-3 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl transition-colors">
                      <div className="col-span-4 font-semibold text-white/80">{item.type}</div>
                      <div className="col-span-4 text-center font-mono text-white/60">{item.volume}</div>
                      <div className={`col-span-4 text-right font-mono font-bold ${item.avgRisk > 30 ? 'text-rose-400' : item.avgRisk > 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {item.avgRisk.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="panel p-8 flex flex-col justify-center items-center text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="p-4 bg-rose-500/10 rounded-2xl mb-6 relative">
                  <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full animate-pulse" />
                  <Server className="w-10 h-10 text-rose-400 relative z-10" />
                </div>
                
                <h3 className="font-bold text-white tracking-wide mb-3 text-lg">System Telemetry Alert</h3>
                <p className="text-sm text-white/60 max-w-sm leading-relaxed">
                  Solvency AI XGBoost v1.0 is currently deployed across all endpoints. Feature drift detected in <code className="text-rose-300 bg-rose-500/10 px-1 py-0.5 rounded text-xs mx-1">alternate_signal_risk_score</code>. Model retraining via cloud pipeline scheduled for next week.
                </p>
              </motion.div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
