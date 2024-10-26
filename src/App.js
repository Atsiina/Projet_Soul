import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import MainPage from './pages/00_MainPage';
import WheelPage from './pages/01_WheelPage';
import QuestSoulPage from './pages/03_QuestSoul';
import ChiSoulMiPage from './pages/04_ChiSoulMi';
import LostRelicsPage from './pages/05_LostRelics';
import SoulEchoPage from './pages/06_SoulEcho';
import LabyrinthSpiritPage from './pages/07_LabyrinthSpirit';
import ThanksPage from './pages/08_ThanksPage';
import SecretPage from './pages/09_Secret';
import { ColorProvider, useThemeColors } from './context/ColorContext';

const AnimatedBackground = () => {
  const { themeColors } = useThemeColors();
  const [bubbles, setBubbles] = React.useState([]);

  React.useEffect(() => {
    const generateBubbles = () => {
      return Array.from({ length: 60 }, (_, i) => {
        const size = Math.random() * (200 - 30) + 30;
        const glowIntensity = (200 - size) / 200;
        
        return {
          id: i,
          size: size,
          left: Math.random() * 100,
          top: Math.random() * 300,
          delay: Math.random() * 10,
          duration: Math.random() * (30 - 15) + 15,
          hasGlow: Math.random() > 0.4,
          glowIntensity: glowIntensity
        };
      });
    };

    setBubbles(generateBubbles());
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full transition-all duration-1000"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            background: themeColors 
              ? `linear-gradient(135deg, ${themeColors.light}, ${themeColors.main}, ${themeColors.dark})`
              : 'linear-gradient(135deg, #00C1A0, #008B71, #00755E)',
            animation: `float ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
            filter: bubble.hasGlow 
              ? `drop-shadow(0 0 ${8 * bubble.glowIntensity}px ${
                  themeColors ? themeColors.light : 'rgba(0, 193, 160)'
                }${0.3 * bubble.glowIntensity})` 
              : 'none',
            opacity: bubble.hasGlow ? 0.1 + (bubble.glowIntensity * 0.1) : 0.1
          }}
        />
      ))}
    </div>
  );
};

function AppContent() {
  const { setThemeColors, themeColors } = useThemeColors();
  const location = useLocation();

  // Réinitialise les couleurs quand on change de page
  useEffect(() => {
    const defaultColors = {
      main: '#00C1A0',
      light: '#00D9B5',
      dark: '#00A88B',
      gradient: 'linear-gradient(135deg, #00D9B5, #00C1A0, #00A88B)'
    };

    // Si on est sur la page d'accueil, la page des mini-jeux ou les remerciements
    if (["/", "/games", "/thanks"].includes(location.pathname)) {
      setThemeColors(defaultColors);
    }
  }, [location, setThemeColors]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative z-10">
        {/* Navigation avec couleurs dynamiques */}
        <nav 
          className="backdrop-blur-md p-6 border-b transition-all duration-1000"
          style={{
            background: themeColors 
              ? `linear-gradient(to bottom, ${themeColors.dark}90, ${themeColors.main}50, transparent)`
              : 'linear-gradient(to bottom, rgba(0, 117, 94, 0.9), rgba(0, 139, 113, 0.5), transparent)',
            borderColor: themeColors ? `${themeColors.light}20` : 'rgba(0, 193, 160, 0.2)'
          }}
        >
          <div className="container mx-auto flex justify-center items-center gap-10">
            {[
              { to: "/", text: "Accueil" },
              { to: "/games", text: "Mini-Jeux" },
              { to: "/thanks", text: "Remerciements" }
            ].map((link) => (
              <Link 
                key={link.to}
                to={link.to} 
                className="text-white/90 hover:text-white transition-all duration-300 text-2xl px-8 py-3 rounded-lg 
                          relative group"
                style={{
                  '--hover-color': themeColors ? themeColors.light : '#00C1A0'
                }}
              >
                <span>{link.text}</span>
                <span 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background: themeColors 
                      ? themeColors.gradient 
                      : 'linear-gradient(135deg, #00C1A0, #008B71, #00755E)'
                  }} 
                />
              </Link>
            ))}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/games" element={<WheelPage />} />
          <Route path="/games/quete-des-ames" element={<QuestSoulPage />} />
          <Route path="/games/chi-soul-mi" element={<ChiSoulMiPage />} />
          <Route path="/games/reliques-perdues" element={<LostRelicsPage />} />
          <Route path="/games/echo-de-lame" element={<SoulEchoPage />} />
          <Route path="/games/labyrinthe" element={<LabyrinthSpiritPage />} />
          <Route path="/thanks" element={<ThanksPage />} />
          <Route path="/secret" element={<SecretPage />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ColorProvider>
      <Router>
        <AppContent />
      </Router>
    </ColorProvider>
  );
}

export default App;