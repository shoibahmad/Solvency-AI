"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bell, Settings, LogOut, ChevronDown, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/ui/ToastProvider";

export function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState(pathname);
  const { showToast } = useToast();
  
  const [hasNewAlert, setHasNewAlert] = useState(false);
  const [alerts, setAlerts] = useState<{id: string, text: string, time: string}[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const initialRender = useRef(true);

  useEffect(() => {
    if (!user) return;
    
    // Listen for the most recently added/updated borrower
    const q = query(collection(db, "borrowers"), orderBy("createdAt", "desc"), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (initialRender.current) {
        initialRender.current = false;
        return;
      }
      
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const data = change.doc.data();
          if (data.riskTier === "High Risk") {
            setHasNewAlert(true);
            setAlerts(prev => [{
              id: change.doc.id,
              text: `High Risk applicant detected: ${data.name || "Unknown"}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }, ...prev].slice(0, 5));
            showToast(`SYSTEM ALERT: High Risk applicant detected (${data.name || "Unknown"})`, "error");
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user, showToast]);

  const navItems = [
    { path: "/dashboard", name: "Dashboard" },
    { path: "/intake", name: "New Intake" },
    { path: "/models", name: "Models" },
    { path: "/admin", name: "Admin" },
  ];

  return (
    <header className="sticky top-6 z-50 w-full px-4 md:px-8 pointer-events-none mb-12">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-2 rounded-[2rem] bg-black/20 backdrop-blur-[40px] border border-white/[0.08] shadow-[0_30px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] pointer-events-auto">
        
        {/* Left - Logo Area */}
        <div className="flex items-center pl-2 pr-6 py-1">
          <Link href="/dashboard" className="flex items-center gap-3 group/logo transition-opacity hover:opacity-80">
            <div className="flex items-center justify-center w-9 h-9 rounded-[1rem] bg-white/5 border border-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <Activity className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white/90 text-sm">
                Solvency AI
              </span>
            </div>
          </Link>
        </div>

        {/* Center - Navigation (Floating inner pill) */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-white/[0.02] rounded-full border border-white/[0.05] shadow-inner" onMouseLeave={() => setHoveredPath(pathname)}>
          {navItems.map((item) => {
            const isActive = item.path === pathname || (item.path !== "#" && pathname?.startsWith(item.path) && item.path !== "/");
            return (
              <Link
                key={item.name}
                href={item.path}
                onMouseEnter={() => setHoveredPath(item.path)}
                className={`relative px-5 py-2 text-[13px] font-medium tracking-wide transition-colors rounded-full ${isActive ? "text-white" : "text-white/60 hover:text-white"}`}
              >
                {hoveredPath === item.path && (
                  <motion.div
                    layoutId="vision-hover-pill"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                {isActive && hoveredPath !== item.path && (
                  <div className="absolute inset-0 bg-white/[0.08] rounded-full -z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
                )}
                <span className="relative z-10">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right - User Actions */}
        <div className="flex items-center gap-2 pr-2" data-no-loader="true">
          {user ? (
            <>
              <div className="relative">
                <button 
                  onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); setHasNewAlert(false); }}
                  className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white bg-white/0 hover:bg-white/10 rounded-full transition-all relative group/btn shadow-[inset_0_1px_0_rgba(255,255,255,0)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                >
                  <motion.div
                    animate={hasNewAlert ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                    transition={{ repeat: hasNewAlert ? Infinity : 0, repeatDelay: 1, duration: 0.5 }}
                  >
                    <Bell className="w-4 h-4" />
                  </motion.div>
                  {hasNewAlert && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border border-black shadow-[0_0_10px_rgba(244,63,94,0.8)] animate-pulse"></span>}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute top-14 right-0 w-[340px] bg-[#09090b]/95 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-white/90">Notifications</span>
                      {alerts.length > 0 && <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full font-bold">{alerts.length} New</span>}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {alerts.length > 0 ? (
                        <div className="flex flex-col">
                          {alerts.map((alert, i) => (
                            <div key={alert.id} className={`p-4 hover:bg-white/[0.03] transition-colors cursor-pointer ${i !== alerts.length - 1 ? 'border-b border-white/5' : ''}`}>
                              <div className="flex justify-between items-start mb-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                                  <span className="text-rose-400 font-semibold text-xs">High Risk Alert</span>
                                </div>
                                <span className="text-white/30 text-[10px]">{alert.time}</span>
                              </div>
                              <p className="text-white/70 text-xs leading-relaxed pl-3.5">{alert.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 px-4">
                          <Bell className="w-8 h-8 text-white/10 mb-3" />
                          <p className="text-white/40 text-xs font-medium">You're all caught up</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}
                  className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white bg-white/0 hover:bg-white/10 rounded-full transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* Settings Dropdown */}
                {showSettings && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute top-14 right-0 w-64 bg-[#09090b]/95 backdrop-blur-3xl border border-white/10 rounded-xl shadow-2xl z-50 p-2"
                  >
                    <div className="px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">
                      Preferences
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                        <span className="text-white/80 text-sm group-hover:text-white">Dark Mode</span>
                        <div className="w-9 h-5 bg-indigo-500 rounded-full relative transition-colors">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                        </div>
                      </label>
                      <label className="flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                        <span className="text-white/80 text-sm group-hover:text-white">Email Alerts</span>
                        <div className="w-9 h-5 bg-white/10 rounded-full relative transition-colors">
                          <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full"></div>
                        </div>
                      </label>
                      <label className="flex items-center justify-between px-3 py-2.5 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                        <span className="text-white/80 text-sm group-hover:text-white">Compact UI</span>
                        <div className="w-9 h-5 bg-white/10 rounded-full relative transition-colors">
                          <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full"></div>
                        </div>
                      </label>
                    </div>
                    
                    <div className="h-px bg-white/5 my-2 mx-2" />
                    
                    <button onClick={signOut} className="w-full flex items-center gap-3 px-3 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors text-sm font-medium text-left">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </div>
              
              <div className="flex items-center gap-2 cursor-pointer group/user ml-1" onClick={signOut} title="Sign Out">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/80 text-xs font-semibold uppercase transition-all group-hover/user:bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  {user.email?.charAt(0) || "U"}
                </div>
              </div>
            </>
          ) : (
            <Link href="/login" className="px-5 py-2 rounded-full bg-white/90 text-black hover:bg-white text-[13px] font-semibold transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
