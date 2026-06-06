import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Robust initialization with guards
let app: any = null;
let auth: any = null;
let db: any = null;
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

// Safe auth getter with window check and error handling
export const getSafeAuth = () => {
  if (typeof window === 'undefined') {
    console.warn('[Firebase] getSafeAuth called on server-side');
    return null;
  }

  if (!initialized) {
    const result = initializeFirebase();
    if (!result.auth) {
      console.error('[Firebase] Failed to get auth instance');
      return null;
    }
  }

  if (!auth) {
    console.error('[Firebase] Auth instance is undefined');
    return null;
  }

  return auth;
};

// Get Firestore instance safely
export const getSafeFirestore = () => {
  if (typeof window === 'undefined' || !initialized) {
    initializeFirebase();
  }
  return db;
};

// Legacy exports for backward compatibility
export { app, auth as defaultAuth, db as defaultDb };

// Export types
export type { User };