# 0001: Keep a shared demo account, allowed by its UID

- Status: Accepted
- Date: 2026-11-13
- Issue: #41, PR #62

## Context

Sign-in is Google only, so bots can't sign up through the email/password endpoint (#41). Visitors without a Google account, or who don't want to sign in yet, still need a way to try the signed-in app.

The demo account's password was lost. The Firebase console can't set a password for an existing user, and a reset email can't be received because `demo@timezonesyncer.com` has no inbox.

## Decision

Keep one shared email/password demo account. The Email/Password provider stays on for it, and `firestore.rules` lets it in by UID next to Google accounts (`isAppUser()`). The demo user was deleted and recreated in the console with a new password; its new UID is `47ylB5KVmUVW3lxOnVzDdrCjouy2`.

The app signs in with `VITE_DEMO_EMAIL` and `VITE_DEMO_PASSWORD`. A demo user made in the console has no display name, so the app sets "Demo User" on its first sign-in.

## Why

- No server or service account key needed; the console and one rules deploy are enough.
- Any other email/password account still gets no data access, so the bot fix from #41 holds.
- The demo account had no data worth keeping.

## Alternatives considered

- Reset the password with the Admin SDK (`updateUser`), keeping the old UID: needs a service account key with full project access on a local machine, for a one-off change.
- Give the demo inbox a real mailbox and use the reset email: needs email hosting on the domain for one account.
- Drop the demo account: visitors without Google could no longer try the app.

## Consequences

- The demo password is in the browser bundle (`VITE_*`), so anyone can read it. The account must never hold private data, and the sign-in page and privacy policy say it is shared.
- If the demo user is recreated again, update the UID in `firestore.rules` and redeploy with `firebase deploy --only firestore:rules`, or the demo gets no data access.
- `VITE_DEMO_EMAIL` and `VITE_DEMO_PASSWORD` must be set locally and in Vercel; without them the "Try the demo" link is hidden.
