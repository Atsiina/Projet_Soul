import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ColorContext = createContext();

const defaultColors = {
  main: '#00C1A0',
  light: '#00D9B5',
  dark: '#00A88B',
  gradient: 'linear-gradient(135deg, #00D9B5, #00C1A0, #00A88B)'
};

const gameColors = {
  'chi-soul-mi': {
    main: '#8F0016',
    light: '#B30025',
    dark: '#6B0011',
    gradient: 'linear-gradient(135deg, #B30025, #8F0016, #6B0011)'
  },
  'echo-de-lame': {
    main: '#A349A4',
    light: '#B66DB7',
    dark: '#822683',
    gradient: 'linear-gradient(135deg, #B66DB7, #A349A4, #822683)'
  },
  'labyrinthe': {
    main: '#00C1A0',
    light: '#00D9B5',
    dark: '#00A88B',
    gradient: 'linear-gradient(135deg, #00D9B5, #00C1A0, #00A88B)'
  },
  'quete-des-ames': {
    main: '#00A2E8',
    light: '#33B5ED',
    dark: '#0081BA',
    gradient: 'linear-gradient(135deg, #33B5ED, #00A2E8, #0081BA)'
  },
  'reliques-perdues': {
    main: '#C9880C',
    light: '#E09D0E',
    dark: '#A16C0A',
    gradient: 'linear-gradient(135deg, #E09D0E, #C9880C, #A16C0A)'
  }
};

const mainPages = ['/', '/games', '/mini-games', '/thanks'];

export function ColorProvider({ children }) {
  const [themeColors, setThemeColors] = useState(defaultColors);
  const location = useLocation();

  // Effet pour mettre à jour les couleurs en fonction de l'URL
  useEffect(() => {
    const path = location.pathname;
    if (mainPages.includes(path)) {
      setThemeColors(defaultColors);
    } else {
      const gamePath = path.split('/').pop();
      const gameTheme = gameColors[gamePath];
      if (gameTheme) {
        setThemeColors(gameTheme);
      }
    }
  }, [location]);

  const value = {
    themeColors,
    setThemeColors: (colors) => {
      setThemeColors(colors);
      document.documentElement.style.setProperty('--current-main', colors.main);
      document.documentElement.style.setProperty('--current-light', colors.light);
      document.documentElement.style.setProperty('--current-dark', colors.dark);
      document.documentElement.style.setProperty('--current-gradient', colors.gradient);
    }
  };

  return (
    <ColorContext.Provider value={value}>
      {children}
    </ColorContext.Provider>
  );
}

export function useThemeColors() {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("useThemeColors must be used within a ColorProvider");
  }
  return context;
}

export { defaultColors, gameColors };
export default ColorContext;