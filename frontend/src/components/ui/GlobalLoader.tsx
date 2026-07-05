"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { usePathname } from "next/navigation";

export function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  // Re-enable if you want it to dismiss on route change
  // useEffect(() => {
  //   setIsLoading(false);
  // }, [pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("button, a[href]");
      if (target && !target.closest("[data-no-loader='true']")) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    };

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#09090b]/40 pointer-events-none"
        >
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute w-32 h-32 rounded-full border border-indigo-500/20 border-t-indigo-500 border-b-rose-500"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute w-24 h-24 rounded-full border border-rose-500/20 border-t-rose-500 border-l-amber-500"
            />
            <div className="relative bg-black/40 p-4 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.3)] backdrop-blur-md border border-white/10">
              <Activity className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col items-center"
          >
            <h2 className="text-xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-rose-300 to-amber-300">
              Processing
            </h2>
            <p className="text-white/40 font-mono text-sm mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              Connecting to secure enclave...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
