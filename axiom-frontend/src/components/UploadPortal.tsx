import { motion } from "framer-motion";
import { UploadCloud, ShieldAlert, Cpu, HeartPulse } from "lucide-react";
import { useState } from "react";

export function UploadPortal({ onStart }: { onStart: (domain: string) => void }) {
  const [domain, setDomain] = useState("hiring");
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = () => {
    setIsLoading(true);
    onStart(domain);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Background glowing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="text-center mb-12">
        <h1 className="text-6xl font-black tracking-tight mb-4 bg-linear-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
          AXIOM
        </h1>
        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
          Adversarial eXplainable Intelligence for Outcome Monitoring. <br />
          <span className="text-gray-300 font-medium">Don't just audit your AI. Make it confess.</span>
        </p>
      </div>

      <div className="glass-panel glass-panel-glow rounded-3xl p-10 w-full max-w-4xl relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Left: Drag Drop Area (Mocked for demo flow) */}
          <div className="border-2 border-dashed border-purple-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/60 transition-colors bg-purple-500/5 group">
            <div className="p-4 bg-purple-500/10 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">Connect Data</h3>
            <p className="text-sm text-gray-400">Drag & drop your CSV or connect live model endpoint.</p>
            <div className="mt-6 px-4 py-2 bg-gray-900 rounded-full text-xs text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              COMPAS Demo Dataset Loaded
            </div>
          </div>

          {/* Right: Config Area */}
          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-medium mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-indigo-400" />
                Audit Configuration
              </h3>

              <div className="space-y-3 mb-8">
                {[
                  { id: "hiring", label: "Hiring & Recruitment", icon: <Cpu className="w-4 h-4" /> },
                  { id: "lending", label: "Financial Lending", icon: <ShieldAlert className="w-4 h-4" /> },
                  { id: "healthcare", label: "Healthcare Outcomes", icon: <HeartPulse className="w-4 h-4" /> }
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDomain(d.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${domain === d.id
                        ? 'border-purple-500 bg-purple-500/20 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                  >
                    {d.icon}
                    {d.label}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-2">Protected Attributes Detected:</p>
                <div className="flex gap-2 flex-wrap">
                  {["Race", "Gender", "Age Group"].map(attr => (
                    <span key={attr} className="px-3 py-1 bg-indigo-900/40 border border-indigo-500/30 rounded-full text-xs text-indigo-300">
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-lg bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Initializing Engine...
                </>
              ) : (
                "Begin Audit Sequence"
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
