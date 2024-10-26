import React, { createContext, useContext, useState } from 'react';

const ColorContext = createContext();

export const ColorProvider = ({ children }) => {
  const [themeColors, setThemeColors] = useState(null);

  return (
    <ColorContext.Provider value={{ themeColors, setThemeColors }}>
      {children}
    </ColorContext.Provider>
  );
};

export const useThemeColors = () => useContext(ColorContext);