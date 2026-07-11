"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Filter, ChevronRight, Activity, Search, ShieldAlert, Zap, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { getBorrowers } from "@/lib/borrowers";
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
};

export function DashboardView() {
  const router = useRouter();
  const [borrowers, setBorrowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const { user, loading: authLoading } = useAuth();

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

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const filtered = borrowers.filter(b => {
    if (filterTier !== "All" && b.riskTier !== filterTier) return false;
    if (filterType !== "All" && b.loanType !== filterType) return false;
    return true;
  });

  const getRiskBadge = (tier: string) => {
    if (tier === "High Risk") return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(244,63,94,0.15)]">
        <ShieldAlert className="w-3.5 h-3.5" /> High Risk
      </div>
    );
    if (tier === "Medium Risk") return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,255,255,0.05)]">
        <Activity className="w-3.5 h-3.5" /> Med Risk
      </div>
    );
    if (tier === "Pending Analysis") return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(99,102,241,0.15)]">
        <Clock className="w-3.5 h-3.5" /> Pending
      </div>
    );
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.15)]">
        <Zap className="w-3.5 h-3.5" /> Low Risk
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-10 relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto space-y-8 relative z-10"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60"
            >
              Portfolio Intelligence
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-blue-200/60 text-lg flex items-center gap-2"
            >
              <Activity className="w-5 h-5 text-blue-400" />
              Monitoring {filtered.length} active risk profiles in real-time.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 w-full md:w-auto"
          >
            <div className="relative group w-full md:w-64">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/30 group-focus-within:text-blue-400 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search ID or Name..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </motion.div>
        </div>

        {/* Filters Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="panel p-5 flex flex-wrap gap-6 items-center"
        >
          <div className="flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-white/50">
            <Filter className="w-4 h-4" />
            <span>Refine View</span>
          </div>

          <div className="h-6 w-px bg-white/10 hidden md:block"></div>

          <div className="flex flex-wrap gap-4 flex-1">
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Risk Tier</label>
              <select
                className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none hover:border-white/20 transition-colors focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                value={filterTier}
                onChange={e => setFilterTier(e.target.value)}
              >
                <option value="All">All Tiers</option>
                <option value="High Risk">High Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="Low Risk">Low Risk</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-white/40 uppercase tracking-widest">Loan Type</label>
              <select
                className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none hover:border-white/20 transition-colors focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Personal">Personal</option>
                <option value="Mortgage">Mortgage</option>
                <option value="Auto">Auto</option>
                <option value="Home">Home</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Risk Trend Chart */}
        {!loading && filtered.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }}
            className="panel p-6 h-[200px] flex flex-col justify-between"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Risk Trend (Last 20)</h3>
            </div>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filtered.slice(0, 20).map(b => ({ name: b.name, prob: b.probability ? b.probability * 100 : 0 }))}>
                  <defs>
                    <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="prob" stroke="#f43f5e" fillOpacity={1} fill="url(#colorProb)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Data Grid */}
        <div className="grid grid-cols-1 gap-4">
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/40 border-b border-white/10">
            <div className="col-span-2">Record ID</div>
            <div className="col-span-3">Borrower Entity</div>
            <div className="col-span-2">Credit Class</div>
            <div className="col-span-2 text-center">12M Default Var.</div>
            <div className="col-span-2 text-center">Assigned Risk Tier</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-3"
          >
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="panel h-[72px] animate-pulse bg-white/5 border border-white/10 flex items-center px-6">
                    <div className="w-20 h-4 bg-white/10 rounded mr-4"></div>
                    <div className="w-32 h-5 bg-white/10 rounded mr-auto"></div>
                    <div className="w-16 h-6 bg-white/10 rounded mr-8"></div>
                    <div className="w-12 h-5 bg-white/10 rounded mr-8"></div>
                    <div className="w-24 h-6 bg-white/10 rounded mr-8"></div>
                    <div className="w-24 h-8 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div variants={itemVariants} className="panel p-16 text-center">
                <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white/70 mb-2">No records found</h3>
                <p className="text-white/40">Try adjusting your filters or search terms.</p>
              </motion.div>
            ) : (
              filtered.map(b => (
                  <motion.div
                    key={b.id}
                    variants={itemVariants}
                    className="group relative panel p-5 md:p-0 overflow-hidden w-full"
                  >
                    {/* Subtle highlight gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative md:grid grid-cols-12 gap-4 md:items-center px-0 md:px-6 py-4">

                      <div className="col-span-2 mb-2 md:mb-0">
                        <span className="md:hidden text-xs font-bold uppercase text-white/40 mr-2">ID:</span>
                        <span className="font-mono text-sm text-blue-300 font-medium group-hover:text-blue-200 transition-colors">{b.id}</span>
                      </div>

                      <div className="col-span-3 mb-4 md:mb-0">
                        <span className="md:hidden text-xs font-bold uppercase text-white/40 mr-2">Name:</span>
                        <span className="font-semibold text-white/90 text-base">{b.name}</span>
                      </div>

                      <div className="col-span-2 mb-4 md:mb-0">
                        <span className="md:hidden text-xs font-bold uppercase text-white/40 mr-2">Type:</span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/70 text-xs font-medium">
                          {b.loanType}
                        </span>
                      </div>

                      <div className="col-span-2 mb-4 md:mb-0 flex md:justify-center">
                        <span className="md:hidden text-xs font-bold uppercase text-white/40 mr-2">Prob:</span>
                        <span className="font-mono font-bold text-base text-white/80">{b.probability !== undefined ? (b.probability * 100).toFixed(1) : "0.0"}%</span>
                      </div>

                      <div className="col-span-2 mb-6 md:mb-0 flex md:justify-center">
                        <span className="md:hidden text-xs font-bold uppercase text-white/40 mr-2">Tier:</span>
                        {getRiskBadge(b.riskTier)}
                      </div>

                      <div className="col-span-1 flex md:justify-end">
                        <button 
                          onClick={() => {
                            setAnalyzingId(b.id);
                            router.push(`/dashboard/borrower/${b.id}`);
                          }}
                          disabled={analyzingId === b.id}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 text-blue-300 hover:text-blue-100 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
                        >
                          {analyzingId === b.id ? (
                            <>Loading <Activity className="w-4 h-4 animate-spin" /></>
                          ) : (
                            <>Analyze <ChevronRight className="w-4 h-4" /></>
                          )}
                        </button>
                      </div>

                    </div>
                  </motion.div>
              ))
            )}
          </motion.div>
        </div>

      </motion.div>
    </div>
  );
}
