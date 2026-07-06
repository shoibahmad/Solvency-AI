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
    { path: "/about", name: "ABOUT" },
  ];

  const handleSignOut = () => {
    setShowLogoutAlert(false);
    signOut();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1400px] mx-auto h-14 flex items-center justify-between px-6">
          
          {/* Left - Premium Logo Area */}
          <div className="flex items-center gap-10">
            <Link href="/dashboard" className="flex items-center gap-3 group transition-opacity hover:opacity-80">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold tracking-tight text-white text-lg">
                Solvency AI
              </span>
            </Link>

            {/* Premium Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = item.path === pathname || (item.path !== "#" && pathname?.startsWith(item.path) && item.path !== "/");
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`h-14 flex items-center text-sm font-medium transition-all relative ${isActive ? "text-white" : "text-white/50 hover:text-white"}`}
                  >
                    {item.name.charAt(0) + item.name.slice(1).toLowerCase()}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
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
                    {hasNewAlert && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.6)]"></span>}
                  </button>

                  {/* Premium Notifications Dropdown */}
                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-12 right-0 w-[340px] panel bg-black/80 shadow-2xl z-50 overflow-hidden rounded-2xl"
                      >
                        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/5">
                          <span className="text-sm font-semibold text-white">Alerts</span>
                          {alerts.length > 0 && <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/50 px-2 py-0.5 rounded-full font-bold">{alerts.length} New</span>}
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                          {alerts.length > 0 ? (
                            <div className="flex flex-col">
                              {alerts.map((alert, i) => (
                                <div key={alert.id} className={`p-4 hover:bg-white/5 transition-colors cursor-pointer ${i !== alerts.length - 1 ? 'border-b border-white/5' : ''}`}>
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                                      <span className="text-rose-400 font-semibold text-xs">High Risk</span>
                                    </div>
                                    <span className="text-white/40 text-xs">{alert.time}</span>
                                  </div>
                                  <p className="text-white/80 text-sm leading-relaxed">{alert.text}</p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-10 px-4">
                              <span className="text-white/40 text-sm font-medium">No new alerts</span>
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
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full border border-white/20 text-white flex items-center justify-center text-sm font-semibold uppercase shadow-[0_0_10px_rgba(255,255,255,0.1)] transition-transform group-hover:scale-105">
                      {user.email?.charAt(0) || "X"}
                    </div>
                  </div>

                  {/* Premium Settings Dropdown */}
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-12 right-0 w-64 panel bg-black/80 shadow-2xl z-50 p-2 rounded-2xl"
                      >
                        <div className="px-3 py-2 text-xs font-medium text-white/50 mb-1">
                          Account
                        </div>
                        <div className="flex flex-col gap-1">
                          <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-left text-white/70 hover:text-white text-sm font-medium group">
                            <Key className="w-4 h-4" />
                            Change Password
                          </button>
                          <button className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-left text-white/70 hover:text-white text-sm font-medium group">
                            <Mail className="w-4 h-4" />
                            Update Email
                          </button>
                          <label className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group">
                            <span className="flex items-center gap-3 text-white/70 text-sm font-medium group-hover:text-white">
                              <Settings className="w-4 h-4" /> Dark Mode
                            </span>
                            <div className="w-8 h-4 bg-blue-500 rounded-full relative transition-colors shadow-[0_0_8px_rgba(59,130,246,0.5)]">
                              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow"></div>
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
                  className="flex items-center gap-2 text-rose-400 hover:text-rose-300 transition-colors group ml-2"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium hidden md:block">Sign Out</span>
                </button>
              </>
            ) : (
              <Link href="/login" className="px-6 py-2 bg-white text-black hover:bg-gray-200 text-sm font-semibold transition-colors rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                Sign In
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md panel bg-black/90 p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl relative overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-rose-500/10 flex items-center justify-center mb-6 rounded-full border border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                  <LogOut className="w-8 h-8 text-rose-500 ml-1" />
                </div>
                
                <h2 className="text-xl font-bold tracking-tight text-white mb-2">
                  Sign Out
                </h2>
                <p className="text-white/60 text-sm mb-8">
                  Are you sure you want to sign out of your Solvency AI account? You will need to re-authenticate to access your portfolios.
                </p>

                <div className="flex items-center gap-3 w-full">
                  <button 
                    onClick={() => setShowLogoutAlert(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSignOut}
                    className="flex-1 py-3 rounded-xl bg-rose-600 text-white hover:bg-rose-500 text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                  >
                    Sign Out
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
