import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard.jsx';
import FeedbackFilters from '../components/FeedbackFilters.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { fetchFeedbackList, deleteFeedback } from '../services/api.js';
import { labelFor, CATEGORIES, PRIORITIES, STATUSES } from '../utils/constants.js';
import { exportFeedbackPdf } from '../utils/exportPdf.js';
import { getUploadUrl } from '../utils/imageUrl.js';

export default function MyFeedback() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 8,
        search: debouncedSearch || undefined,
        category: category || undefined,
        priority: priority || undefined,
        status: status || undefined,
        rating: rating || undefined,
      };
      const res = await fetchFeedbackList(params);
      setItems(res.data || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch {
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, category, priority, status, rating]);

  useEffect(() => {
    load();
  }, [load]);

  async function onDelete(id) {
    if (!confirm('Delete this feedback?')) return;
    try {
      await deleteFeedback(id);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">My feedback</h1>
          <p className="text-slate-600 dark:text-slate-400">Search, filter, export, or manage entries.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => exportFeedbackPdf(items, 'My feedback')}
            className="rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium dark:border-slate-600 dark:bg-slate-800/80"
          >
            Export PDF
          </button>
          <Link
            to="/feedback/new"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            New
          </Link>
        </div>
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
      ) : items.length === 0 ? (
        <GlassCard>
          <p className="text-center text-slate-600 dark:text-slate-400">No feedback yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {items.map((f) => (
            <GlassCard key={f._id} className="!p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                <div>
                  <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {f.message}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-indigo-500/15 px-2 py-0.5">
                      {labelFor(CATEGORIES, f.category)}
                    </span>
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5">
                      {labelFor(PRIORITIES, f.priority)}
                    </span>
                    <span className="rounded-full bg-slate-500/15 px-2 py-0.5">
                      {labelFor(STATUSES, f.status)}
                    </span>
                    <span className="rounded-full bg-pink-500/15 px-2 py-0.5">
                      ⭐ {f.rating}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    to={`/feedback/edit/${f._id}`}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm dark:border-slate-600"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDelete(f._id)}
                    className="rounded-lg bg-red-500/10 px-3 py-1.5 text-sm text-red-700 dark:text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {f.image && (
                <img
                  src={getUploadUrl(f.image)}
                  alt=""
                  className="mt-3 max-h-40 rounded-lg border border-white/30 object-contain dark:border-slate-600"
                />
              )}
            </GlassCard>
          ))}
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
          <span className="py-2 text-sm text-slate-600 dark:text-slate-400">
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
