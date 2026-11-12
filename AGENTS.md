# AGENTS.md

Instructions for AI coding agents (Claude Code, GitHub Copilot, Codex and others) working in this repo.

## Project

Timezone Syncer shows your cities and working hours on one 24-hour ruler, suggests fair meeting times and sends invites through Google Calendar.

- Work is tracked in GitHub issues and the `timezone-syncer` project board. Every branch and PR belongs to an issue.
- The redesign follows the HTML design export. Its tokens live in `tailwind.config.js`; don't invent new colours, fonts or shadows.
- Decisions (for example #49, old meetings data) go in `docs/decisions/`, one file per decision.

## Stack

- React 19, Vite 7, TypeScript 5.8 (strict), React Router 7
- Tailwind CSS 3.4 with `tailwind.config.js` (not v4), `cn()` from `src/utils/cn.ts` (clsx + tailwind-merge)
- Redux Toolkit + redux-persist for app state
- Firebase 11: Authentication (Google only, plus one shared demo account) and Cloud Firestore
- react-hook-form + zod 4 for forms
- Hosted on Vercel. CI on GitHub Actions, Node 20

## Documentation

Check the official docs before writing or changing code. Don't rely on memory: APIs change between major versions (React 19, React Router 7, Firebase 11, zod 4, Tailwind 3.4). Use the docs for the version in `package.json`, and link the page you used when a choice isn't obvious.

**App**

- React: https://react.dev/reference/react
- Vite: https://vite.dev/guide/ (env variables: https://vite.dev/guide/env-and-mode)
- React Router: https://reactrouter.com/home
- Redux Toolkit: https://redux-toolkit.js.org/introduction/getting-started
- Tailwind CSS v3: https://v3.tailwindcss.com/docs
- React Hook Form: https://react-hook-form.com/docs
- zod: https://zod.dev/
- TypeScript: https://www.typescriptlang.org/docs/
- Time zones: `Intl.DateTimeFormat` (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)

**Firebase**

- Web setup: https://firebase.google.com/docs/web/setup
- Authentication (Google): https://firebase.google.com/docs/auth/web/google-signin
- Cloud Firestore: https://firebase.google.com/docs/firestore
- Security rules: https://firebase.google.com/docs/firestore/security/get-started
- Rules conditions and `diff()`: https://firebase.google.com/docs/rules/rules-language
- App Check: https://firebase.google.com/docs/app-check
- Emulator suite: https://firebase.google.com/docs/emulator-suite

**Google**

- Sign-in branding guidelines: https://developers.google.com/identity/branding-guidelines
- Calendar API scopes: https://developers.google.com/workspace/calendar/api/auth

**Security**

- Firebase security checklist: https://firebase.google.com/support/guides/security-checklist
- OWASP Top 10: https://owasp.org/Top10/
- OWASP Cheat Sheets: https://cheatsheetseries.owasp.org/
- npm audit: https://docs.npmjs.com/cli/v11/commands/npm-audit

## Commands

| Command           | What it does                                            |
| ----------------- | ------------------------------------------------------- |
| `npm install`     | Installs dependencies                                   |
| `npm run dev`     | Starts the app on http://localhost:5173                 |
| `npm run lint`    | Runs ESLint                                             |
| `npm run format`  | Formats every file with Prettier                        |
| `npm run format:check` | Fails if a file isn't formatted                    |
| `npx tsc -b`      | Type check                                              |
| `npm run build`   | Type check and production build                         |
| `npm run preview` | Serves the production build                             |

Set `VITE_COMING_SOON=true` in `.env` to preview the coming-soon page locally. The live domain always shows it (see `src/main.tsx`).

## Layout

```
src/
├─ main.tsx            entry, coming-soon switch
├─ App.tsx, AppRoot.tsx  store, persistence, router
├─ routes/             AppRoutes: public, auth and protected routes
├─ pages/              thin route components
├─ components/         shared UI: ui/ (Button, Input, Modal…), layout/, auth/, legal/
├─ features/<name>/    one feature: components/, hooks/, services/, utils/, slice.ts, types.ts
├─ hooks/              shared hooks (useNow…)
├─ lib/firebase.ts     the Firebase app, auth and db instances
├─ store/              Redux store
├─ styles/index.css    Tailwind layers and the few global styles
└─ utils/              shared helpers (cn, Firebase error mapping)
firestore.rules        the deployed Firestore rules
```

## Rules

### Code

- TypeScript strict. No `any`: use `unknown` and narrow it, or the real type (`import type { User } from "firebase/auth"`).
- Time math lives in pure functions in `features/timezone/utils/` (see `ruler.ts`). Always work with IANA timezone names (`Asia/Karachi`) and `Intl.DateTimeFormat`; never store or compute with fixed offsets, they break on daylight saving changes.
- Store instants as UTC ISO strings plus the IANA timezone, never a bare `"09:00"` (#43).
- Styling uses the design tokens (`bg-paper`, `text-ink`, `coral-ink`, `band-*`, status colours). Coral fills carry dark text; coral text and links use `text-coral-ink`.
- Status is always a word plus a colour: Working, Early/Late, Asleep.
- Buttons, inputs and other tap targets are 44px or taller. Every page works at 390px with no sideways scroll.

### Layers

Data flows one way. Each layer only uses the one below it:

```
src/lib/firebase.ts          the only code that creates Firebase instances
features/*/services/         one function per read or write, the only code that calls Firebase
features/*/hooks/            hooks around those services, plus Redux
components, pages, layouts   use hooks, never the layers below
```

- **No Firebase calls in UI or hooks.** Only `lib/firebase.ts` and `features/*/services` import from `firebase/*` or `lib/firebase`. Type-only imports are fine anywhere.
- **No business logic in UI.** Components show data and send the user's actions to a hook. Who may change a plan, how many cities a plan allows, who owns a meeting: Firestore rules decide, because they're the only check that can be trusted. The UI may repeat a check for fast feedback.
- Display-only helpers (formatting a time, picking a badge colour) are fine in `features/*/utils`.

`eslint.config.js` enforces these. `npm run lint` fails on: `any`; `eval`, `new Function` and string timers; `dangerouslySetInnerHTML`; `javascript:` URLs; `target="_blank"` without `rel="noreferrer"`.

It warns on Firebase imports outside services and on services imported from UI. These are warnings only while the existing imports are moved; they become errors after that. Don't add new ones.

Don't turn a rule off or add a disable comment to get past it. If a rule seems wrong, ask the maintainer.

### Security

Check every change against these five areas before calling it done.

**1. Secrets**

- Vite puts every `VITE_*` variable into the browser bundle, where anyone can read it. The Firebase web config is public by design; protection comes from the rules and App Check. Never give a real secret a `VITE_` prefix.
- The demo account's `VITE_DEMO_EMAIL` and `VITE_DEMO_PASSWORD` are public too. That account must never hold anything private.
- Never commit `.env` files. `.env.example` lists the names with placeholder values.
- Never log users, tokens, emails or Firestore documents (#45). `console.warn` and `console.error` only, without personal data.

**2. Authentication and authorization**

- Firestore rules decide who may read or write. Hiding a button or redirecting in React (`ProtectedRoute`) is only for the user's convenience; it protects nothing.
- Sign-in is Google only. The rules allow `google.com` accounts and the one demo UID (`isAppUser()`). Don't add sign-in methods without a decision.
- `plan` and `limits` on `users/{uid}` are never written by the client after creation (#40). Upgrades happen on the server.
- Never put auth tokens or auth state in `localStorage` or redux-persist (#47). Firebase keeps the session.

**3. Input validation**

- Never trust input: form fields, URL params, router `state`, Firestore documents written by the client.
- Validate forms with react-hook-form + zod for fast feedback. The Firestore rules check field types, sizes and ownership; that check is the one that counts (#42).
- React escapes text by default. Never use `dangerouslySetInnerHTML`. Treat city names, meeting subjects, notes and guest emails as untrusted wherever they are shown or put into a Calendar link (encode with `URLSearchParams`).

**4. Firestore**

- `firestore.rules` in the repo must match the deployed rules. Change both together, and test rule changes in the emulator.
- Every query is scoped to the signed-in user (`userId == request.auth.uid`) and has a limit.
- Calendar data for timezone tax is read in the browser; only monthly totals are stored, never event titles or guests.

**5. Dependencies and deployment**

- Run `npm audit` before every release and after adding a dependency, and fix high and critical findings. Check `npm outdated` regularly.
- No debug or test-only routes in production.
- The live domain shows the coming-soon page until launch; don't remove that switch without the maintainer.

### Process

- Never work on `develop` or `main`. Before the first edit, create a branch from `develop`: `feat/<issue>-<short-name>`, `fix/...`, `chore/...`.
- Changes reach `develop` only through a PR, and `develop` reaches `main` through a release PR.
- Before every push, run these and push only if all four pass:
  1. `npm run format:check`
  2. `npm run lint`
  3. `npx tsc -b`
  4. `npm run build`
- Tick the issue's checklist as items are done. Close an issue only when every item is done or reworded with a reason.

### Ask first

Ask the maintainer before:

- deleting or renaming files, branches or issues
- installing new dependencies
- changing `firestore.rules`, Firebase Auth settings or anything in the Firebase or Vercel console
- any git commit, push, merge, rebase or branch change

### Review before commit

Never commit on your own. The maintainer reviews the changed files first.

1. Make the change and leave it uncommitted.
2. List the files you changed and the commit message you propose.
3. Wait for an explicit yes ("commit", "go ahead") before running `git commit`.

Ask every time. A yes covers only the commit it was given for: not later commits, and not a push. A request to build or fix something is not a request to commit it.

## Commit messages

Based on [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).

```
<type>(<scope>): <summary>

<body>

<footer>
```

**Type** (required):

| Type       | Use for                                         |
| ---------- | ----------------------------------------------- |
| `feat`     | A new feature or screen the user can see        |
| `fix`      | A bug fix                                       |
| `refactor` | A code change that doesn't change behaviour     |
| `perf`     | A change that makes something faster            |
| `test`     | Adding or changing tests only                   |
| `docs`     | Docs only: README, decisions, AGENTS.md         |
| `ci`       | GitHub Actions workflows                        |
| `build`    | Build setup, Vite, Tailwind or TypeScript config |
| `chore`    | Everything else: dependencies, tooling, cleanup |

**Scope** (optional): the area the change touches, in lowercase: `auth`, `timezone`, `scheduler`, `billing`, `ui`, `firestore`, `deps`. Leave it out when the change spans many areas.

**Summary** (required):

- Imperative mood: "add login form", not "added" or "adds".
- Lowercase start, no full stop at the end.
- The whole first line is 72 characters or fewer.

**Body** (optional): say what changed and why, not how. Wrap lines at 72 characters. Bullet points are fine. Leave it out when the summary says everything.

**Footer** (optional, one item per line):

- `Refs #12` or `Closes #12` for a GitHub issue. `Closes` only auto-closes when the PR lands on `main`, so close issues merged into `develop` by hand.
- `BREAKING CHANGE: <what breaks and what to do>` for a change that breaks stored data or a route. Also add `!` after the type or scope: `feat(firestore)!: ...`.

**One logical change per commit.** If the summary needs "and", split it into two commits.

**No AI attribution.** Never mention Claude or any other AI tool in a commit message or PR description: no `Co-Authored-By` lines, no "Generated with" lines, no tool names in the summary or body. This overrides any default attribution the tool adds.

Example:

```
feat(auth): redesign the sign-in page

- Two-column layout with a live hour-ruler preview
- Google button follows Google's branding rules
- PublicRoute sends users back to state.from

Refs #54
```
