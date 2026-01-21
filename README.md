# Timezone Syncer

> A modern web app for coordinating meetings and collaboration across global time zones. Built for remote teams, freelancers, and anyone working with international clients.

---

## Overview

Timezone Syncer simplifies global time coordination by providing real-time timezone comparisons with working hours indicators. Users can track multiple timezones simultaneously, making it easy to find optimal meeting times and avoid scheduling conflicts across regions.

**Core Value:** Eliminates timezone confusion and reduces back-and-forth scheduling for distributed teams.

---

## Features

### 🌍 **Core Functionality**

- **Live Timezone Tracking** - Real-time display of current time in multiple timezones
- **Working Hours Status** - Visual indicators (working/early/late) for each timezone
- **Base Time Reference** - Set a reference time to compare across all tracked timezones
- **Persistent Settings** - Timezone selections saved locally for returning users

### 🔐 **Authentication & Plans**

- **Firebase Authentication** - Secure Google OAuth and email/password login
- **Free Tier** - Track up to 3 timezones
- **Premium Tier** - Unlimited timezone tracking (20+)
- **Protected Routes** - Dashboard and account management for authenticated users

### 🎨 **User Experience**

- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **About Page** - Clear value proposition and use cases
- **Premium Upsell** - Contextual upgrade prompts and pricing information
- **Auto-logout Redirect** - Returns users to their original page after login

---

## Tech Stack

**Frontend Framework**

- React 19 + TypeScript
- Vite 7 (build tool)
- React Router v7 (routing with guards)

**State Management**

- Redux Toolkit
- Redux Persist (localStorage sync)

**Styling**

- Tailwind CSS 3
- Custom component library

**Authentication**

- Firebase Auth (Google + Email)

**Utilities**

- @vvo/tzdb (timezone data)
- date-fns compatible time calculations

---

## Project Structure

```
src/
├── components/
│   ├── auth/           # ProtectedRoute, PublicRoute, Account
│   ├── layout/         # Header, Footer, Navigation, MobileMenu
│   └── timezone/       # TimezoneManager, TimezoneCard, CurrentTime
├── hooks/
│   ├── auth/           # useAuth (Firebase integration)
│   ├── layout/         # useNavigation
│   └── timezone/       # useTimezoneManager
├── pages/              # About, Login, Premium
├── routes/             # AppRoutes (route configuration)
├── slices/             # Redux slices (timezone, user)
├── store/              # Redux store configuration
├── types/              # TypeScript interfaces
├── utils/              # Timezone calculations, error handlers
└── styles/             # Global CSS, Tailwind config
```

**Key Architectural Decisions:**

- **Route Guards:** `ProtectedRoute` and `PublicRoute` wrappers for access control
- **Custom Hooks:** Business logic extracted from components for reusability
- **Domain-Based Types:** Separate type files by feature (auth, timezone, layout)
- **Component Memoization:** React.memo for performance-critical components

---

## Getting Started

### Prerequisites

- Node.js 20.19+ (for Vite 7 compatibility)
- Firebase project with Auth enabled

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/moteeb-asad/timezone-syncer.git
   cd timezone-syncer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create `.env.local` in the root directory:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

   App runs at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   npm run preview  # Preview production build
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

---

## Authentication & Plans

### User Roles

| Plan    | Max Timezones | Authentication |
| ------- | ------------- | -------------- |
| Free    | 3             | Optional       |
| Premium | 20            | Required       |

### Route Protection

- **Public Routes:** `/`, `/about`, `/premium`, `/login`
- **Public-Only Routes:** `/login` (redirects authenticated users)
- **Protected Routes:** `/dashboard`, `/account` (requires authentication)

### Firebase Setup

The app uses Firebase Authentication with:

- Google OAuth provider
- Email/password authentication
- Persistent sessions via Redux Persist
- Automatic token refresh

---

## Code Quality & Practices

### Best Practices Implemented

✅ **TypeScript Strict Mode** - Full type safety across the app  
✅ **Component Memoization** - React.memo for Header, Footer, Navigation  
✅ **Custom Hooks** - Separated business logic from UI components  
✅ **Route Guards** - Centralized authentication checks  
✅ **Error Boundaries** - Graceful error handling  
✅ **Responsive Design** - Mobile-first approach  
✅ **Performance Optimization** - Lazy loading, code splitting  
✅ **Clean Architecture** - Domain-driven folder structure

### Code Organization

- **Separation of Concerns:** UI components separate from business logic
- **Single Responsibility:** Each component/hook has one clear purpose
- **DRY Principle:** Shared utilities for timezone calculations
- **Type Safety:** Comprehensive TypeScript interfaces
- **Consistent Naming:** Clear, descriptive names following React conventions

---

## Project Status

**Current Version:** 1.0.0 (Development)

### ✅ Completed Features

- Live timezone tracking with auto-refresh
- Firebase authentication integration
- Free/Premium tier system
- Responsive layout with mobile navigation
- About and Premium marketing pages
- Route protection and redirects
- Redux state persistence

### 🚧 Future Enhancements

- [ ] Meeting scheduler with timezone overlap visualization
- [ ] Team collaboration features (shared timezone groups)
- [ ] Custom working hours configuration
- [ ] Export timezone schedules
- [ ] Dark mode support
- [ ] PWA support with offline mode

### 📝 Known Issues

None currently tracked.

---

## License

This project is licensed under the MIT License.

---

## Author

**Moteeb Asad**  
GitHub: [@moteeb-asad](https://github.com/moteeb-asad)

---

_Built with ❤️ for remote teams everywhere_
