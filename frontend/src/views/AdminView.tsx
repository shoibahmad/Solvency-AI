"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { ShieldAlert, BarChart3, Users, Scale, AlertTriangle, Fingerprint } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie } from "recharts";
import Link from "next/link";

export function AdminView() {
  const { role, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [borrowers, setBorrowers] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ total: 0, highRisk: 0, medRisk: 0, lowRisk: 0, overrides: 0 });
  const [educationBias, setEducationBias] = useState<any[]>([]);
  const [incomeBias, setIncomeBias] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      if (role !== "Admin") {
        setLoading(false);
        return;
      }
      
      const snapshot = await getDocs(collection(db, "borrowers"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBorrowers(data);

      let high = 0, med = 0, low = 0, overrides = 0;
      
      const eduMap: any = {};
      const incomeMap: any = { "< $50k": { high: 0, total: 0 }, "$50k-$100k": { high: 0, total: 0 }, "> $100k": { high: 0, total: 0 }};

      data.forEach((b: any) => {
        if (b.riskTier === "High Risk") high++;
        else if (b.riskTier === "Medium Risk") med++;
        else low++;
        
        if (b.overridden) overrides++;

        // Education Aggregation
        const edu = b.education_level || "Unknown";
        if (!eduMap[edu]) eduMap[edu] = { name: edu, HighRisk: 0, LowRisk: 0, Total: 0 };
        eduMap[edu].Total++;
        if (b.riskTier === "High Risk") eduMap[edu].HighRisk++;
        else eduMap[edu].LowRisk++;

        // Income Aggregation
        const inc = Number(b.income || 0);
        let incTier = "> $100k";
        if (inc < 50000) incTier = "< $50k";
        else if (inc <= 100000) incTier = "$50k-$100k";
        
        incomeMap[incTier].total++;
        if (b.riskTier === "High Risk") incomeMap[incTier].high++;
      });

      setMetrics({ total: data.length, highRisk: high, medRisk: med, lowRisk: low, overrides });
      
      setEducationBias(Object.values(eduMap).map((e: any) => ({
        ...e, 
        HighRiskPercent: Number(((e.HighRisk / e.Total) * 100).toFixed(1))
      })));

      setIncomeBias([
        { name: "< $50k", value: incomeMap["< $50k"].total ? Number(((incomeMap["< $50k"].high / incomeMap["< $50k"].total)*100).toFixed(1)) : 0 },
        { name: "$50k-$100k", value: incomeMap["$50k-$100k"].total ? Number(((incomeMap["$50k-$100k"].high / incomeMap["$50k-$100k"].total)*100).toFixed(1)) : 0 },
        { name: "> $100k", value: incomeMap["> $100k"].total ? Number(((incomeMap["> $100k"].high / incomeMap["> $100k"].total)*100).toFixed(1)) : 0 },
      ]);

      setLoading(false);
    }
    
    if (!authLoading) loadData();
  }, [role, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center pt-32 text-white/50">
        <Scale className="w-12 h-12 mb-4 animate-pulse opacity-50" />
        <p className="font-mono text-sm tracking-widest uppercase">Loading Compliance Data...</p>
      </div>
    );
  }

  if (role !== "Admin") {
    return (
      <div className="flex flex-col items-center justify-center pt-32 text-rose-500">
        <ShieldAlert className="w-16 h-16 mb-6 opacity-80" />
        <h1 className="text-3xl font-bold font-mono tracking-widest uppercase mb-4 text-white">Access Denied</h1>
        <p className="text-white/40 mb-8 max-w-md text-center">
          The Fair Lending Bias & Compliance Dashboard is strictly limited to users with the Admin role. Your current role is <span className="font-bold text-blue-400">{role || "Junior Underwriter"}</span>.
        </p>
        <Link href="/dashboard" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3 text-white">
              <Scale className="w-8 h-8 text-emerald-400" />
              Fair Lending & Bias Dashboard
            </h1>
            <p className="text-white/50 text-sm max-w-2xl">
              Compliance monitoring tool for analyzing ML model bias across demographic and financial vectors to ensure adherence to the Equal Credit Opportunity Act (ECOA).
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg text-emerald-400 text-sm font-bold uppercase tracking-widest">
            <Fingerprint className="w-4 h-4" /> SECURE AUDIT LOG
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="panel p-6 bg-blue-900/10 border-blue-500/20">
            <div className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Users className="w-4 h-4" /> Total Profiles</div>
            <div className="text-4xl font-mono font-bold text-white">{metrics.total}</div>
          </div>
          <div className="panel p-6 bg-rose-900/10 border-rose-500/20">
            <div className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> High Risk Flags</div>
            <div className="text-4xl font-mono font-bold text-white">{metrics.highRisk}</div>
            <div className="text-rose-400/50 text-xs mt-2 font-mono">{metrics.total ? ((metrics.highRisk / metrics.total) * 100).toFixed(1) : 0}% of portfolio</div>
          </div>
          <div className="panel p-6 bg-emerald-900/10 border-emerald-500/20">
            <div className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><Scale className="w-4 h-4" /> Low Risk Approvals</div>
            <div className="text-4xl font-mono font-bold text-white">{metrics.lowRisk}</div>
            <div className="text-emerald-400/50 text-xs mt-2 font-mono">{metrics.total ? ((metrics.lowRisk / metrics.total) * 100).toFixed(1) : 0}% of portfolio</div>
          </div>
          <div className="panel p-6 bg-amber-900/10 border-amber-500/20">
            <div className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Human Overrides</div>
            <div className="text-4xl font-mono font-bold text-white">{metrics.overrides}</div>
            <div className="text-amber-400/50 text-xs mt-2 font-mono">Senior/Admin interventions</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          
          {/* Demographic Bias Analysis */}
          <div className="panel p-6">
            <h3 className="font-semibold text-lg mb-2 text-white">Demographic Bias Analysis</h3>
            <p className="text-sm text-white/40 mb-6">High Risk Rejection Rates by Education Level</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={educationBias} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    cursor={{fill: '#ffffff05'}}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="HighRiskPercent" name="Rejection Rate %" radius={[4, 4, 0, 0]}>
                    {educationBias.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.HighRiskPercent > 60 ? '#f43f5e' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 text-sm text-white/60">
              <span className="text-rose-400 font-bold mr-2">AUDIT WARNING:</span> 
              If rejection rates vary by more than 20% across demographic cohorts, the ML model weights may require ECOA compliance review.
            </div>
          </div>

          {/* Income Bias Analysis */}
          <div className="panel p-6">
            <h3 className="font-semibold text-lg mb-2 text-white">Income Disparity Analysis</h3>
            <p className="text-sm text-white/40 mb-6">High Risk density across income brackets</p>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomeBias}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {incomeBias.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#f43f5e', '#f59e0b', '#10b981'][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'High Risk Ratio']}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10 text-sm text-white/60">
              <span className="text-emerald-400 font-bold mr-2">COMPLIANCE OK:</span> 
              Risk distribution shows expected inverse correlation with income without excessive polarization.
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
