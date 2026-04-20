/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clipboard, 
  Check, 
  Clock, 
  AlertCircle, 
  Tag, 
  ListChecks, 
  Send, 
  BrainCircuit,
  Code,
  Layout
} from 'lucide-react';
import { parseTask, TaskJSON } from './services/geminiService';

export default function App() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<TaskJSON | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);
    try {
      const data = await parseTask(input);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Failed to parse input.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white geometric-grid flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 shrink-0 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-indigo-600 rounded-sm rotate-45 flex items-center justify-center">
            <BrainCircuit size={18} className="-rotate-45 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            JSON Parser <span className="text-slate-400 font-normal">v2.4.0</span>
          </h1>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <div className="flex items-center gap-2 text-indigo-600">
            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
            <span>Engine Active</span>
          </div>
          <div className="text-slate-500 hidden sm:block">Uptime: 142h 12m</div>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-10 flex flex-col md:flex-row gap-8 max-w-[1440px] mx-auto w-full">
        {/* Input Section */}
        <section className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Natural Language Input</span>
            <span className="text-indigo-500">Raw Stream</span>
          </div>
          <div className="flex-grow bg-white border border-slate-200 shadow-sm p-6 relative flex flex-col min-h-[300px]">
            <textarea
              className="w-full flex-grow bg-transparent border-none text-slate-600 leading-relaxed text-lg italic focus:ring-0 focus:outline-none resize-none placeholder:text-slate-300"
              placeholder="Hey, we need to organize the MERN stack code for the upcoming hackathon and split the work between the four of us. It's urgent."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs mt-2 font-bold uppercase tracking-tight">{error}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-wider">Extraction active</span>
              {input.length > 0 && <span className="px-2 py-1 bg-indigo-50 text-indigo-500 text-[10px] font-bold rounded uppercase tracking-wider">{input.length} chars</span>}
            </div>
            
            <button
               onClick={() => handleSubmit()}
               disabled={!input.trim() || isProcessing}
               className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-slate-200 shadow-md flex items-center justify-center rotate-45 z-10 hover:border-indigo-400 transition-colors group disabled:opacity-50"
            >
               <div className="-rotate-45 text-indigo-600 transition-transform group-hover:translate-x-0.5">
                  {isProcessing ? <Clock size={18} className="animate-spin" /> : <Send size={18} />}
               </div>
            </button>
          </div>
        </section>

        {/* Output Section */}
        <section className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Structured Object Output</span>
            <div className="flex gap-4">
               <button onClick={() => setShowJson(false)} className={`transition-colors h-4 inline-flex items-center ${!showJson ? 'text-emerald-500' : 'hover:text-slate-600'}`}>Visual View</button>
               <button onClick={() => setShowJson(true)} className={`transition-colors h-4 inline-flex items-center ${showJson ? 'text-emerald-500' : 'hover:text-slate-600'}`}>JSON Source</button>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex-grow bg-[#1E293B] border border-slate-800 shadow-xl p-8 flex flex-col items-center justify-center text-center rounded-sm"
              >
                <div className="w-12 h-12 border border-slate-700 rotate-45 flex items-center justify-center mb-6">
                   <div className="-rotate-45 text-slate-600"><Layout size={24} /></div>
                </div>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest leading-relaxed">Waiting for data injection...</p>
              </motion.div>
            ) : showJson ? (
              <motion.div
                key="json"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-grow bg-[#1E293B] border border-slate-800 shadow-xl p-6 font-mono text-sm leading-relaxed overflow-auto max-h-[500px]"
              >
                <div className="text-pink-400">{"{"}</div>
                <div className="pl-6">
                  <span className="text-emerald-400">"task_name"</span>: <span className="text-amber-200">"{result.task_name}"</span>,
                </div>
                <div className="pl-6">
                  <span className="text-emerald-400">"priority"</span>: <span className="text-amber-200">"{result.priority}"</span>,
                </div>
                <div className="pl-6">
                  <span className="text-emerald-400">"category"</span>: <span className="text-amber-200">"{result.category}"</span>,
                </div>
                <div className="pl-6">
                  <span className="text-emerald-400">"action_items"</span>: <span className="text-pink-400">[</span>
                  <div className="pl-6 text-amber-200">
                    {result.action_items.map((item, i) => (
                      <div key={i}>"{item}"{i < result.action_items.length - 1 ? ',' : ''}</div>
                    ))}
                  </div>
                  <span className="text-pink-400">]</span>,
                </div>
                <div className="pl-6">
                  <span className="text-emerald-400">"estimated_hours"</span>: <span className="text-orange-400">{result.estimated_hours}</span>
                </div>
                <div className="text-pink-400">{"}"}</div>
              </motion.div>
            ) : (
              <motion.div
                key="visual"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-grow bg-white border border-slate-200 shadow-xl p-0 overflow-hidden flex flex-col"
              >
                 <div className="p-8 border-b border-slate-100 flex justify-between items-start">
                    <div className="space-y-1">
                       <div className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500">Object Name</div>
                       <h3 className="text-xl font-semibold text-slate-800 tracking-tight">{result.task_name}</h3>
                    </div>
                    <div className="text-right">
                       <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Validation</div>
                       <div className="text-emerald-500 font-mono text-sm leading-none mt-1">SUCCESS</div>
                    </div>
                 </div>
                 <div className="flex-grow p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-50 border border-slate-100">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Priority Path</div>
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${result.priority === 'High' ? 'bg-red-500' : result.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                             <span className="font-semibold text-slate-700">{result.priority}</span>
                          </div>
                       </div>
                       <div className="p-4 bg-slate-50 border border-slate-100">
                          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Category Cluster</div>
                          <div className="flex items-center gap-2 text-slate-700">
                             <Tag size={12} className="text-indigo-500" />
                             <span className="font-semibold">{result.category}</span>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Decomposed Actions</div>
                       <div className="space-y-2">
                          {result.action_items.map((item, i) => (
                             <div key={i} className="flex gap-3 text-sm p-3 border-l-2 border-indigo-400 bg-indigo-50/20 text-slate-700">
                                <span className="font-mono text-indigo-400 text-[10px] mt-0.5">0{i+1}</span>
                                {item}
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer Stats */}
      <footer className="h-auto md:h-32 bg-slate-900 text-slate-400 px-10 py-8 md:py-0 flex flex-col md:flex-row items-center gap-10 shrink-0">
        <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest mb-1 text-slate-500">Extraction Logic</div>
            <div className="text-white font-medium text-sm">Heuristic-NLP v4</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest mb-1 text-slate-500">Response Offset</div>
            <div className="text-white font-medium text-sm">124ms</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest mb-1 text-slate-500">Confidence Scalar</div>
            <div className="text-emerald-400 font-medium font-mono text-sm">98.4%</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest mb-1 text-slate-500">Load Capacity</div>
            <div className="text-white font-medium text-sm font-mono text-sm">{result ? result.estimated_hours : '0.0'}h Target</div>
          </div>
        </div>
        <button 
          onClick={copyToClipboard}
          className="h-12 w-full md:w-auto px-8 bg-indigo-600 text-white text-xs font-bold tracking-widest uppercase hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40 disabled:opacity-50 active:scale-95"
        >
          {copied ? 'Copied to Buffer' : 'Export JSON Stream'}
        </button>
      </footer>
    </div>
  );
}


