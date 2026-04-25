import { motion } from "framer-motion";
import { AlertTriangle, ShieldCheck, Activity, Users, ChevronRight, FileText } from "lucide-react";
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from "recharts";

const SERIF = "'DM Serif Display', serif";
const MONO = "'JetBrains Mono', monospace";

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical": return "var(--theme-rose)";
    case "high": return "var(--theme-sand)";
    case "moderate": return "var(--theme-periwinkle)";
    case "low": return "var(--theme-mint)";
    default: return "var(--theme-text-4)";
  }
};

const getSeverityBgStyle = (severity: string) => {
  switch (severity) {
    case "critical": return { background: "var(--theme-rose-bg)", borderColor: "var(--theme-rose-border)" };
    case "high": return { background: "var(--theme-sand-bg)", borderColor: "var(--theme-sand-border)" };
    case "moderate": return { background: "var(--theme-periwinkle-bg)", borderColor: "var(--theme-periwinkle-border)" };
    case "low": return { background: "var(--theme-mint-bg)", borderColor: "var(--theme-mint-border)" };
    default: return { background: "var(--theme-surface)", borderColor: "var(--theme-border)" };
  }
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function VerdictDashboard({ data, onNext }: { data: any; onNext: () => void }) {
  const { explanation, disparity_results, overall_severity } = data;
  const sevColor = getSeverityColor(overall_severity);
  const sevBg = getSeverityBgStyle(overall_severity);

  const worstAttr = Object.keys(disparity_results)[0];
  const attrData = disparity_results[worstAttr];
  const chartData = Object.entries(attrData.group_positive_rates)
    .map(([group, rate]) => ({
      name: group,
      rate: Number(((rate as number) * 100).toFixed(1)),
      isRef: group === attrData.reference_group,
    }))
    .sort((a, b) => b.rate - a.rate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen p-8 max-w-7xl mx-auto flex flex-col"
    >
      
      <motion.header
        className="flex justify-between items-end mb-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div>
          <h1 className="text-text-primary mb-2" style={{ fontFamily: SERIF, fontSize: "36px" }}>
            Audit Results
          </h1>
          <p className="text-text-3 font-light">Analysis complete. Below is the executive summary.</p>
        </div>
        <motion.button
          onClick={onNext}
          className="px-6 py-3 rounded-xl flex items-center gap-2 font-medium text-sm"
          style={{
            background: "transparent",
            border: "1px solid var(--theme-border-2)",
            color: "var(--theme-text-3)",
          }}
          whileHover={{ borderColor: "var(--theme-border-3)", color: "var(--theme-text-primary)", scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Remediation Lab <ChevronRight className="w-4 h-4" />
        </motion.button>
      </motion.header>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1"
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        
        <motion.div
          className="glass-panel rounded-3xl p-8 border relative overflow-hidden group"
          style={sevBg}
          variants={fadeUp}
        >
          <div className="absolute top-0 right-0 p-6 opacity-[0.06] group-hover:scale-110 transition-transform duration-500">
            {overall_severity === "critical" ? (
              <AlertTriangle className="w-32 h-32" style={{ color: sevColor }} />
            ) : (
              <ShieldCheck className="w-32 h-32" style={{ color: sevColor }} />
            )}
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <span
                className="px-4 py-1 rounded-full border uppercase"
                style={{
                  fontFamily: MONO,
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  color: sevColor,
                  borderColor: sevBg.borderColor,
                  background: sevBg.background,
                }}
              >
                {overall_severity} RISK
              </span>
              <span className="text-text-3 text-sm flex items-center gap-1">
                <FileText className="w-4 h-4" /> Executive Verdict
              </span>
            </div>
            <p className="text-text-primary leading-[1.8] font-light" style={{ fontSize: "16px" }}>
              {explanation.verdict}
            </p>
          </div>
        </motion.div>

        <motion.div className="glass-panel rounded-3xl p-8 flex flex-col" variants={fadeUp}>
          <h3 className="text-lg font-medium mb-6 flex items-center gap-2 text-text-2">
            <Activity className="w-5 h-5 text-iris" />
            Outcome Disparity (By {worstAttr.replace("_", " ")})
          </h3>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--theme-chart-grid)" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="var(--theme-chart-axis)"
                  tick={{ fill: "var(--theme-chart-tick)", fontFamily: MONO, fontSize: 11 }}
                  tickFormatter={(val: number) => `${val}%`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="var(--theme-chart-axis)"
                  width={100}
                  tick={{ fill: "var(--theme-chart-tick)", fontFamily: MONO, fontSize: 11 }}
                />
                <RechartsTooltip
                  cursor={{ fill: "var(--theme-iris-bg)" }}
                  contentStyle={{
                    backgroundColor: "var(--theme-tooltip-bg)",
                    border: "1px solid var(--theme-border)",
                    borderRadius: "10px",
                    fontFamily: MONO,
                    fontSize: "12px",
                    color: "var(--theme-text-primary)",
                  }}
                />
                <Bar dataKey="rate" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isRef ? "var(--theme-iris)" : "var(--theme-rose)"} />
                  ))}
                </Bar>
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div className="glass-panel rounded-3xl p-8 relative overflow-hidden" variants={fadeUp}>
          <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-full" style={{ background: "var(--theme-iris-bg)" }} />
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-iris">
            <Users className="w-5 h-5" />
            Lived Experience Replay
          </h3>
          <blockquote className="text-text-2 font-light italic leading-relaxed text-lg pl-6 relative" style={{ borderLeft: "1px solid var(--theme-border)" }}>
            <span className="absolute -top-4 -left-2 text-6xl font-serif" style={{ color: "var(--theme-iris-bg)" }}>"</span>
            {explanation.impact_portrait}
          </blockquote>
        </motion.div>

        <motion.div className="glass-panel rounded-3xl p-8 flex flex-col justify-center items-center text-center relative" variants={fadeUp}>
          <h3 className="text-text-3 font-medium mb-3 uppercase text-sm" style={{ fontFamily: MONO, letterSpacing: "0.15em", fontSize: "10px" }}>
            Counterfactual Fairness Score
          </h3>
          <div className="text-text-primary mb-4" style={{ fontFamily: SERIF, fontSize: "80px", lineHeight: 1 }}>
            {attrData.counterfactual_fairness_score}
            <span className="text-iris">%</span>
          </div>
          <p className="text-text-3 max-w-xs font-light" style={{ fontFamily: MONO, fontSize: "11px", lineHeight: 1.6 }}>
            "If we changed exactly one protected attribute, how often would the AI change its decision?"
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
