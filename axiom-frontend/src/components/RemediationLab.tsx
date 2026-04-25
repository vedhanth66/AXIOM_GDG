import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Wand2, Terminal, CheckCircle2 } from "lucide-react";

const SERIF = "'DM Serif Display', serif";
const MONO = "'JetBrains Mono', monospace";

export function RemediationLab({ explanation }: { explanation: any }) {
  const [selectedFix, setSelectedFix] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const fixes = explanation.remediation_steps
    .split("\n")
    .filter((line: string) => line.trim().startsWith("-"))
    .map((line: string) => line.replace("-", "").trim());

  const handleGenerateCode = async (fix: string) => {
    setSelectedFix(fix);
    setIsGenerating(true);
    setGeneratedCode("");

    try {
      const formData = new FormData();
      formData.append("finding", explanation.verdict);
      formData.append("approach", fix);

      const res = await fetch("http://localhost:8000/api/audit/fix", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      const code = data.code;
      let current = "";
      for (let i = 0; i < code.length; i++) {
        await new Promise((r) => setTimeout(r, 10));
        current += code[i];
        setGeneratedCode(current);
      }
    } catch {
      setGeneratedCode("# Error connecting to Gemini API.\n# Please check your network.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 max-w-7xl mx-auto min-h-screen flex flex-col"
    >
      <motion.header
        className="mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2
          className="text-text-primary mb-2 flex items-center gap-3"
          style={{ fontFamily: SERIF, fontSize: "30px", fontWeight: "normal" }}
        >
          <Wand2 className="w-6 h-6 text-iris" />
          Remediation Lab
        </h2>
        <p className="text-text-3 font-light">Gemini-recommended technical interventions.</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        
        <motion.div
          className="glass-panel rounded-3xl p-8 flex flex-col gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h3
            className="text-text-4 uppercase mb-3"
            style={{ fontFamily: MONO, fontSize: "10px", letterSpacing: "0.15em" }}
          >
            Recommended Actions
          </h3>

          {fixes.map((fix: string, idx: number) => {
            const isActive = selectedFix === fix;
            return (
              <motion.div
                key={idx}
                onClick={() => handleGenerateCode(fix)}
                className="p-4 rounded-xl border cursor-pointer flex items-start gap-4"
                style={{
                  background: isActive ? "var(--theme-surface)" : "transparent",
                  borderColor: isActive
                    ? "color-mix(in srgb, var(--theme-iris) 30%, transparent)"
                    : "var(--theme-border)",
                }}
                whileHover={{
                  borderColor: "var(--theme-border-2)",
                  scale: 1.01,
                }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.15 }}
              >
                <div className="mt-0.5">
                  {isActive ? (
                    <CheckCircle2 className="w-5 h-5 text-mint" />
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ border: "1.5px solid var(--theme-border-2)" }}
                    />
                  )}
                </div>
                <div>
                  <p className="text-text-2 font-light" style={{ fontSize: "13px", lineHeight: 1.6 }}>
                    {fix}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className="flex items-center gap-1 px-2.5 py-1 rounded text-iris"
                      style={{
                        fontFamily: MONO,
                        fontSize: "9px",
                        background: "var(--theme-iris-bg)",
                        border: "1px solid var(--theme-border)",
                      }}
                    >
                      <Code2 className="w-3 h-3" /> Generate Implementation Code
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="glass-panel rounded-3xl overflow-hidden flex flex-col relative"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div
            className="px-6 py-4 flex items-center gap-2"
            style={{
              background: "var(--theme-tag-bg)",
              borderBottom: "1px solid var(--theme-border)",
            }}
          >
            <Terminal className="w-4 h-4 text-text-4" />
            <span className="text-text-3" style={{ fontFamily: MONO, fontSize: "12px" }}>
              gemini-code-gen.py
            </span>
            {isGenerating && (
              <span className="ml-auto flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-iris opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-iris" />
              </span>
            )}
          </div>

          <div
            className="flex-1 p-6 overflow-auto relative"
            style={{
              background: "var(--theme-code-bg)",
              fontFamily: MONO,
              fontSize: "13px",
              color: "var(--theme-mint)",
              lineHeight: 1.7,
            }}
          >
            <AnimatePresence>
              {!selectedFix && !generatedCode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center flex-col gap-4"
                >
                  <Wand2 className="w-8 h-8 text-text-4 opacity-30" />
                  <span className="text-text-4" style={{ fontFamily: MONO, fontSize: "11px" }}>
                    Select a remediation step to generate code.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <pre className="whitespace-pre-wrap">
              {generatedCode}
              {isGenerating && (
                <span
                  className="inline-block w-2 h-4 ml-1 align-middle animate-pulse"
                  style={{ background: "var(--theme-mint)" }}
                />
              )}
            </pre>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
