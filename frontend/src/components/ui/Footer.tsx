"use client";

import Link from "next/link";
import { Activity, Globe, Mail, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-md mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 group transition-opacity hover:opacity-80 mb-4 inline-flex">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold tracking-tight text-white text-lg">
                Solvency AI
              </span>
            </Link>
            <p className="text-sm text-white/50 max-w-sm leading-relaxed mb-6">
              A verdict on creditworthiness — issued in seconds, explained in plain language. Bridging the gap between complex Machine Learning models and human decision-making.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-widest mb-4">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-sm text-white/50 hover:text-blue-400 transition-colors">Risk Dashboard</Link>
              </li>
              <li>
                <Link href="/intake" className="text-sm text-white/50 hover:text-blue-400 transition-colors">New Application</Link>
              </li>
              <li>
                <Link href="/models" className="text-sm text-white/50 hover:text-blue-400 transition-colors">Model Settings</Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-xs font-bold text-white/80 uppercase tracking-widest mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-white/50 hover:text-blue-400 transition-colors">System Architecture</Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/50 hover:text-blue-400 transition-colors">Mathematical Foundations</Link>
              </li>
              <li>
                <a href="#" className="text-sm text-white/50 hover:text-blue-400 transition-colors">API Documentation</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40 font-mono">
            &copy; {new Date().getFullYear()} Solvency AI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-xs text-white/40 hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="text-xs text-emerald-500/80 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
