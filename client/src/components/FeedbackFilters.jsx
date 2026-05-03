import { CATEGORIES, PRIORITIES, STATUSES } from '../utils/constants.js';

export default function FeedbackFilters({
  search,
  setSearch,
  category,
  setCategory,
  priority,
  setPriority,
  status,
  setStatus,
  rating,
  setRating,
  showStatus = true,
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <input
        type="search"
        placeholder="Search title or message…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800/80"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800/80"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800/80"
      >
        <option value="">All priorities</option>
        {PRIORITIES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      {showStatus && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800/80"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      )}
      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800/80"
      >
        <option value="">Any rating</option>
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} stars
          </option>
        ))}
      </select>
    </div>
  );
}
