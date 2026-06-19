import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;
let auth;
let db;
let initialized = false;

export const initializeFirebase = () => {
  if (typeof window === 'undefined') {
    console.warn('[Firebase] Skipping initialization on server-side');
    return { app: null, auth: null, db: null };
  }

  if (initialized) {
    return { app, auth, db };
  }

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    initialized = true;
    console.log('[Firebase] Initialized successfully');
    return { app, auth, db };
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
    throw error;
  }
};

export const getSafeAuth = () => {
  if (typeof window === 'undefined') {
    console.warn('[Firebase] getSafeAuth called on server-side');
    return null;
  }

  if (!initialized) {
    initializeFirebase();
  }

  return auth || null;
};

export const getSafeFirestore = () => {
  if (typeof window === 'undefined' || !initialized) {
    initializeFirebase();
  }
  return db;
};

// Export 'auth' directly for backward compatibility with Profile.tsx and other files
export { auth as defaultAuth };
export { auth };

export { app, db };
