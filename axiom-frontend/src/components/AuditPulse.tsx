import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Zap, BarChart, BrainCircuit, Map, CheckCircle2 } from "lucide-react";

const SERIF = "'DM Serif Display', serif";
const MONO = "'JetBrains Mono', monospace";

const STAGES = [
  { id: "generating_personas", label: "Generating 10,000 synthetic human personas", icon: User },
  { id: "probing_model", label: "Running adversarial simulation — probing model with twins", icon: Zap },
  { id: "computing_disparities", label: "Computing fairness metrics across all groups", icon: BarChart },
  { id: "generating_explanation", label: "Gemini analyzing patterns and drafting verdict", icon: BrainCircuit },
  { id: "building_visualization", label: "Building bias topology map", icon: Map },
];

export function AuditPulse({ sessionId, onComplete }: { sessionId: string; onComplete: (data: any) => void }) {
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [stageLabel, setStageLabel] = useState("Initializing AXIOM engine...");
  const [personaCount, setPersonaCount] = useState(0);
  const [flipCount, setFlipCount] = useState(0);

  useEffect(() => {
    const es = new EventSource(`http://localhost:8000/api/audit/${sessionId}/stream`);
    es.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setProgress(data.progress);
      setCurrentStage(data.status);
      setStageLabel(data.stage_label || data.status);
      if (data.status === "completed") {
        es.close();
        setTimeout(() => onComplete(data), 1500);
      }
    };
    return () => es.close();
  }, [sessionId, onComplete]);

  useEffect(() => {
    const personaTimer = setInterval(() => {
      setPersonaCount((c) => (progress > 10 ? Math.min(c + 127, 10000) : c));
    }, 50);
    const flipTimer = setInterval(() => {
      setFlipCount((c) => (progress > 30 ? c + Math.floor(Math.random() * 3) : c));
    }, 200);
    return () => { clearInterval(personaTimer); clearInterval(flipTimer); };
  }, [progress]);

  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      
      <motion.div
        className="relative mb-14"
        style={{ width: 260, height: 260 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        <svg className="w-full h-full -rotate-90" viewBox="0 0 260 260">
          <circle
            cx="130" cy="130" r={radius}
            stroke="var(--theme-border)"
            strokeWidth="6"
            fill="none"
          />
          <motion.circle
            cx="130" cy="130" r={radius}
            stroke="var(--theme-iris)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-text-primary"
            style={{ fontFamily: SERIF, fontSize: "52px", lineHeight: 1 }}
          >
            {Math.round(progress)}%
          </span>
          <span
            className="text-text-4 mt-2 uppercase"
            style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: "0.2em" }}
          >
            processing
          </span>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-16 mb-16 text-center"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div>
          <div className="text-iris" style={{ fontFamily: SERIF, fontSize: "40px", lineHeight: 1 }}>
            {personaCount.toLocaleString()}
          </div>
          <div className="text-text-4 mt-2 uppercase" style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.18em" }}>
            Synthetic Personas
          </div>
        </div>
        <div>
          <div className="text-rose" style={{ fontFamily: SERIF, fontSize: "40px", lineHeight: 1 }}>
            {flipCount.toLocaleString()}
          </div>
          <div className="text-text-4 mt-2 uppercase" style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "0.18em" }}>
            Decision Flips
          </div>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-md space-y-2.5 relative"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
      >
        <div className="absolute -left-5 top-0 bottom-0 w-px" style={{ background: "var(--theme-border)" }} />

        {STAGES.map((stage, idx) => {
          const stageIdx = STAGES.findIndex((s) => s.id === currentStage);
          const isCurrent = currentStage === stage.id;
          const isPast = stageIdx > idx || progress === 100;
          const Icon = stage.icon;

          return (
            <motion.div
              key={stage.id}
              animate={{
                opacity: isPast || isCurrent ? 1 : 0.35,
                x: isCurrent ? 8 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="relative flex items-center gap-4"
            >
              
              <div
                className="absolute w-[7px] h-[7px] rounded-full"
                style={{
                  left: "-23px",
                  background: isCurrent
                    ? "var(--theme-iris)"
                    : isPast
                    ? "var(--theme-mint)"
                    : "var(--theme-border)",
                }}
              />

              <div
                className="flex items-center gap-3 p-3 w-full rounded-lg border"
                style={{
                  borderColor: isCurrent
                    ? "color-mix(in srgb, var(--theme-iris) 30%, transparent)"
                    : isPast
                    ? "color-mix(in srgb, var(--theme-mint) 20%, transparent)"
                    : "var(--theme-border)",
                  background: isCurrent ? "var(--theme-surface)" : "transparent",
                  color: isCurrent
                    ? "var(--theme-text-primary)"
                    : isPast
                    ? "var(--theme-mint)"
                    : "var(--theme-text-4)",
                }}
              >
                <span>
                  {isPast && !isCurrent ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" style={isCurrent ? { color: "var(--theme-iris)" } : {}} />
                  )}
                </span>
                <span className="text-sm font-normal">{stage.label}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-10 text-center text-text-4" style={{ fontFamily: MONO, fontSize: "11px" }}>
        {stageLabel}
      </div>
    </motion.div>
  );
}
