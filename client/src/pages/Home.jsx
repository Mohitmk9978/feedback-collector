import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import GlassCard from '../components/GlassCard.jsx';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="space-y-12">
      <section className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Collect feedback that{' '}
          <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            drives better products
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400"
        >
          Students, testers, and customers can submit bugs, ideas, and ratings—admins review
          everything in one glassy dashboard.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          {user ? (
            <Link
              to="/feedback/new"
              className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
            >
              Submit feedback
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="rounded-xl border border-slate-300 bg-white/70 px-6 py-3 font-semibold text-slate-800 backdrop-blur dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-100"
              >
                Sign in
              </Link>
            </>
          )}
        </motion.div>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: 'Structured reports', desc: 'Categories, priority, and ratings keep signal high.' },
          { title: 'Admin workflow', desc: 'Statuses from pending to resolved with optional email alerts.' },
          { title: 'Built for learning', desc: 'Clear MERN structure—great for portfolios and practice.' },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
          >
            <GlassCard className="h-full">
              <h3 className="font-display text-lg font-semibold">{card.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{card.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
