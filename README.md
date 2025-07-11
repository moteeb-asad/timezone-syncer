# Timezone Syncer

A lightweight, modern web app to manage and compare multiple timezones for remote teams and global collaboration.

## Features

- Add, remove, and compare up to 3 timezones for free
- Upgrade to Premium for unlimited timezones
- Working hours highlighting (green/orange/red)
- Responsive, beautiful UI (Tailwind CSS)
- Firebase authentication (for premium features)
- Built with React + Vite + TypeScript

## Tech Stack

- **React** (with hooks)
- **TypeScript**
- **Vite** (blazing fast dev/build)
- **Tailwind CSS** (utility-first styling)
- **Firebase** (authentication)
- **React Router** (routing)

## Getting Started

1. **Clone the repo:**

   ```bash
   git clone https://github.com/your-username/timezone-syncer.git
   cd timezone-syncer
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use).

4. **(Optional) Configure Firebase:**
   - Copy `.env.example` to `.env` and add your Firebase project keys for authentication features.

## Folder Structure

- `src/components/` — UI components (TimezoneManager, Layout, etc.)
- `src/pages/` — Page-level components (Login, Premium)
- `src/routes/` — Routing logic
- `src/styles/` — Tailwind and custom CSS
- `src/utils/` — Utility functions
- `src/types/` — TypeScript types

## License

MIT
