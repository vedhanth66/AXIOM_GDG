import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Zap, BarChart, BrainCircuit, Map } from "lucide-react";

const STAGES = [
  { id: "generating_personas", label: "Generating 10,000 synthetic human personas", icon: <User className="w-5 h-5" /> },
  { id: "probing_model", label: "Running adversarial simulation — probing model with twins", icon: <Zap className="w-5 h-5" /> },
  { id: "computing_disparities", label: "Computing fairness metrics across all groups", icon: <BarChart className="w-5 h-5" /> },
  { id: "generating_explanation", label: "Gemini analyzing patterns and drafting verdict", icon: <BrainCircuit className="w-5 h-5" /> },
  { id: "building_visualization", label: "Building bias topology map", icon: <Map className="w-5 h-5" /> },
];

export function AuditPulse({ sessionId, onComplete }: { sessionId: string, onComplete: (data: any) => void }) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [stageLabel, setStageLabel] = useState("Initializing AXIOM engine...");

  const [personaCount, setPersonaCount] = useState(0);
  const [flipCount, setFlipCount] = useState(0);

  useEffect(() => {
    // SSE connection
    const es = new EventSource(`http://localhost:8000/api/audit/${sessionId}/stream`);

    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setProgress(data.progress);
      setCurrentStage(data.status);
      setStageLabel(data.stage_label || data.status);

      if (data.status === "completed") {
        es.close();
        setTimeout(() => onComplete(data), 1500); // Wait a beat before transition
      }
    };

    return () => es.close();
  }, [sessionId, onComplete]);

  // Demo counters for visual flair
  useEffect(() => {
    const personaTimer = setInterval(() => {
      setPersonaCount(c => (progress > 10 ? Math.min(c + 127, 10000) : c));
    }, 50);
    const flipTimer = setInterval(() => {
      setFlipCount(c => (progress > 30 ? c + Math.floor(Math.random() * 3) : c));
    }, 200);

    return () => { clearInterval(personaTimer); clearInterval(flipTimer); }
  }, [progress]);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black -z-10" />

      {/* Giant animated progress ring */}
      <div className="relative w-64 h-64 mb-12">
        <svg className="w-full h-full -rotate-90">
          <circle cx="128" cy="128" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="128" cy="128" r={radius}
            stroke="#a855f7" // Purple-500
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 10px rgba(168,85,247,0.5))" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-light text-white">{Math.round(progress)}%</span>
          <span className="text-xs text-purple-400 mt-1 uppercase tracking-widest animate-pulse">processing</span>
        </div>
      </div>

      {/* Live counters */}
      <div className="grid grid-cols-2 gap-12 mb-16 text-center">
        <div>
          <div className="text-4xl font-mono text-purple-400 font-light tracking-tight">
            {personaCount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-2 uppercase tracking-wider">Synthetic Personas</div>
        </div>
        <div>
          <div className="text-4xl font-mono text-rose-400 font-light tracking-tight">
            {flipCount.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-2 uppercase tracking-wider">Decision Flips</div>
        </div>
      </div>

      {/* Stage list */}
      <div className="w-full max-w-md space-y-3 relative">
        <div className="absolute -left-6 top-0 bottom-0 w-px bg-white/10" />

        {STAGES.map((stage, idx) => {
          const isCurrent = currentStage === stage.id;
          const isPast = STAGES.findIndex(s => s.id === currentStage) > idx || progress === 100;

          return (
            <motion.div
              key={stage.id}
              initial={false}
              animate={{
                opacity: isPast || isCurrent ? 1 : 0.4,
                x: isCurrent ? 10 : 0
              }}
              className="relative flex items-center gap-4"
            >
              {/* Timeline dot */}
              <div className={`absolute left-[-29px] w-[6px] h-[6px] rounded-full ${isCurrent ? "bg-purple-500 shadow-[0_0_10px_#a855f7]" :
                  isPast ? "bg-green-500" : "bg-white/20"
                }`} />

              <div className={`flex items-center gap-3 p-3 w-full rounded-lg border transition-colors ${isCurrent
                  ? "border-purple-500/50 bg-purple-500/10 text-white"
                  : isPast
                    ? "border-green-500/20 bg-green-500/5 text-green-400"
                    : "border-white/5 bg-transparent text-gray-600"
                }`}>
                <span className={isCurrent ? "animate-pulse" : ""}>{stage.icon}</span>
                <span className="text-sm font-medium">{stage.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 text-center text-gray-400 text-sm animate-pulse">
        {stageLabel}
      </div>
    </motion.div>
  );
}
