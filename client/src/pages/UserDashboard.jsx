import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import GlassCard from '../components/GlassCard.jsx';
import StatCard from '../components/StatCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { fetchFeedbackList } from '../services/api.js';

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0, avg: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchFeedbackList({ limit: 100, page: 1 });
        if (cancelled) return;
        const items = res.data || [];
        const total = res.pagination?.total ?? items.length;
        const resolved = items.filter((x) => x.status === 'resolved').length;
        const pending = items.filter((x) => x.status === 'pending').length;
        const avg =
          items.length > 0
            ? Math.round(
                (items.reduce((s, x) => s + x.rating, 0) / items.length) * 10
              ) / 10
            : 0;

        const byDay = {};
        items.forEach((f) => {
          const d = new Date(f.createdAt).toLocaleDateString();
          byDay[d] = (byDay[d] || 0) + 1;
        });
        const chart = Object.entries(byDay)
          .map(([date, count]) => ({ date, count }))
          .slice(-7);

        setStats({ total, resolved, pending, avg });
        setChartData(chart);
      } catch {
        setStats({ total: 0, resolved: 0, pending: 0, avg: 0 });
        setChartData([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading your overview…" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Your feedback at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Your feedback" value={stats.total} accent="from-indigo-500 to-blue-500" />
        <StatCard title="Resolved" value={stats.resolved} accent="from-emerald-500 to-teal-500" />
        <StatCard title="Pending" value={stats.pending} accent="from-amber-500 to-orange-500" />
        <StatCard title="Avg. rating" value={stats.avg} accent="from-fuchsia-500 to-pink-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Activity (last entries)</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid rgba(148,163,184,0.3)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="font-display text-lg font-semibold">Quick actions</h2>
          <ul className="mt-4 space-y-3">
            <motion.li whileHover={{ x: 4 }}>
              <Link
                to="/feedback/new"
                className="block rounded-xl bg-indigo-600 px-4 py-3 text-center font-medium text-white hover:bg-indigo-500"
              >
                New feedback
              </Link>
            </motion.li>
            <motion.li whileHover={{ x: 4 }}>
              <Link
                to="/feedback/mine"
                className="block rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-center font-medium dark:border-slate-600 dark:bg-slate-800/70"
              >
                View my list
              </Link>
            </motion.li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
