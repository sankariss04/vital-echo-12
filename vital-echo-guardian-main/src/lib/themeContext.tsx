import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Theme = 'pastel' | 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const THEME_KEY = 'vitalecho_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to get theme from localStorage, default to 'pastel'
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'pastel' || saved === 'dark' || saved === 'light') {
      return saved;
    }
    return 'pastel';
  });

  // Apply theme class to the document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('pastel', 'dark', 'light');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Also handle Tailwind's dark mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
