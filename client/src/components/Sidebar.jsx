import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

const item = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-200'
      : 'text-slate-600 hover:bg-white/60 dark:text-slate-300 dark:hover:bg-slate-800/80'
  }`;

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-2 border-r border-white/30 bg-white/40 p-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/40 md:flex">
      <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Menu
      </p>
      <nav className="flex flex-col gap-1">
        <NavLink to="/dashboard" className={item}>
          <span>📊</span> Overview
        </NavLink>
        <NavLink to="/feedback/new" className={item}>
          <span>✏️</span> Submit feedback
        </NavLink>
        <NavLink to="/feedback/mine" className={item}>
          <span>📋</span> My feedback
        </NavLink>
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={item}>
            <span>🛡️</span> Admin
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
