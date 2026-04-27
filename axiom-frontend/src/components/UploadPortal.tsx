import { motion } from "framer-motion";
import { UploadCloud, ShieldAlert, Cpu, HeartPulse, Sparkles, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";

const SERIF = "'DM Serif Display', serif";
const MONO = "'JetBrains Mono', monospace";

const domainOptions = [
  { id: "hiring", label: "Hiring & Recruitment", icon: Cpu, accent: "var(--theme-iris)" },
  { id: "lending", label: "Financial Lending", icon: ShieldAlert, accent: "var(--theme-sand)" },
  { id: "healthcare", label: "Healthcare Outcomes", icon: HeartPulse, accent: "var(--theme-rose)" },
];

const protectedAttrs = [
  { name: "Race", color: "var(--theme-iris)" },
  { name: "Gender", color: "var(--theme-rose)" },
  { name: "Age Group", color: "var(--theme-mint)" },
];

export function UploadPortal({ onStart }: { onStart: (domain: string, file: File | null) => void }) {
  const [domain, setDomain] = useState("hiring");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStart = () => {
    setIsLoading(true);
    onStart(domain, selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.csv')) {
        setSelectedFile(file);
      } else {
        alert("Please upload a CSV file.");
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
    >
      
      <div
        className="absolute bottom-0 right-0 w-[700px] h-[700px] pointer-events-none -z-10 opacity-60"
        style={{
          background: "radial-gradient(ellipse at center, var(--theme-iris-bg), transparent 70%)",
          transform: "translate(30%, 30%)",
        }}
      />

      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
      >
        <h1
          className="text-text-primary mb-5"
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(48px, 8vw, 80px)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          A<em className="text-iris" style={{ fontStyle: "italic" }}>X</em>IOM
        </h1>
        <p className="text-text-3 font-light max-w-xl mx-auto" style={{ fontSize: "15px", letterSpacing: "0.02em", lineHeight: 1.7 }}>
          Adversarial eXplainable Intelligence for Outcome Monitoring.
          <br />
          <span className="text-text-2 font-normal">Don't just audit your AI. Make it confess.</span>
        </p>
      </motion.div>

      <motion.div
        className="glass-panel rounded-3xl p-8 w-full max-w-4xl relative"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <motion.div
            className={`border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer group relative transition-colors ${isDragging ? 'bg-white/5' : ''}`}
            style={{
              borderColor: isDragging ? "var(--theme-iris)" : (selectedFile ? "var(--theme-mint)" : "var(--theme-border-2)"),
              background: isDragging ? "color-mix(in srgb, var(--theme-iris) 10%, transparent)" : "var(--theme-tag-bg)",
            }}
            whileHover={{ borderColor: selectedFile ? "var(--theme-mint)" : "var(--theme-iris)", scale: 1.01 }}
            transition={{ duration: 0.2 }}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <motion.div
              className="p-4 rounded-full mb-4"
              style={{ background: "var(--theme-surface-2)" }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {selectedFile ? (
                <CheckCircle2 className="w-10 h-10 text-mint" />
              ) : (
                <UploadCloud className="w-10 h-10 text-iris" />
              )}
            </motion.div>
            <h3 className="text-lg font-normal text-text-primary mb-1">
              {selectedFile ? "Data Connected" : "Connect Data"}
            </h3>
            <p className="text-sm text-text-3 font-light">
              {selectedFile ? "CSV dataset successfully parsed." : "Drag & drop your CSV or click to browse."}
            </p>
            <div
              className="mt-6 px-4 py-2 rounded-full text-text-3 flex items-center gap-2"
              style={{
                background: "var(--theme-tag-bg)",
                border: "1px solid var(--theme-border-2)",
                fontFamily: MONO,
                fontSize: "11px",
              }}
            >
              <span className={`w-2 h-2 rounded-full ${selectedFile ? "bg-mint animate-pulse" : "bg-iris animate-pulse"}`} />
              {selectedFile ? selectedFile.name : "COMPAS Demo Dataset Loaded"}
            </div>
          </motion.div>

          <div className="flex flex-col justify-between">
            <div>
              <h3
                className="mb-5 flex items-center gap-2 text-text-primary"
                style={{ fontFamily: SERIF, fontWeight: "normal", fontSize: "20px" }}
              >
                <ShieldAlert className="w-5 h-5 text-iris" />
                Audit Configuration
              </h3>

              <div className="space-y-2.5 mb-8">
                {domainOptions.map((d) => {
                  const Icon = d.icon;
                  const isActive = domain === d.id;
                  return (
                    <motion.button
                      key={d.id}
                      onClick={() => setDomain(d.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border font-normal text-sm"
                      style={{
                        background: isActive ? "var(--theme-surface-2)" : "transparent",
                        borderColor: isActive ? d.accent : "var(--theme-border)",
                        borderWidth: isActive ? "1.5px" : "1px",
                        color: isActive ? "var(--theme-text-primary)" : "var(--theme-text-3)",
                        letterSpacing: "0.01em",
                      }}
                      whileHover={{
                        borderColor: isActive ? d.accent : "var(--theme-border-2)",
                        color: "var(--theme-text-primary)",
                      }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Icon className="w-4 h-4" style={{ color: d.accent }} />
                      {d.label}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mb-6">
                <p
                  className="text-text-4 uppercase mb-2.5"
                  style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: "0.14em" }}
                >
                  Protected Attributes Detected:
                </p>
                <div className="flex gap-2 flex-wrap">
                  {protectedAttrs.map((attr) => (
                    <span
                      key={attr.name}
                      className="px-3 py-1 rounded-full uppercase"
                      style={{
                        fontFamily: MONO,
                        fontSize: "9px",
                        letterSpacing: "0.12em",
                        color: attr.color,
                        border: `1px solid color-mix(in srgb, ${attr.color} 25%, transparent)`,
                        background: `color-mix(in srgb, ${attr.color} 6%, transparent)`,
                      }}
                    >
                      {attr.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleStart}
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-medium text-base tracking-wide flex justify-center items-center gap-2 disabled:opacity-40"
              style={{
                background: 'var(--theme-cta-bg)',
                color: 'var(--theme-cta-text)',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
              whileHover={{ scale: 1.01, opacity: 0.9 }}
              whileTap={{ scale: 0.99 }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--theme-cta-text)', borderTopColor: 'transparent', opacity: 0.5 }} />
                  Initializing Engine...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Begin Audit Sequence
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
