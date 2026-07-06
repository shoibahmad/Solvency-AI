"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { Search, Activity, FileText, Settings, ShieldAlert, Cpu } from "lucide-react";

export function GlobalCommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-md">
      <div 
        className="fixed inset-0" 
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-xl mx-4 panel bg-black/90 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200">
        <Command label="Global Command Menu" className="flex flex-col w-full bg-transparent text-white">
          <div className="flex items-center px-4 border-b border-white/10">
            <Search className="w-5 h-5 text-white/40 mr-2" />
            <Command.Input 
              autoFocus
              placeholder="Search borrowers, models, or actions..." 
              className="flex-1 py-4 bg-transparent outline-none placeholder:text-white/40 text-sm"
            />
            <div className="text-[10px] font-mono text-white/30 bg-white/5 px-2 py-1 rounded">ESC</div>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-white/40">No results found.</Command.Empty>

            <Command.Group heading="Navigation" className="px-2 py-1 text-xs font-semibold text-white/40 uppercase tracking-widest mt-2 mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2">
              <Command.Item 
                onSelect={() => { router.push("/dashboard"); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-white/10 text-sm transition-colors"
              >
                <Activity className="w-4 h-4 text-blue-400" /> Dashboard
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push("/intake"); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-white/10 text-sm transition-colors"
              >
                <FileText className="w-4 h-4 text-emerald-400" /> New Application
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push("/models"); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-white/10 text-sm transition-colors"
              >
                <Cpu className="w-4 h-4 text-amber-400" /> Model Settings
              </Command.Item>
              <Command.Item 
                onSelect={() => { router.push("/about"); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-white/10 text-sm transition-colors"
              >
                <Settings className="w-4 h-4 text-purple-400" /> About & Tech Stack
              </Command.Item>
            </Command.Group>

            <Command.Separator className="h-px bg-white/5 my-1" />

            <Command.Group heading="Quick Actions" className="px-2 py-1 text-xs font-semibold text-white/40 uppercase tracking-widest mt-2 mb-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2">
              <Command.Item 
                onSelect={() => { console.log("Export Triggered"); setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-white/10 text-sm transition-colors"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Export High-Risk Report
              </Command.Item>
              <Command.Item 
                onSelect={() => { setOpen(false); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer aria-selected:bg-white/10 text-sm transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" /> Account Settings
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
