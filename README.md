# Timezone Syncer

## Overview of project + How it solves a problem

Timezone Syncer is a web app for comparing multiple time zones in real time. It reduces scheduling friction for distributed teams by providing a single reference time and clear working-hours indicators across locations. This removes manual time conversion and minimizes coordination errors.

## Features

- Live time comparison across multiple time zones
- Base time reference for consistent scheduling
- Working-hours status (working, early, late)
- Free and premium plan limits
- Authentication with Google and email/password
- Responsive layout for desktop and mobile

## Tech Stack

- React 19, TypeScript
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Firebase Auth
- @vvo/tzdb

## Environment Variables

Create a .env.local file in the project root:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Authentication & Access Control

- Public pages: Home, About, Premium, Login, Signup
- Protected pages: Dashboard, Account
- Google and email/password authentication
- Free plan: up to 3 time zones
- Premium plan: higher limits

## Getting Started

Prerequisites:

- Node.js 20.19+
- A Firebase project with Auth enabled

Install and run:

```
npm install
npm run dev
```

Build for production:

```
npm run build
npm run preview
```

## Roadmap

- Meeting time suggestions based on overlap
- Custom working hours per user
- Calendar export
- Team collections and shared views
- Dark mode
