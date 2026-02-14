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
  accent: string;
  muted: string; // Added for gray "Saved" button
}

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const lightTheme: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  card: '#FFFFFF',
  text: '#000000',
  textSecondary: '#6C757D',
  primary: '#000000',
  primaryLight: '#343A40',
  success: '#000000',
  error: '#000000',
  errorLight: '#F8F9FA',
  border: '#DEE2E6',
  shadow: '#000000',
  inputBackground: '#F8F9FA',
  placeholder: '#ADB5BD',
  accent: '#495057',
  muted: '#868E96', // Gray for saved button
};

const darkTheme: ThemeColors = {
  background: '#000000',
  surface: '#1A1A1A',
  card: '#1A1A1A',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  primary: '#FFFFFF',
  primaryLight: '#E0E0E0',
  success: '#FFFFFF',
  error: '#FFFFFF',
  errorLight: '#2A2A2A',
  border: '#333333',
  shadow: '#000000',
  inputBackground: '#2A2A2A',
  placeholder: '#666666',
  accent: '#CCCCCC',
  muted: '#6C757D', // Gray for saved button
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