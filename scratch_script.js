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

const globalReplacements = [
    ['text-purple-400', 'text-iris'],
    ['text-purple-500', 'text-iris-deep'],
    ['text-purple-600', 'text-[#8B6CD8]'],
    ['text-rose-400', 'text-rose'],
    ['text-green-400', 'text-mint'],
    ['text-green-500', 'text-[#86C89E]'],
    ['text-orange-500', 'text-sand'],
    ['text-yellow-500', 'text-sand'],
    ['text-gray-400', 'text-text-2'],
    ['text-gray-500', 'text-text-3'],
    ['text-gray-600', 'text-text-4'],
    ['bg-purple-600', 'bg-white text-black'],
    ['bg-purple-500/10', 'bg-iris/6'],
    ['bg-purple-900/30', 'bg-axiom-surface'],
    ['bg-purple-900/40', 'bg-[#0A0A0A]'],
    ['border-purple-500', 'border-iris/30'],
    ['border-purple-500/50', 'border-iris/20'],
    ['bg-indigo-900', 'bg-black'],
    ['from-purple-600 to-indigo-600', 'bg-white'],
    ['text-white', 'text-text-primary'],
    [/animate-pulse/g, ''],
    [/shadow-\[0_0_[^\]]+\]/g, ''],
    [/drop-shadow-\[0_0_[^\]]+\]/g, ''],
    ['font-black', "font-normal style={{fontFamily:\"'DM Serif Display', serif\"}}"],
    ['font-bold', 'font-medium']
];

