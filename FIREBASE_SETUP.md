# Firebase Setup - Meeting Tracking

## Issue: "Failed to save meeting" Error

This error occurs because Firestore security rules need to be configured to allow authenticated users to write meeting data.

## Solution: Update Firestore Security Rules

### Step 1: Access Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** (left sidebar)
4. Click on the **Rules** tab

### Step 2: Update Security Rules

Replace the existing rules with the content from `firestore.rules` in this project root, or copy this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Meetings collection - authenticated users can manage their own meetings
    match /meetings/{meetingId} {
      // Allow read if user is authenticated and owns the meeting
      allow read: if request.auth != null &&
                   resource.data.userId == request.auth.uid;

      // Allow create if user is authenticated and sets their own userId
      allow create: if request.auth != null &&
                     request.resource.data.userId == request.auth.uid;

      // Allow update if user is authenticated and owns the meeting
      allow update: if request.auth != null &&
                     resource.data.userId == request.auth.uid;

      // Allow delete if user is authenticated and owns the meeting
      allow delete: if request.auth != null &&
                     resource.data.userId == request.auth.uid;
    }
  }
}
```

### Step 3: Publish Rules

1. Click the **Publish** button in the Firebase Console
2. Wait for the rules to deploy (usually instant)

### Step 4: Test

1. Reload your application
2. Try creating a meeting invitation again
3. The meeting should now save successfully

## What These Rules Do

- **Authentication Required**: Only logged-in users can access meetings
- **User Isolation**: Users can only read/write their own meetings
- **Security**: Prevents unauthorized access to other users' data

## Troubleshooting

### Still getting errors?

1. **Check Authentication**: Make sure you're logged in
2. **Check Console**: Open browser DevTools → Console tab for detailed error
3. **Verify Rules**: Go back to Firebase Console and verify rules are published
4. **Check Firebase Config**: Ensure `.env` file has correct Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

### Testing Rules Locally

If you want to use the Firebase CLI to deploy rules:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

## Alternative: Temporary Open Rules (Development Only)

⚠️ **WARNING**: Only use during development, never in production!

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This allows any authenticated user to read/write any document. Good for testing, but not secure for production.

## Next Steps

After fixing the rules, your meeting tracking feature will:

- ✅ Save meetings to Firestore when calendar opens
- ✅ Show toast notification asking if user sent the invite
- ✅ Display meeting history in Account Settings
- ✅ Sync across all user's devices

---

**Need Help?** Check the [Firebase Documentation](https://firebase.google.com/docs/firestore/security/get-started) for more details on security rules.
