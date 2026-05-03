import GlassCard from '../components/GlassCard.jsx';

export default function About() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-3xl font-bold">About</h1>
      <GlassCard>
        <p className="text-slate-700 dark:text-slate-300">
          <strong>Feedback Collector</strong> is a full-stack demo built with MongoDB, Express,
          React (Vite), and Node.js. It showcases JWT authentication, role-based routes, REST APIs,
          file uploads, and a responsive glass-style UI with dark mode.
        </p>
        <ul className="mt-4 list-inside list-disc space-y-2 text-slate-600 dark:text-slate-400">
          <li>Users submit feedback with optional screenshots.</li>
          <li>Admins filter, update status, and view analytics.</li>
          <li>Extra touches: pagination, search, charts, and PDF export.</li>
        </ul>
      </GlassCard>
    </div>
  );
}
