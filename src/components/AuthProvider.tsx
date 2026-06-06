import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getSafeAuth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error?: string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: undefined,
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

  return (
    <AuthContext.Provider value={{ user, loading, error: error || undefined }}>
      {children}
    </AuthContext.Provider>
  );
};
