"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bell, Settings, LogOut, Square, AlertTriangle, Key, Mail } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/components/ui/ToastProvider";

export function Header() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const { showToast } = useToast();

  const [hasNewAlert, setHasNewAlert] = useState(false);
  const [alerts, setAlerts] = useState<{ id: string, text: string, time: string }[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const initialRender = useRef(true);

  useEffect(() => {
    if (!user) return;

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
    { path: "/dashboard", name: "DASHBOARD" },
    { path: "/intake", name: "INTAKE" },
    { path: "/models", name: "MODELS" },
    { path: "/admin", name: "ADMIN" },
  ];

  const handleSignOut = () => {
    setShowLogoutAlert(false);
    signOut();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-black">
        <div className="max-w-[1400px] mx-auto h-20 flex items-center justify-between px-6">
          
          {/* Left - Brutalist Logo Area */}
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-3 group transition-opacity hover:opacity-80">
              <div className="w-6 h-6 border-2 border-white flex items-center justify-center relative">
                <Square className="w-2.5 h-2.5 fill-white text-white absolute" />
              </div>
              <span className="font-bold tracking-widest text-white text-lg font-mono uppercase">
                Solvency_AI
              </span>
            </Link>

            {/* Brutalist Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = item.path === pathname || (item.path !== "#" && pathname?.startsWith(item.path) && item.path !== "/");
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`text-xs font-bold uppercase tracking-[0.2em] transition-all relative ${isActive ? "text-white" : "text-white/40 hover:text-white"}`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 w-full h-[2px] bg-white"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right - User Actions */}
          <div className="flex items-center gap-6" data-no-loader="true">
            {user ? (
              <>
                <div className="relative">
                  <button 
                    onClick={() => { setShowNotifications(!showNotifications); setShowSettings(false); setHasNewAlert(false); }}
                    className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors relative group"
                  >
                    <motion.div
                      animate={hasNewAlert ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                      transition={{ repeat: hasNewAlert ? Infinity : 0, repeatDelay: 1, duration: 0.5 }}
                    >
                      <Bell className="w-5 h-5" />
                    </motion.div>
                    {hasNewAlert && <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-none border border-black animate-pulse"></span>}
                  </button>

                  {/* Brutalist Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-12 right-0 w-[340px] bg-black border border-white/20 shadow-2xl z-50 overflow-hidden rounded-none"
                      >
                        <div className="px-4 py-3 border-b border-white/20 flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-widest font-mono">Alerts_Log</span>
                          {alerts.length > 0 && <span className="text-[10px] bg-rose-500 text-black px-2 py-0.5 font-bold uppercase tracking-widest">{alerts.length} New</span>}
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {alerts.length > 0 ? (
                            <div className="flex flex-col">
                              {alerts.map((alert, i) => (
                                <div key={alert.id} className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${i !== alerts.length - 1 ? 'border-b border-white/10' : ''}`}>
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-rose-500" />
                                      <span className="text-rose-500 font-bold text-xs uppercase tracking-widest">High Risk</span>
                                    </div>
                                    <span className="text-white/40 text-[10px] font-mono">{alert.time}</span>
                                  </div>
                                  <p className="text-white/80 text-xs leading-relaxed font-mono">{alert.text}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-10 px-4">
                              <span className="text-white/40 text-xs font-bold uppercase tracking-widest">System Clear</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="relative">
                  {/* Profile Icon now opens Settings Menu */}
                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); }}>
                    <div className="w-8 h-8 bg-white text-black flex items-center justify-center text-sm font-bold font-mono transition-transform group-hover:scale-105">
                      {user.email?.charAt(0) || "X"}
                    </div>
                  </div>

                  {/* Brutalist Settings Dropdown */}
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-12 right-0 w-64 bg-black border border-white/20 shadow-2xl z-50 p-0 rounded-none"
                      >
                        <div className="px-4 py-3 border-b border-white/20 text-[10px] font-bold text-white uppercase tracking-widest font-mono">
                          User_Profile
                        </div>
                        <div className="flex flex-col">
                          <button className="flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors border-b border-white/10 text-left text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest group">
                            <Key className="w-4 h-4" />
                            Change Password
                          </button>
                          <button className="flex items-center gap-3 px-4 py-4 hover:bg-white/5 transition-colors border-b border-white/10 text-left text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest group">
                            <Mail className="w-4 h-4" />
                            Update Email
                          </button>
                          <label className="flex items-center justify-between px-4 py-4 hover:bg-white/5 cursor-pointer transition-colors group">
                            <span className="flex items-center gap-3 text-white/60 text-xs font-bold uppercase tracking-widest group-hover:text-white">
                              <Settings className="w-4 h-4" /> Dark Mode
                            </span>
                            <div className="w-8 h-4 bg-white relative transition-colors rounded-none">
                              <div className="absolute right-0 top-0 w-4 h-4 bg-black border border-white"></div>
                            </div>
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-px h-6 bg-white/20 mx-2"></div>

                {/* Dedicated Logout Button */}
                <button 
                  onClick={() => setShowLogoutAlert(true)}
                  className="flex items-center gap-2 text-rose-500 hover:text-white transition-colors group"
                  title="Terminate Session"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Terminate</span>
                </button>
              </>
            ) : (
              <Link href="/login" className="px-6 py-2 bg-white text-black hover:bg-gray-200 text-xs font-bold uppercase tracking-widest transition-colors rounded-none">
                Authenticate
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Custom Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutAlert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-black border border-rose-500/30 p-8 shadow-[0_0_50px_rgba(225,29,72,0.1)] rounded-none relative overflow-hidden"
            >
              {/* Warning stripes decoration */}
              <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-500/10 flex items-center justify-center mb-6 rounded-none border border-rose-500/20">
                  <AlertTriangle className="w-8 h-8 text-rose-500" />
                </div>
                
                <h2 className="text-xl font-bold font-mono tracking-widest uppercase text-white mb-2">
                  Terminate Session?
                </h2>
                <p className="text-white/50 text-sm font-mono mb-8">
                  You are about to disconnect from the Solvency AI secure network. Unsaved session states will be preserved.
                </p>

                <div className="flex items-center gap-4 w-full">
                  <button 
                    onClick={() => setShowLogoutAlert(false)}
                    className="flex-1 py-3 border border-white/20 text-white hover:bg-white/5 uppercase tracking-widest text-xs font-bold font-mono transition-colors"
                  >
                    Abort
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="flex-1 py-3 bg-rose-600 text-white hover:bg-rose-500 uppercase tracking-widest text-xs font-bold font-mono transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
