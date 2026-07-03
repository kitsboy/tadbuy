import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

type Theme = 'dark' | 'light';
type Contrast = 'normal' | 'high';

interface ThemeContextValue {
  theme: Theme;
  contrast: Contrast;
  setTheme: (t: Theme) => void;
  setContrast: (c: Contrast) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('tadbuy_theme', 'dark');
  const [contrast, setContrast] = useLocalStorage<Contrast>('tadbuy_contrast', 'normal');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-contrast', contrast);
  }, [theme, contrast]);

  return (
    <ThemeContext.Provider value={{
      theme, contrast, setTheme, setContrast,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}