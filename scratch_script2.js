const fs = require('fs');
const path = require('path');

const projectDir = 'd:/Vedhanth/studies/Coding/Hackathon/GDG/axiom-frontend/src';

function replaceInFile(filePath, replacements) {
    const fullPath = path.join(projectDir, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    for (const [search, replace] of replacements) {
        if (typeof search === 'string') {
            content = content.split(search).join(replace);
        } else {
            content = content.replace(search, replace);
        }
    }
    fs.writeFileSync(fullPath, content);
}

replaceInFile('components/BiasTopologyMap.tsx', [
    ['critical: "#ef4444", // Red', 'critical: "#F5A0B5",'],
    ['high: "#f97316",     // Orange', 'high: "#F5C888",'],
    ['moderate: "#eab308", // Yellow', 'moderate: "#B8CCEE",'],
    ['low: "#22c55e",      // Green', 'low: "#98D5B0",'],
    ['none: "#6b7280"      // Gray', 'none: "#3A3A3A"'],
    [`      if (severity === "critical") {
        material.emissiveIntensity = 0.4 + Math.sin(state.clock.elapsedTime * 3 + x) * 0.3;
      } else if (hovered) {
        material.emissiveIntensity = 0.8;
      } else {
        material.emissiveIntensity = 0;
      }`, `      if (hovered) {
        material.emissiveIntensity = 0.15;
      } else {
        material.emissiveIntensity = 0;
      }`],
    ['metalness={0.2}', 'metalness={0.0}'],
    ['roughness={0.4}', 'roughness={0.85}'],
    ['opacity={hovered ? 0.4 : 0.1}', 'opacity={hovered ? 0.12 : 0.04}'],
    ['<meshStandardMaterial color="#050510" />', '<meshStandardMaterial color="#050505" />'],
    ['<gridHelper args={[40, 20, "#333", "#111"]} position={[0, 0.01, 0]} />', '<gridHelper args={[40, 20, "#1A1A1A", "#0D0D0D"]} position={[0, 0.01, 0]} />'],
    ['<color attach="background" args={[\'#030008\']} />', '<color attach="background" args={[\'#000000\', 0, 0]} />'],
    ['<fog attach="fog" args={[\'#030008\', 20, 50]} />', '<fog attach="fog" args={[\'#000000\', 18, 40]} />'],
    ['<ambientLight intensity={0.4} />', '<ambientLight intensity={0.7} />'],
    ['<directionalLight position={[10, 20, 10]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />', '<directionalLight position={[10, 20, 10]} intensity={0.6} castShadow shadow-mapSize={[1024, 1024]} />'],
    ['<pointLight position={[-10, 10, -10]} color="#a855f7" intensity={2} />', '<pointLight position={[-10, 10, -10]} color="#444444" intensity={0.4} />'],
    ['camera={{ position: [15, 12, 15], fov: 45 }}', 'camera={{ position: [10, 8, 10], fov: 45 }}'],
    ['autoRotateSpeed={0.8}', 'autoRotateSpeed={0.3}'],
    ['<h2 className="text-2xl font-light text-white tracking-wide">Bias Topology Map</h2>', '<h2 className="text-[22px] text-text-primary tracking-wide" style={{fontFamily:"\'DM Serif Display\', serif", fontStyle:"italic"}}>Bias Topology Map</h2>'],
    ['<p className="text-gray-400 text-sm mt-1">', '<p className="text-text-4 font-mono text-[11px] mt-1">'],
    ['<div className="absolute bottom-6 right-6 z-10 glass-panel p-3 rounded-lg flex flex-col gap-2 pointer-events-none">', '<div className="absolute bottom-6 right-6 z-10 p-3 rounded-lg flex flex-col gap-2 pointer-events-none" style={{background:"#111111", border:"1px solid #222222"}}>'],
    ['className="text-gray-300 text-xs uppercase tracking-wider"', 'className="font-mono text-[9px] tracking-[0.12em] uppercase" style={{color:"#A0A0A0"}}'],
    ['className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"', 'className="w-3 h-3 rounded-full"'],
    ['className="absolute z-20 glass-panel p-4 rounded-xl pointer-events-none transition-opacity"', 'className="absolute z-20 p-4 rounded-xl pointer-events-none transition-opacity" style={{background:"#111111", border:"1px solid #222222"}}'],
    ['<div className="text-xs text-gray-400 uppercase">{tooltip.attribute}</div>', '<div className="font-mono text-[9px] text-text-4 uppercase">{tooltip.attribute}</div>'],
    ['<div className="text-lg font-bold text-white mb-1">{tooltip.group}</div>', '<div className="text-[20px] text-text-primary mb-1" style={{fontFamily: "\'DM Serif Display\', serif"}}>{tooltip.group}</div>'],
    ['className="font-mono text-purple-400"', 'className="font-mono text-iris"'],
    ['<span className="text-purple-400">Peaks indicate severe bias.</span>', '<span className="text-iris">Peaks indicate severe bias.</span>']
]);

replaceInFile('components/VerdictDashboard.tsx', [
    [`const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'moderate': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };`, `const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'text-rose';
      case 'high': return 'text-sand';
      case 'moderate': return 'text-periwinkle';
      case 'low': return 'text-mint';
      default: return 'text-text-4';
    }
  };`],
    [`const getSeverityBg = (sev: string) => {
    switch (sev) {
      case 'critical': return 'bg-red-500/10 border-red-500/30';
      case 'high': return 'bg-orange-500/10 border-orange-500/30';
      case 'moderate': return 'bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'bg-green-500/10 border-green-500/30';
      default: return 'bg-white/5 border-white/10';
    }
  };`, `const getSeverityBg = (sev: string) => {
    switch (sev) {
      case 'critical': return 'bg-[#0F0608] border-rose/15';
      case 'high': return 'bg-[#0F0A04] border-sand/15';
      case 'moderate': return 'bg-[#060A0F] border-periwinkle/15';
      case 'low': return 'bg-[#040F08] border-mint/15';
      default: return 'bg-axiom-surface border-axiom-border';
    }
  };`],
    ['<h2 className="text-4xl font-black text-white">Audit Results</h2>', '<h2 className="text-[36px] text-text-primary" style={{fontFamily:"\'DM Serif Display\', serif"}}>Audit Results</h2>'],
    ['<p className="text-gray-400 text-lg">', '<p className="text-text-3 font-light text-lg">'],
    ['bg-white/10 hover:bg-white/20 border-white/20', 'bg-transparent border-axiom-border-2 text-text-3 hover:border-axiom-border-3 hover:text-text-2'],
    ['<ShieldAlert className="w-48 h-48 absolute -bottom-10 -right-10 opacity-5" />', '<ShieldAlert className="w-48 h-48 absolute -bottom-10 -right-10 opacity-[0.04]" />'],
    ['className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider', 'className={`px-3 py-1 rounded-full border font-mono text-[9px] tracking-[0.15em] uppercase'],
    ['<div className="text-lg text-white leading-relaxed font-light">', '<div className="text-[#C8C8C8] font-light leading-[1.8] text-[16px]">'],
    ['<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />', '<CartesianGrid strokeDasharray="3 3" stroke="#1A1A1A" />'],
    ['<XAxis dataKey="group" stroke="rgba(255,255,255,0.3)" />', '<XAxis dataKey="group" stroke="#2E2E2E" tick={{fill:"#606060", fontFamily:"\'JetBrains Mono\', monospace"}} />'],
    ['<YAxis stroke="rgba(255,255,255,0.3)" />', '<YAxis stroke="#2E2E2E" tick={{fill:"#606060", fontFamily:"\'JetBrains Mono\', monospace"}} />'],
    ['contentStyle={{ backgroundColor: \'rgba(0,0,0,0.8)\', borderColor: \'rgba(255,255,255,0.1)\' }}', 'contentStyle={{ backgroundColor: \'#111111\', borderColor: \'#222222\', borderRadius: \'10px\', fontFamily: \'JetBrains Mono\' }}'],
    ['fill={entry.group === data.disparities[0].reference_group ? "#22c55e" : "#ef4444"}', 'fill={entry.group === data.disparities[0].reference_group ? "var(--theme-iris)" : "var(--theme-rose)"}'],
    ['className="text-6xl font-bold bg-linear-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text"', 'className="text-6xl text-text-primary" style={{fontFamily:"\'DM Serif Display\', serif"}}'],
    ['<span className="text-gray-500 font-mono text-sm mt-2">', '<span className="text-text-4 font-mono text-[11px] mt-2">'],
    ['className="w-1 h-full bg-linear-to-b from-purple-500 to-transparent mr-4"', 'className="w-1 h-full bg-iris/20 mr-4"'],
    ['className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2"', 'className="text-sm font-medium text-iris uppercase tracking-widest mb-2"'],
    ['<div className="text-gray-300 italic text-lg leading-relaxed relative">', '<div className="text-text-2 font-light italic text-lg leading-relaxed relative">'],
    ['className="text-4xl text-purple-500/20 absolute -top-4 -left-2"', 'className="text-4xl text-iris/6 absolute -top-4 -left-2"']
]);

replaceInFile('components/RemediationLab.tsx', [
    ['<h2 className="text-3xl font-bold mb-2 flex items-center gap-3">', '<h2 className="text-3xl font-normal text-text-primary mb-2 flex items-center gap-3" style={{fontFamily:"\'DM Serif Display\', serif"}}>'],
    ['<p className="text-gray-400">', '<p className="text-text-3 font-light">'],
    ['<h3 className="text-xl font-medium mb-4 text-white">Recommended Actions</h3>', '<h3 className="font-mono text-text-4 text-[10px] uppercase tracking-[0.15em] mb-4">Recommended Actions</h3>'],
    [`              className={\`p-4 rounded-xl border cursor-pointer transition-colors flex items-start gap-4 \${
                selectedFix === fix 
                  ? 'bg-purple-900/30 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
                  : 'bg-black/20 border-white/10 hover:border-white/30'
              }\``, `              className={\`p-4 rounded-xl border cursor-pointer transition-colors flex items-start gap-4 \${
                selectedFix === fix 
                  ? 'bg-axiom-surface border-iris/25' 
                  : 'bg-transparent border-axiom-surface-2 hover:border-axiom-border-2'
              }\``],
    ['<p className="text-sm font-medium text-gray-200">{fix}</p>', '<p className="text-[13px] font-light text-[#C8C8C8]">{fix}</p>'],
    ['<CheckCircle2 className="w-5 h-5 text-purple-400" />', '<CheckCircle2 className="w-5 h-5 text-mint" />'],
    ['<div className="w-5 h-5 rounded-full border border-gray-600" />', '<div className="w-5 h-5 rounded-full border border-axiom-border-2" />'],
    ['className="text-xs text-purple-400 flex items-center gap-1 bg-purple-500/10 px-2 py-1 rounded"', 'className="flex items-center gap-1 bg-axiom-surface border border-axiom-border px-2 py-1 rounded text-iris font-mono text-[9px]"'],
    ['<div className="bg-[#0d0d12] px-6 py-4 flex items-center gap-2 border-b border-white/5">', '<div className="bg-[#0A0A0A] px-6 py-4 flex items-center gap-2 border-b border-[#1A1A1A]">'],
    ['className="text-sm font-mono text-gray-400"', 'className="font-mono text-text-4 text-sm"'],
    ['bg-purple-400', 'bg-iris'],
    ['bg-purple-500', 'bg-iris'],
    ['<div className="flex-1 bg-[#050508] p-6 font-mono text-sm overflow-auto text-green-400 relative">', '<div className="flex-1 bg-axiom-bg p-6 font-mono text-sm overflow-auto text-mint relative">'],
    ['<Wand2 className="w-12 h-12 opacity-20" />', '<Wand2 className="w-[24px] h-[24px] text-axiom-surface-2" />'],
    ['className="absolute inset-0 flex items-center justify-center text-gray-600 flex-col gap-4"', 'className="absolute inset-0 flex items-center justify-center text-axiom-border-2 font-mono text-[11px] flex-col gap-4"'],
    ['<span className="animate-pulse bg-green-400 w-2 h-4 inline-block ml-1 align-middle"/>', '<span className="animate-pulse bg-mint w-2 h-4 inline-block ml-1 align-middle"/>']
]);
