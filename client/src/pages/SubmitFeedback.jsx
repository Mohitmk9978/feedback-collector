import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import GlassCard from '../components/GlassCard.jsx';
import { CATEGORIES, PRIORITIES } from '../utils/constants.js';
import { createFeedback } from '../services/api.js';

export default function SubmitFeedback() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  function onFileChange(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (preview) URL.revokeObjectURL(preview);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('category', category);
      fd.append('priority', priority);
      fd.append('rating', String(rating));
      fd.append('message', message);
      if (file) fd.append('image', file);

      await createFeedback(fd);
      toast.success('Feedback submitted!');
      navigate('/feedback/mine');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Submit feedback</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          Share bugs, ideas, or ratings. Images are optional.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800/80"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800/80"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800/80"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Rating (1–5)</label>
              <input
                type="range"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="mt-2 w-full accent-indigo-600"
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">{rating} / 5</p>
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 dark:border-slate-600 dark:bg-slate-800/80"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Screenshot (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="mt-1 w-full text-sm"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-3 max-h-48 rounded-xl border border-white/40 object-contain dark:border-slate-600"
                />
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Submit'}
            </button>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}
