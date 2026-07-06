"use client";

import { motion } from "framer-motion";
import { Code2, Database, BrainCircuit, Layout, Layers, Cpu, Server, Sparkles, Activity, ArrowRight, Network, Sigma, BookOpen, ListChecks, MessageSquareQuote } from "lucide-react";

export function AboutView() {
  const techStack = [
    {
      category: "Frontend & UI",
      icon: <Layout className="w-6 h-6 text-blue-400" />,
      items: [
        { name: "Next.js 14", desc: "React framework with App Router for server-side rendering and routing." },
        { name: "Tailwind CSS", desc: "Utility-first CSS framework for rapid UI development and premium aesthetics." },
        { name: "Framer Motion", desc: "Animation library used for fluid transitions, micro-interactions, and page loads." },
        { name: "Recharts", desc: "Composable charting library used for the interactive risk trend area charts." },
        { name: "React Parallax Tilt", desc: "Used to create the 3D glassmorphism hover effects on the analysis cards." },
        { name: "Lucide React", desc: "Beautiful and consistent icon set used throughout the application." }
      ]
    },
    {
      category: "Backend Services",
      icon: <Server className="w-6 h-6 text-emerald-400" />,
      items: [
        { name: "FastAPI", desc: "High-performance Python web framework used to serve the Machine Learning models." },
        { name: "Python 3", desc: "Core language used for the backend data processing and ML pipeline." },
        { name: "Pydantic", desc: "Data validation and settings management using Python type annotations." }
      ]
    },
    {
      category: "Machine Learning & AI",
      icon: <BrainCircuit className="w-6 h-6 text-rose-400" />,
      items: [
        { name: "XGBoost", desc: "Gradient boosting framework used for high-accuracy default probability prediction." },
        { name: "SHAP", desc: "(SHapley Additive exPlanations) Used to calculate feature importance and explain the black-box ML model decisions." },
        { name: "Google Gemini Pro", desc: "Generative AI model used to translate SHAP values into human-readable underwriter narratives and recommendations." }
      ]
    },
    {
      category: "Database & Auth",
      icon: <Database className="w-6 h-6 text-amber-400" />,
      items: [
        { name: "Firebase Auth", desc: "Secure user authentication system." },
        { name: "Cloud Firestore", desc: "NoSQL document database used to store borrower profiles and historical risk data." }
      ]
    }
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] p-6 md:p-10 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-5xl mx-auto space-y-16"
      >
        {/* Header */}
        <div className="text-center space-y-6 pt-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-4 h-4" /> Solvency AI
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60"
          >
            A verdict on creditworthiness.
            <br />
            <span className="text-blue-400/80">Explained in plain language.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Solvency AI bridges the gap between complex black-box Machine Learning models and human decision-making. By combining XGBoost, SHAP values, and Generative AI, we provide loan officers with highly accurate risk predictions backed by plain-english explanations.
          </motion.p>
        </div>

        {/* Architecture Flow */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-4 border-b border-white/10 pb-4"
          >
            <Network className="w-6 h-6 text-white/50" />
            <h2 className="text-2xl font-semibold">System Architecture & ML Pipeline</h2>
          </motion.div>

          <div className="grid grid-cols-1 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="panel p-8"
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <Activity className="w-5 h-5 text-emerald-400" />
                The Underwriting Data Flow
              </h3>
              
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="font-bold text-white mb-2">1. Feature Engineering</h4>
                    <p className="text-sm text-white/60">14 distinct financial features (Income, DTI, Credit Utilization, etc.) are validated via Pydantic and passed to the prediction engine.</p>
                  </div>
                  <ArrowRight className="hidden md:block w-6 h-6 text-white/20" />
                  
                  <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="font-bold text-white mb-2">2. XGBoost Prediction</h4>
                    <p className="text-sm text-white/60">A highly optimized Gradient Boosting model computes the 12-month default probability based on historical training data.</p>
                  </div>
                  <ArrowRight className="hidden md:block w-6 h-6 text-white/20" />
                  
                  <div className="flex-1 bg-white/5 p-4 rounded-xl border border-white/10">
                    <h4 className="font-bold text-white mb-2">3. SHAP Interpretation</h4>
                    <p className="text-sm text-white/60">SHAP TreeExplainer calculates the exact positive or negative contribution of every single feature to the final risk score.</p>
                  </div>
                  <ArrowRight className="hidden md:block w-6 h-6 text-white/20" />
                  
                  <div className="flex-1 bg-white/5 p-4 rounded-xl border border-blue-500/30 bg-blue-500/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent"></div>
                    <h4 className="font-bold text-blue-100 mb-2 relative z-10">4. Generative AI Narrative</h4>
                    <p className="text-sm text-blue-200/60 relative z-10">The raw SHAP tensors are injected into a strict system prompt and sent to Google Gemini Pro to generate the human-readable underwriter narrative.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mathematical Foundations */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center gap-4 border-b border-white/10 pb-4"
          >
            <BookOpen className="w-6 h-6 text-white/50" />
            <h2 className="text-2xl font-semibold">Mathematical Foundations</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="panel p-8 bg-black/40 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sigma className="w-5 h-5 text-rose-400" />
                <h3 className="text-lg font-bold text-white">XGBoost Objective Function</h3>
              </div>
              <p className="text-sm text-white/50 mb-6 leading-relaxed">
                The core prediction engine uses Gradient Tree Boosting. The model learns by optimizing an objective function containing two parts: a training loss term (measuring how well the model fits the data) and a regularization term (penalizing complexity to prevent overfitting).
              </p>
              
              <div className="bg-black/60 p-6 rounded-xl font-mono text-center overflow-x-auto border border-white/5 shadow-inner mb-4">
                <div className="text-lg md:text-xl text-white/90 whitespace-nowrap">
                  <span className="text-rose-400">Obj(Θ)</span> = 
                  <span className="text-blue-400"> Σ L(y<sub className="text-xs">i</sub>, ŷ<sub className="text-xs">i</sub>)</span> + 
                  <span className="text-emerald-400"> Σ Ω(f<sub className="text-xs">k</sub>)</span>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-white/60 font-mono">
                <li><span className="text-rose-400 font-bold">Obj(Θ)</span>: The objective score to minimize</li>
                <li><span className="text-blue-400 font-bold">L</span>: Differentiable convex loss function (Log Loss)</li>
                <li><span className="text-emerald-400 font-bold">Ω</span>: Regularization term (Tree depth & weights)</li>
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="panel p-8 bg-black/40 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">SHAP Value Calculation</h3>
              </div>
              <p className="text-sm text-white/50 mb-6 leading-relaxed">
                Based on cooperative game theory (Shapley values), SHAP assigns each feature an importance value for a specific prediction. It calculates the marginal contribution of a feature across all possible subsets of features.
              </p>
              
              <div className="bg-black/60 p-6 rounded-xl font-mono text-center overflow-x-auto border border-white/5 shadow-inner mb-4">
                <div className="text-lg md:text-xl text-white/90 whitespace-nowrap">
                  <span className="text-purple-400">φ<sub className="text-xs">i</sub></span> = 
                  <span className="text-gray-400"> Σ </span>
                  <span className="text-amber-400 text-sm"> [|S|! (M-|S|-1)! / M!] </span>
                  <span className="text-blue-300 text-sm"> [f<sub className="text-xs">x</sub>(S ∪ &#123;i&#125;) - f<sub className="text-xs">x</sub>(S)]</span>
                </div>
              </div>
              
              <ul className="space-y-2 text-sm text-white/60 font-mono">
                <li><span className="text-purple-400 font-bold">φ<sub className="text-xs">i</sub></span>: The SHAP value for feature i</li>
                <li><span className="text-amber-400 font-bold">Weighting</span>: Combinatorial weight of subset S</li>
                <li><span className="text-blue-300 font-bold">Marginal</span>: Prediction difference with/without i</li>
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Feature Dictionary */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-4 border-b border-white/10 pb-4"
          >
            <ListChecks className="w-6 h-6 text-white/50" />
            <h2 className="text-2xl font-semibold">Feature Engineering Dictionary</h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75 }}
            className="panel p-0 overflow-hidden border-white/10"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/70">
                <thead className="bg-white/5 text-white/40 uppercase tracking-widest text-xs font-bold border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Feature Vector</th>
                    <th className="px-6 py-4">Data Type</th>
                    <th className="px-6 py-4">Financial Definition</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 font-mono">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-blue-300">dti_ratio</td>
                    <td className="px-6 py-4">Float</td>
                    <td className="px-6 py-4 font-sans text-white/60">Debt-to-Income. Total monthly debt payments divided by gross monthly income.</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-blue-300">credit_utilization</td>
                    <td className="px-6 py-4">Float</td>
                    <td className="px-6 py-4 font-sans text-white/60">Total outstanding revolving debt divided by total available revolving credit limits.</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-blue-300">account_vintage_months</td>
                    <td className="px-6 py-4">Integer</td>
                    <td className="px-6 py-4 font-sans text-white/60">The age of the oldest open credit line in the borrower's credit file.</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-blue-300">missed_payments_6m</td>
                    <td className="px-6 py-4">Integer</td>
                    <td className="px-6 py-4 font-sans text-white/60">Number of 30+ day delinquencies recorded in the past 6 months.</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-blue-300">liquid_assets</td>
                    <td className="px-6 py-4">Float</td>
                    <td className="px-6 py-4 font-sans text-white/60">Total verified cash or cash-equivalent holdings at the time of application.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-black/40 px-6 py-3 text-xs text-white/40 border-t border-white/10">
              * Showing 5 of 14 core features used in the XGBoost training matrix.
            </div>
          </motion.div>
        </div>

        {/* LLM Prompt Engineering */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 border-b border-white/10 pb-4"
          >
            <MessageSquareQuote className="w-6 h-6 text-white/50" />
            <h2 className="text-2xl font-semibold">Generative Context Injection (RAG)</h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="panel p-8 bg-blue-900/10 border-blue-500/20"
          >
            <p className="text-sm text-blue-100/70 mb-6 leading-relaxed">
              To translate complex mathematical outputs into human-readable narratives, Solvency AI utilizes a strict Prompt Engineering architecture. The Large Language Model (Gemini Pro) is given a highly constrained persona and fed the exact SHAP tensors dynamically.
            </p>
            
            <div className="bg-black/80 rounded-xl p-6 border border-white/10 font-mono text-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <div className="text-white/40 mb-2"># System Prompt Architecture</div>
              <div className="text-emerald-400 mb-4">
                ROLE: You are an elite credit risk underwriter.<br/>
                TASK: Write a brief, objective 2-paragraph risk narrative.
              </div>
              
              <div className="text-white/40 mb-2"># Dynamically Injected Context</div>
              <div className="text-amber-300 mb-4">
                RISK_TIER = <span className="text-white">"High Risk" (Probability: 82.4%)</span><br/>
                TOP_POSITIVE_SHAP_FACTORS = <span className="text-white">&#123; "missed_payments_6m": +2.14, "dti_ratio": +1.02 &#125;</span><br/>
                TOP_NEGATIVE_SHAP_FACTORS = <span className="text-white">&#123; "income": -0.45 &#125;</span>
              </div>
              
              <div className="text-white/40 mb-2"># Constraints</div>
              <div className="text-rose-400">
                - Do not use AI fluff (e.g. "Certainly! Here is...").<br/>
                - Do not hallucinate metrics not provided in the SHAP data.<br/>
                - Cite the exact feature names in your analysis.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 border-b border-white/10 pb-4"
          >
            <Layers className="w-6 h-6 text-white/50" />
            <h2 className="text-2xl font-semibold">Technology Stack</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {techStack.map((category, idx) => (
              <motion.div 
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (idx * 0.1) }}
                className="panel p-8 flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <div className="p-2 bg-black/40 rounded-lg">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold tracking-wide text-white/90">{category.category}</h3>
                </div>
                
                <div className="space-y-6 flex-1">
                  {category.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="group">
                      <div className="flex items-center gap-2 mb-1">
                        <Code2 className="w-4 h-4 text-white/30 group-hover:text-blue-400 transition-colors" />
                        <h4 className="font-mono text-sm text-white/90 font-bold tracking-wide">{item.name}</h4>
                      </div>
                      <p className="text-sm text-white/50 pl-6 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center pt-8 pb-16 text-white/30 text-sm font-mono"
        >
          Built for modern underwriting. System version 1.0.0
        </motion.div>
      </motion.div>
    </div>
  );
}
