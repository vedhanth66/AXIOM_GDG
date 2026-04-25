import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Wand2, Terminal, CheckCircle2 } from "lucide-react";

export function RemediationLab({ explanation }: { explanation: any }) {
  const [selectedFix, setSelectedFix] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Parse the markdown bullet points from Gemini into an array
  const fixes = explanation.remediation_steps
    .split('\n')
    .filter((line: string) => line.trim().startsWith('-'))
    .map((line: string) => line.replace('-', '').trim());

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
        body: formData
      });
      const data = await res.json();
      
      // Simulate streaming for demo effect
      const code = data.code;
      let current = "";
      for (let i = 0; i < code.length; i++) {
        await new Promise(r => setTimeout(r, 10)); // 10ms per char
        current += code[i];
        setGeneratedCode(current);
      }
    } catch (e) {
      setGeneratedCode("# Error connecting to Gemini API.\n# Please check your network.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 max-w-7xl mx-auto min-h-screen flex flex-col"
    >
      <header className="mb-10">
        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Wand2 className="text-purple-400" />
          Remediation Lab
        </h2>
        <p className="text-gray-400">Gemini-recommended technical interventions.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        
        {/* Left: Fix Checklist */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col gap-4">
          <h3 className="text-xl font-medium mb-4 text-white">Recommended Actions</h3>
          {fixes.map((fix: string, idx: number) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-xl border cursor-pointer transition-colors flex items-start gap-4 ${
                selectedFix === fix 
                  ? 'bg-purple-900/30 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                  : 'bg-black/20 border-white/10 hover:border-white/30'
              }`}
              onClick={() => handleGenerateCode(fix)}
            >
              <div className="mt-1">
                {selectedFix === fix ? <CheckCircle2 className="w-5 h-5 text-purple-400" /> : <div className="w-5 h-5 rounded-full border border-gray-600" />}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-200">{fix}</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs text-purple-400 flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded">
                    <Code2 className="w-3 h-3" /> Generate Implementation Code
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right: Code Generator */}
        <div className="glass-panel rounded-3xl overflow-hidden flex flex-col border-gray-800 relative">
          <div className="bg-[#0d0d12] px-6 py-4 flex items-center gap-2 border-b border-white/5">
            <Terminal className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-mono text-gray-400">gemini-code-gen.py</span>
            {isGenerating && <span className="ml-auto flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span></span>}
          </div>
          <div className="flex-1 bg-[#050508] p-6 font-mono text-sm overflow-auto text-green-400 relative">
             <AnimatePresence>
               {!selectedFix && !generatedCode && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center text-gray-600 flex-col gap-4"
                  >
                    <Wand2 className="w-12 h-12 opacity-20" />
                    Select a remediation step to generate code.
                  </motion.div>
               )}
             </AnimatePresence>
             <pre className="whitespace-pre-wrap leading-relaxed">
               {generatedCode}
               {isGenerating && <span className="animate-pulse bg-green-400 w-2 h-4 inline-block ml-1 align-middle"/>}
             </pre>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
