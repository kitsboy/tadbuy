import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSafeAuth, getFirebaseAuth } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error?: string;
  signInEmail: (email: string, password: string) => Promise<User>;
  signUpEmail: (email: string, password: string) => Promise<User>;
  signInGoogle: () => Promise<User>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: undefined,
  signInEmail: async () => { throw new Error('AuthProvider not mounted'); },
  signUpEmail: async () => { throw new Error('AuthProvider not mounted'); },
  signInGoogle: async () => { throw new Error('AuthProvider not mounted'); },
  signOut: async () => { throw new Error('AuthProvider not mounted'); },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const initializeAuth = async () => {
      try {
        const safeAuth = getSafeAuth();
        if (!safeAuth) {
          console.warn('[AuthProvider] Safe auth returned null - skipping listener');
          setLoading(false);
          return;
        }

        unsubscribe = onAuthStateChanged(
          safeAuth,
          (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            setError(null);
          },
          (err: any) => {
            console.error('[AuthProvider] onAuthStateChanged error:', err);
            setError(err?.message || 'Auth error occurred');
            setLoading(false);
          }
        );
      } catch (err: any) {
        console.error('[AuthProvider] Critical auth initialization error:', err);
        setError(err?.message || 'Failed to initialize auth');
        setLoading(false);
      }
    };

    // Run initialization in next tick to avoid any SSR race conditions
    const timeoutId = setTimeout(initializeAuth, 0);

    return () => {
      clearTimeout(timeoutId);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signInEmail = async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const signUpEmail = async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const signInGoogle = async () => {
    const auth = getFirebaseAuth();
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    return cred.user;
  };

  const signOut = async () => {
    const auth = getFirebaseAuth();
    await fbSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error: error || undefined,
      signInEmail, signUpEmail, signInGoogle, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
