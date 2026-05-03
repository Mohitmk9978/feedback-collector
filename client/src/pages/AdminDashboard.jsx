import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import GlassCard from '../components/GlassCard.jsx';
import StatCard from '../components/StatCard.jsx';
import FeedbackFilters from '../components/FeedbackFilters.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import {
  fetchAdminStats,
  fetchFeedbackList,
  updateAdminStatus,
  deleteFeedback,
} from '../services/api.js';
import { labelFor, CATEGORIES, PRIORITIES, STATUSES } from '../utils/constants.js';
import { exportFeedbackPdf } from '../utils/exportPdf.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [chartBars, setChartBars] = useState([]);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const [rating, setRating] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const loadStats = useCallback(async () => {
    try {
      const s = await fetchAdminStats();
      setStats(s);
    } catch {
      toast.error('Could not load stats');
    }
  }, []);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        search: debouncedSearch || undefined,
        category: category || undefined,
        priority: priority || undefined,
        status: status || undefined,
        rating: rating || undefined,
      };
      const res = await fetchFeedbackList(params);
      const rows = res.data || [];
      setItems(rows);
      setPagination(res.pagination || { page: 1, pages: 1 });

      const counts = {};
      rows.forEach((f) => {
        counts[f.category] = (counts[f.category] || 0) + 1;
      });
      setChartBars(
        Object.entries(counts).map(([key, count]) => ({
          name: labelFor(CATEGORIES, key),
          count,
        }))
      );
    } catch {
      toast.error('Could not load feedback');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, priority, status, rating]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadList();
  }, [loadList]);

  async function changeStatus(id, newStatus) {
    try {
      await updateAdminStatus(id, newStatus);
      toast.success('Status updated');
      loadList();
      loadStats();
    } catch {
      toast.error('Update failed');
    }
  }

  async function remove(id) {
    if (!confirm('Delete this feedback permanently?')) return;
    try {
      await deleteFeedback(id);
      toast.success('Removed');
      loadList();
      loadStats();
    } catch {
      toast.error('Delete failed');
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Admin dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Review all submissions, filter, and update workflow status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => exportFeedbackPdf(items, 'Admin feedback export')}
          className="rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium dark:border-slate-600 dark:bg-slate-800/80"
        >
          Export PDF (current page)
        </button>
      </div>

      {!stats ? (
        <LoadingSpinner label="Loading analytics…" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total feedback" value={stats.totalFeedback} />
          <StatCard
            title="Resolved"
            value={stats.resolvedIssues}
            accent="from-emerald-500 to-teal-500"
          />
          <StatCard
            title="Pending"
            value={stats.pendingReports}
            accent="from-amber-500 to-orange-500"
          />
          <StatCard
            title="Avg. rating"
            value={stats.averageRating}
            accent="from-fuchsia-500 to-pink-500"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Category mix (current page)</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartBars}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <h2 className="font-display text-lg font-semibold">Tips</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>Use filters to triage by priority and status.</li>
            <li>Changing status can email the author if SMTP is configured.</li>
            <li>Export PDF includes the visible table page.</li>
          </ul>
        </GlassCard>
      </div>

      <GlassCard>
        <FeedbackFilters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          priority={priority}
          setPriority={setPriority}
          status={status}
          setStatus={setStatus}
          rating={rating}
          setRating={setRating}
        />
      </GlassCard>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/40">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 dark:border-slate-700">
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">User</th>
                <th className="px-4 py-3 font-semibold">Meta</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr
                  key={f._id}
                  className="border-b border-slate-100/80 dark:border-slate-800"
                >
                  <td className="max-w-xs px-4 py-3 align-top">
                    <div className="font-medium">{f.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-2">{f.message}</div>
                  </td>
                  <td className="px-4 py-3 align-top text-xs">
                    {f.createdBy?.name}
                    <br />
                    <span className="text-slate-500">{f.createdBy?.email}</span>
                  </td>
                  <td className="px-4 py-3 align-top text-xs">
                    {labelFor(CATEGORIES, f.category)} · {labelFor(PRIORITIES, f.priority)}
                    <br />⭐ {f.rating}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <select
                      value={f.status}
                      onChange={(e) => changeStatus(f._id, e.target.value)}
                      className="rounded-lg border border-slate-200 bg-white/90 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <button
                      type="button"
                      onClick={() => remove(f._id)}
                      className="text-xs text-red-600 hover:underline dark:text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>
          <span className="py-2 text-sm">
            Page {pagination.page} / {pagination.pages}
          </span>
          <button
            type="button"
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
