import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Real Firebase Web API keys always start with "AIza". If the key is missing
// or a placeholder, the site is not configured for auth — skip init instead of
// throwing auth/invalid-api-key on every load (console errors + broken pages).
const hasFirebaseConfig = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_API_KEY.startsWith('AIza') &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

export let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Firestore | null = null;
let initialized = false;
let initialization: Promise<void> | null = null;

export const initializeFirebase = async () => {
  if (typeof window === 'undefined') {
    return { app: null, auth: null, db: null };
  }

  if (initialized) {
    return { app, auth, db };
  }

  if (!hasFirebaseConfig) {
    initialized = true;
    return { app: null, auth: null, db: null };
  }

  if (!initialization) {
    initialization = (async () => {
      try {
        const [{ initializeApp }, { getAuth }, { getFirestore }] = await Promise.all([
          import('firebase/app'),
          import('firebase/auth'),
          import('firebase/firestore'),
        ]);
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        initialized = true;
        console.log('[Firebase] Initialized successfully');
      } catch (error) {
        initialization = null;
        console.error('[Firebase] Initialization error:', error);
        throw error;
      }
    })();
  }

  await initialization;
  return { app, auth, db };
};

export const getSafeAuth = async (): Promise<Auth | null> => {
  if (typeof window === 'undefined') return null;
  if (!initialized) await initializeFirebase();
  return auth;
};

export const getFirebaseAuth = async (): Promise<Auth> => {
  const safeAuth = await getSafeAuth();
  if (!safeAuth) throw new Error('Firebase not configured');
  return safeAuth;
};

export const getSafeFirestore = async (): Promise<Firestore | null> => {
  if (typeof window === 'undefined') return null;
  if (!initialized) await initializeFirebase();
  return db;
};

// Keep the legacy names available while the Firebase SDK itself loads on demand.
export { auth as defaultAuth };
