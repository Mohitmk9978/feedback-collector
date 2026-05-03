import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/30 bg-white/50 text-lg backdrop-blur-md transition hover:bg-white/70 dark:border-slate-600 dark:bg-slate-800/60 dark:hover:bg-slate-800"
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </motion.button>
  );
}
