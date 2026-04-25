import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Activity, Users, ChevronRight, FileText } from "lucide-react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'text-red-500';
    case 'high': return 'text-orange-500';
    case 'moderate': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

const getSeverityBg = (severity) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/10 border-red-500/30';
    case 'high': return 'bg-orange-500/10 border-orange-500/30';
    case 'moderate': return 'bg-yellow-500/10 border-yellow-500/30';
    case 'low': return 'bg-green-500/10 border-green-500/30';
    default: return 'bg-gray-500/10 border-gray-500/30';
  }
};

export function VerdictDashboard({ data, onNext }: { data: any, onNext: () => void }) {
  const { explanation, disparity_results, overall_severity } = data;
  const severityColor = getSeverityColor(overall_severity);
  const severityBg = getSeverityBg(overall_severity);

  // Prep data for Waterfall chart (taking the worst attribute for demo)
  const worstAttr = Object.keys(disparity_results)[0]; // For simplicity, take first
  const attrData = disparity_results[worstAttr];
  const chartData = Object.entries(attrData.group_positive_rates).map(([group, rate]) => ({
    name: group,
    rate: Number(((rate as number) * 100).toFixed(1)),
    isRef: group === attrData.reference_group
  })).sort((a, b) => b.rate - a.rate); // Sort descending

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col"
    >
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Audit Results</h1>
          <p className="text-gray-400">Analysis complete. Below is the executive summary.</p>
        </div>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors flex items-center gap-2"
        >
          View Remediation Lab <ChevronRight className="w-4 h-4" />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">

        {/* Top Left: Verdict Card */}
        <div className={`glass-panel rounded-3xl p-8 border ${severityBg} relative overflow-hidden group`}>
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
            {overall_severity === 'critical' ? <AlertTriangle className="w-32 h-32 text-red-500" /> : <ShieldCheck className="w-32 h-32 text-green-500" />}
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${severityBg} ${severityColor} border`}>
                {overall_severity} RISK
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1">
                <FileText className="w-4 h-4" /> Executive Verdict
              </span>
            </div>
            <p className="text-xl leading-relaxed text-white font-light">
              {explanation.verdict}
            </p>
          </div>
        </div>

        {/* Top Right: Disparity Chart */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col">
          <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-gray-300">
            <Activity className="w-5 h-5 text-purple-400" />
            Outcome Disparity (By {worstAttr.replace('_', ' ')})
          </h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" />
                <XAxis type="number" domain={[0, 100]} stroke="#666" tickFormatter={(val) => `${val}%`} />
                <YAxis dataKey="name" type="category" stroke="#ccc" width={100} tick={{ fill: '#ccc' }} />
                <RechartsTooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: 'rgba(10,10,20,0.9)', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isRef ? '#8b5cf6' : '#ef4444'} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Left: Impact Portrait */}
        <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-linear-to-b from-indigo-500 to-purple-500" />
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-indigo-300">
            <Users className="w-5 h-5" />
            Lived Experience Replay
          </h3>
          <blockquote className="text-gray-300 italic leading-relaxed text-lg pl-6 border-l border-white/10 relative">
            <span className="absolute -top-4 -left-2 text-6xl text-white/10 font-serif">"</span>
            {explanation.impact_portrait}
          </blockquote>
        </div>

        {/* Bottom Right: Counterfactual Score */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col justify-center items-center text-center relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-indigo-900/10 to-transparent pointer-events-none" />
          <h3 className="text-gray-400 font-medium mb-2 uppercase tracking-widest text-sm">Counterfactual Fairness Score</h3>
          <div className="text-8xl font-black bg-linear-to-b from-white to-gray-500 text-transparent bg-clip-text mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {attrData.counterfactual_fairness_score}%
          </div>
          <p className="text-sm text-gray-500 max-w-xs">
            "If we changed exactly one protected attribute, how often would the AI change its decision?"
          </p>
        </div>

      </div>
    </motion.div>
  );
}
