import React, { createContext, useContext, useState, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  success: string;
  error: string;
  errorLight: string;
  border: string;
  shadow: string;
  inputBackground: string;
  placeholder: string;
}

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const lightTheme: ThemeColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  primary: '#3B82F6',
  primaryLight: '#6366F1',
  success: '#10B981',
  error: '#DC2626',
  errorLight: '#FEE2E2',
  border: '#E5E7EB',
  shadow: '#000000',
  inputBackground: '#F5F7FA',
  placeholder: '#9CA3AF',
};

const darkTheme: ThemeColors = {
  background: '#0A0E27', // Deep navy
  surface: '#131842', // Navy blue
  card: '#1A1F4D', // Lighter navy
  text: '#FFFFFF',
  textSecondary: '#B4B8D4',
  primary: '#5B8DEF', // Bright blue
  primaryLight: '#7C3AED', // Purple accent
  success: '#34D399',
  error: '#F87171',
  errorLight: '#7F1D1D',
  border: '#2A2F5A',
  shadow: '#000000',
  inputBackground: '#1A1F4D',
  placeholder: '#6B7095',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};