function applyGlobals(filePath) {
    const fullPath = path.join(projectDir, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    for (const [search, replace] of globalReplacements) {
        if (typeof search === 'string') {
            content = content.split(search).join(replace);
        } else {
            content = content.replace(search, replace);
        }
    }
    fs.writeFileSync(fullPath, content);
}

['App.tsx', 'components/UploadPortal.tsx', 'components/AuditPulse.tsx', 'components/BiasTopologyMap.tsx', 'components/VerdictDashboard.tsx', 'components/RemediationLab.tsx'].forEach(applyGlobals);


replaceInFile('components/UploadPortal.tsx', [
    ['w-[800px] h-[800px] bg-purple-900/20 rounded-full blur-[120px]', 'bg-[radial-gradient(ellipse,rgba(196,168,245,0.05),transparent_60%)] w-[600px] h-[600px] absolute bottom-right'],
    ['bg-linear-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text', 'text-text-primary'],
    ['text-6xl font-normal style={{fontFamily:"\'DM Serif Display\', serif"}} tracking-tight mb-4 text-text-primary ', 'text-text-primary mb-4" style={{fontFamily:"\'DM Serif Display\', serif", fontSize: "clamp(44px, 8vw, 72px)", letterSpacing: "-0.02em"}}>'],
    ['AXIOM', 'A<em style={{fontStyle:"italic", color:"#C4A8F5"}}>X</em>IOM'],
    ['text-xl text-text-2 font-light max-w-2xl mx-auto', 'text-[16px] text-text-3 font-light max-w-2xl mx-auto tracking-[0.03em]'],
    ['glass-panel glass-panel-glow rounded-3xl p-10', 'glass-panel rounded-3xl p-8 bg-axiom-surface border-axiom-border'],
    ['border-2 border-dashed border-iris/30/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-iris/30/60 transition-colors bg-iris/30/5 group', 'border border-dashed border-axiom-border-2 hover:border-iris/40 bg-[#0A0A0A] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group'],
    ['bg-iris/6 rounded-full mb-4 group-hover:scale-110 transition-transform', 'bg-axiom-surface-2 rounded-full mb-4 group-hover:scale-110 transition-transform'],
    ['<h3 className="text-xl font-medium mb-2">', '<h3 className="text-xl font-normal text-text-primary mb-2">'],
    ['<p className="text-sm text-text-2">', '<p className="text-sm font-light text-text-3">'],
    ['px-4 py-2 bg-gray-900 rounded-full text-xs text-text-3 flex items-center gap-2', 'px-4 py-2 bg-[#0A0A0A] border border-axiom-border-2 rounded-full text-xs text-text-3 font-mono flex items-center gap-2'],
    ['bg-[#86C89E]', 'bg-mint'],
    ['<h3 className="text-xl font-medium mb-4 flex items-center gap-2">', '<h3 className="mb-4 flex items-center gap-2" style={{fontFamily: "\'DM Serif Display\', serif", fontWeight: "normal", fontSize: "18px"}}>'],
    ['text-indigo-400', 'text-iris'],

    [`domain === d.id
                        ? 'border-iris/30 bg-iris/30/20 text-text-primary '
                        : 'border-white/10 bg-white/5 text-text-2 hover:bg-white/10'`, `domain === d.id ? 'bg-axiom-surface-2 border-iris/40 text-text-primary' : 'bg-transparent border-axiom-border text-text-3 hover:border-axiom-border-2 hover:text-text-2'`],
    ['w-full flex items-center gap-3 p-3 rounded-xl border transition-all', 'w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 font-normal tracking-[0.01em]'],
    ['{ id: "hiring", label: "Hiring & Recruitment", icon: <Cpu className="w-4 h-4" /> }', '{ id: "hiring", label: "Hiring & Recruitment", icon: <Cpu className="w-4 h-4 text-iris" /> }'],
    ['{ id: "lending", label: "Financial Lending", icon: <ShieldAlert className="w-4 h-4" /> }', '{ id: "lending", label: "Financial Lending", icon: <ShieldAlert className="w-4 h-4 text-sand" /> }'],
    ['{ id: "healthcare", label: "Healthcare Outcomes", icon: <HeartPulse className="w-4 h-4" /> }', '{ id: "healthcare", label: "Healthcare Outcomes", icon: <HeartPulse className="w-4 h-4 text-rose" /> }'],
    ['<p className="text-sm text-text-2 mb-2">Protected Attributes Detected:</p>', '<p className="font-mono text-text-4 tracking-[0.12em] text-[10px] uppercase mb-2">Protected Attributes Detected:</p>'],
    [`{["Race", "Gender", "Age Group"].map(attr => (
                    <span key={attr} className="px-3 py-1 bg-indigo-900/40 border border-indigo-500/30 rounded-full text-xs text-indigo-300">
                      {attr}
                    </span>
                  ))}`, `{["Race", "Gender", "Age Group"].map(attr => {
                    let classes = "";
                    if (attr === "Race") classes = "bg-[#0A0A0A] border-axiom-border text-iris";
                    else if (attr === "Gender") classes = "bg-[#1A0A0E] border-rose/20 text-rose";
                    else if (attr === "Age Group") classes = "bg-[#0A1A10] border-mint/20 text-mint";
                    return (
                    <span key={attr} className={"px-3 py-1 border rounded-full font-mono text-[9px] tracking-[0.12em] uppercase " + classes}>
                      {attr}
                    </span>
                  )})}`],
    ['w-full py-4 rounded-xl font-medium text-lg bg-linear-to-r hover:from-purple-500 hover:to-indigo-500  hover: transition-all flex justify-center items-center gap-2 disabled:opacity-50', 'w-full py-4 rounded-xl font-medium text-lg bg-white text-black hover:bg-[#F5F5F5] disabled:bg-axiom-border disabled:text-text-4 font-body tracking-[0.04em] transition-all flex justify-center items-center gap-2'],
    ['border-white/30 border-t-white', 'border-black/20 border-t-black']
]);

replaceInFile('components/AuditPulse.tsx', [
    ['from-indigo-900/20 via-black to-black', 'bg-black'],
    ['stroke="#a855f7" 
    ['rgba(255,255,255,0.05)', '#1A1A1A'],
    ['text-5xl font-light text-text-primary', 'text-[48px] text-text-primary" style={{fontFamily:"\'DM Serif Display\', serif"}}'],
    ['text-xs text-iris mt-1 uppercase tracking-widest', 'text-[11px] text-text-4 font-mono uppercase tracking-[0.2em] mt-1'],
    ['text-4xl font-mono text-iris font-light tracking-tight', 'text-[40px] text-iris tracking-tight" style={{fontFamily:"\'DM Serif Display\', serif"}}'],
    ['text-4xl font-mono text-rose font-light tracking-tight', 'text-[40px] text-rose tracking-tight" style={{fontFamily:"\'DM Serif Display\', serif"}}'],
    ['text-xs text-text-3 mt-2 uppercase tracking-wider', 'text-[9px] text-text-4 font-mono uppercase tracking-[0.18em] mt-2'],
    ['bg-white/10', 'bg-axiom-surface-2'], 
    ['bg-purple-500 ', 'bg-iris '],
    ['bg-green-500', 'bg-mint'],
    ['bg-white/20', 'bg-axiom-surface'],
    ['border-iris/30/50 bg-iris/6 text-text-primary', 'border-iris/20 bg-axiom-surface text-text-primary'],
    ['border-[#86C89E]/20 bg-[#86C89E]/5 text-mint', 'border-mint/20 bg-transparent text-mint'],
    ['border-white/5 bg-transparent text-text-4', 'border-axiom-surface bg-transparent text-text-4'],
    ['<div className="mt-8 text-center text-text-2 text-sm', '<div className="mt-8 text-center text-text-4 font-mono text-[11px]'],
    ['animate-pulse', '']
]);

