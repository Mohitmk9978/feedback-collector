import { motion } from 'framer-motion';

export default function StatCard({ title, value, accent = 'from-indigo-500 to-violet-500' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/40 bg-white/50 p-5 shadow-glass backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/40"
    >
      <div
        className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-20 blur-2xl`}
      />
      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{title}</p>
      <p className="font-display mt-1 text-3xl font-semibold tracking-tight">{value}</p>
    </motion.div>
  );
}
