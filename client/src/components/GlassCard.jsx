/**
 * Glass-style panel used across dashboards and forms.
 */
export default function GlassCard({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-2xl border border-white/40 bg-white/60 p-6 shadow-glass backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-900/50 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
