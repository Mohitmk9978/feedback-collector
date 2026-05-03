import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { CATEGORIES, PRIORITIES } from '../utils/constants.js';
import { fetchFeedbackById, updateFeedback } from '../services/api.js';
import { getUploadUrl } from '../utils/imageUrl.js';

export default function EditFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [priority, setPriority] = useState('medium');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const f = await fetchFeedbackById(id);
        if (cancelled) return;
        setTitle(f.title);
        setCategory(f.category);
        setPriority(f.priority);
        setRating(f.rating);
        setMessage(f.message);
        setExistingImage(f.image || '');
      } catch {
        toast.error('Could not load feedback');
        navigate('/feedback/mine');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  function onFileChange(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(existingImage || '');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      fd.append('category', category);
      fd.append('priority', priority);
      fd.append('rating', String(rating));
      fd.append('message', message);
      if (file) fd.append('image', file);

      await updateFeedback(id, fd);
      toast.success('Saved changes');
      navigate('/feedback/mine');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  const imageSrc = preview || getUploadUrl(existingImage);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-bold">Edit feedback</h1>
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
            <label className="text-sm font-medium">Rating</label>
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
            <label className="text-sm font-medium">Replace image (optional)</label>
            <input type="file" accept="image/*" onChange={onFileChange} className="mt-1 w-full text-sm" />
            {imageSrc && (
              <img
                src={imageSrc}
                alt=""
                className="mt-3 max-h-48 rounded-xl border object-contain dark:border-slate-600"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
