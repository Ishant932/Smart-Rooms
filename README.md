# SmartRoooms — Student Room Rental Platform

A full-stack, dynamic room rental website built for students in **Jaipur**. Zero brokerage, verified listings, and a modern animated UI inspired by [OLX](https://www.olx.in/en-in), [Airbnb](https://www.airbnb.co.in/), and [Room Rent Jaipur](https://roomrentjaipur.com/).

## Quick Start

```bash
# Install all dependencies
npm run install:all
npm install

# Run both frontend + backend
npm run dev
```

- **Website:** http://localhost:5173
- **Backend API:** http://localhost:5000

> Open **`http://localhost:5173`** in your browser (not the root `index.html` file directly).

---

## Open in Browser (no terminal commands)

You do **not** need to type commands in bash/terminal. Use one of these:

### Option 1 — Double-click (recommended)

1. Open the `SmartRoooms` folder in **File Explorer**
2. Double-click **`START WEBSITE.bat`**
3. Your browser opens automatically at **http://localhost:5173**
4. Keep the black window open while using the site (close it to stop)

Shortcut: double-click **`Open SmartRoooms.url`** after the site is already running.

### Option 2 — Production (single port)

Double-click **`START PRODUCTION.bat`** → opens **http://localhost:5000** (frontend + API together).

### Option 3 — From VS Code / Cursor terminal (optional)

```bash
npm run dev
```

The browser opens automatically when Vite starts.

---

## Admin Dashboard Access

Use these credentials to log in as platform admin:

| Field | Value |
|-------|-------|
| **Email** | `admin@smartroooms.in` |
| **Password** | `admin123` |

### How to open admin dashboard

1. Run `npm run dev`
2. Go to http://localhost:5173/login
3. Enter the admin email and password above
4. You will be redirected to **http://localhost:5173/dashboard/admin**

### Admin powers (full control)

| Section | What admin can do |
|---------|-------------------|
| **Overview** | Platform stats, recent users, quick actions |
| **Users & Listings** | View all users; expand owner to see & remove their listings |
| **Requirements** | View tenant post-requirements, mark matched/closed |
| **Bookings** | View & update all PG/Hostel booking statuses |
| **Complaints** | All tenant complaints appear here; update status & add notes |
| **Revenue** | View commission & rent processed |
| **Post Room** | Post listings on behalf of the platform |

Tenants and owners must **register via Sign Up** — their real data appears in the admin Users section.

---

## Features

- **Dynamic listings** — Browse PG, hostels, flats & shared rooms (Jaipur only)
- **Multi-step registration** — Phone, email, password, role, facilities, terms acceptance
- **Three dashboards** — Tenant, Owner, Admin
- **Wallet & points** — Referrals, games, rent discounts
- **Compare properties** — Up to 4 listings side by side
- **Post requirement** — Tenants post what they need
- **Zero brokerage** — Direct owner–tenant contact

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS 4, Framer Motion, React Router |
| Backend | Node.js, Express, JWT auth, JSON file storage |

## Project Structure

```
SmartRoooms/
├── backend/
│   ├── data/         # users, rooms, bookings, wallets (JSON)
│   ├── lib/auth.js   # Register, login, wallets
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/dashboard/admin/   # Admin panel
│       └── ...
└── package.json
```

## API (selected)

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/admin/dashboard` | Admin |
| GET | `/api/admin/users` | Admin |
| PATCH | `/api/admin/users/:id` | Admin |
| GET/PATCH/DELETE | `/api/admin/rooms` | Admin |
| GET | `/api/requirements` | Admin |

---

© 2026 SmartRoooms · Zero Brokerage Policy
