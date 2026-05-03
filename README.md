# Feedback Collector System

A production-style **MERN** app for collecting and managing feedback: **MongoDB**, **Express**, **React (Vite)**, **Node.js**. Users submit structured feedback (with optional screenshots); admins triage, filter, update status, and view analytics.

## Features

- **Auth**: Register/login, JWT, bcrypt password hashing, `user` / `admin` roles.
- **Users**: Submit feedback, edit/delete own items, search/filter, pagination, PDF export, image preview.
- **Admins**: Full list with filters, status workflow (`pending` → `in_review` → `resolved`), analytics cards, bar chart, delete any item, optional email on status change.
- **UI**: Glass-style panels, Framer Motion, React Hot Toast, dark/light mode, responsive layout with sidebar on desktop.

## Prerequisites

- **Node.js** 18+
- **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas))

## Quick start

### 1. Clone / open the project

```bash
cd "path/to/Feedback Collector"   # this repo root
```

### 2. Backend

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

- `MONGO_URI` — e.g. `mongodb://127.0.0.1:27017/feedback_collector`
- `JWT_SECRET` — long random string (required)
- Optional: `SMTP_*` for email when an admin changes feedback status

Install and run:

```bash
npm install
npm run dev
```

API runs at **http://localhost:5000** (default).

### 3. Seed demo data (optional)

From `server/`:

```bash
npm run seed
```

Demo accounts:

| Role  | Email           | Password   |
|-------|-----------------|------------|
| Admin | admin@demo.com  | Admin123!  |
| User  | user@demo.com   | User123!   |

### 4. Frontend

```bash
cd client
npm install
npm run dev
```

App opens at **http://localhost:5173**. Vite proxies `/api` and `/uploads` to the backend in development.

Optional: create `client/.env` with `VITE_API_URL=http://localhost:5000` if you prefer explicit API base URL.

## API summary

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Register |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/feedback` | User | Create (multipart: `image` optional) |
| GET | `/api/feedback` | User | List (own items for users; all for admin). Query: `page`, `limit`, `search`, `category`, `priority`, `status`, `rating` |
| GET | `/api/feedback/:id` | User | Get one |
| PUT | `/api/feedback/:id` | User | Update own |
| DELETE | `/api/feedback/:id` | User/Admin | Owner or admin |
| GET | `/api/admin/stats` | Admin | Analytics counts |
| PUT | `/api/admin/status/:id` | Admin | Update status (optional email) |

## Production build

### Frontend

```bash
cd client
npm run build
```

Serve the `client/dist` folder with any static host (Nginx, Netlify, Vercel, etc.). Set `VITE_API_URL` to your public API base (e.g. `https://api.yourdomain.com`, no trailing slash) when building so API calls and uploaded image URLs resolve correctly.

### Backend

- Set `NODE_ENV=production`, `CLIENT_URL` to your frontend origin for CORS.
- Run `node server.js` (or use PM2/systemd).
- Ensure `uploads/` is writable for screenshots.

### Example: single VPS

1. Build client with `VITE_API_URL=https://api.yourdomain.com`.
2. Host API on `https://api.yourdomain.com` with reverse proxy to Node.
3. Host static `dist` on `https://yourdomain.com`.

## Project layout

```
server/                 # Express API
  config/ models/ routes/ controllers/ middleware/
  uploads/              # Local image storage (gitignored except .gitkeep)
  scripts/seed.js

client/                 # Vite + React
  src/
    components/ layouts/ pages/ routes/
    context/ services/ utils/
```

## Tech stack

**Server:** Express, Mongoose, JWT, bcryptjs, multer, cors, dotenv, nodemailer (optional).

**Client:** React 18, Vite, Tailwind CSS, React Router, Axios, react-hot-toast, Framer Motion, Recharts, jsPDF.

## License

MIT — use freely for learning and portfolios.
