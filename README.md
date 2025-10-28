## Firebase Emulator Suite

The project is configured to run the Functions + Hosting emulators together with a single command.

### Prerequisites

- Install the Firebase CLI and sign in (`firebase login`).
- Install project dependencies (`npm install`).

### Start the emulators

```bash
npm run emulators
```

This command:

- Boots the Functions emulator on `localhost:5001`.
- Boots the Hosting emulator on `localhost:5000`.
- Boots the Emulator UI on `localhost:4000`.
- Persists emulator state inside `firebase-emulator-data/` so it survives restarts.

When the emulators are running, set `REACT_APP_USE_FIREBASE_EMULATORS=true` in `.env.local` (or export it in your shell) before starting the React app so the client SDK talks to the local Functions emulator.

### Stop the emulators

Press `Ctrl+C` in the terminal that is running the suite. An export will be written automatically and the next launch will reuse the cached state.

### Deploying for real

- Functions only: `firebase deploy --only functions`
- Hosting only: `firebase deploy --only hosting`
- Everything: `firebase deploy`

Remember to switch to the correct Firebase project alias (`firebase use <alias>`) before deploying.
