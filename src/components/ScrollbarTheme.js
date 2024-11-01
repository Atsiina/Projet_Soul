import React, { useEffect } from 'react';
import { useThemeColors } from '../context/ColorContext';

const ScrollbarTheme = () => {
  const { themeColors } = useThemeColors();
  
  useEffect(() => {
    // Création d'un élément style dynamique
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      ::-webkit-scrollbar {
        width: 10px;
      }

      ::-webkit-scrollbar-track {
        background: ${themeColors.dark}10;
        border-radius: 5px;
      }

      ::-webkit-scrollbar-thumb {
        background: ${themeColors.light}30;
        border-radius: 5px;
        border: 2px solid transparent;
        background-clip: padding-box;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${themeColors.light}50;
        border: 2px solid transparent;
        background-clip: padding-box;
      }
    `;

    // Ajout du style au head du document
    document.head.appendChild(styleElement);

    // Nettoyage lors du démontage du composant
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [themeColors]);

  return null; // Ce composant ne rend rien visuellement
};

export default ScrollbarTheme;