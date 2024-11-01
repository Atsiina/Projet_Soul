import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import MainPage from './pages/00_MainPage';
import WheelPage from './pages/01_WheelPage';
import MiniMenuPage from './pages/02_MiniMenu';
import QuestSoulPage from './pages/03_QuestSoul';
import ChiSoulMiPage from './pages/04_ChiSoulMi';
import LostRelicsPage from './pages/05_LostRelics';
import SoulEchoPage from './pages/06_SoulEcho';
import LabyrinthSpiritPage from './pages/07_LabyrinthSpirit';
import ThanksPage from './pages/08_ThanksPage';
import SecretPage from './pages/09_Secret';
import { ColorProvider, useThemeColors } from './context/ColorContext';

const NavigationBar = () => {
  const { themeColors } = useThemeColors();
  
  return (
    <nav 
      className="backdrop-blur-md p-6 border-b transition-all duration-1000"
      style={{
        background: `linear-gradient(to bottom, ${themeColors.dark}E6, ${themeColors.main}80, transparent)`,
        borderColor: `${themeColors.light}33`
      }}
    >
      <div className="container mx-auto flex justify-center items-center gap-10">
        {[
          { to: "/", text: "Accueil" },
          { to: "/games", text: "Roue" },
          { to: "/mini-games", text: "Mini-Jeux" },
          { to: "/thanks", text: "Remerciements" }
        ].map((link) => (
          <Link 
            key={link.to}
            to={link.to} 
            className="text-white/90 hover:text-white transition-all duration-300 text-2xl px-8 py-3 rounded-lg 
                      relative group"
          >
            <span>{link.text}</span>
            <span 
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              style={{
                background: themeColors.gradient
              }} 
            />
          </Link>
        ))}
      </div>
    </nav>
  );
};

const AnimatedBackground = () => {
  const { themeColors } = useThemeColors();
  const [bubbles, setBubbles] = React.useState([]);

  React.useEffect(() => {
    const generateBubbles = () => {
      return Array.from({ length: 60 }, (_, i) => ({
        id: i,
        size: Math.random() * (200 - 30) + 30,
        left: Math.random() * 100,
        top: Math.random() * 300,
        delay: Math.random() * 10,
        duration: Math.random() * (30 - 15) + 15,
        hasGlow: Math.random() > 0.4,
        glowIntensity: (200 - (Math.random() * (200 - 30) + 30)) / 200
      }));
    };

    setBubbles(generateBubbles());
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full transition-colors duration-1000"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            background: themeColors.gradient,
            animation: `float ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
            filter: bubble.hasGlow ? `drop-shadow(0 0 ${8 * bubble.glowIntensity}px ${themeColors.light}${0.3 * bubble.glowIntensity})` : 'none',
            opacity: bubble.hasGlow ? 0.1 + (bubble.glowIntensity * 0.1) : 0.1
          }}
        />
      ))}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-50px) translateX(20px) scale(1.1);
          }
          75% {
            transform: translateY(-25px) translateX(-20px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
};

function AppContent() {
  const location = useLocation();
  const { themeColors } = useThemeColors();

  return (
    <div 
      className="min-h-screen bg-black relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at 50% 50%, ${themeColors.main}10, black)`
      }}
    >
      <AnimatedBackground />
      <div className="relative z-10">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/games" element={<WheelPage />} />
          <Route path="/mini-games" element={<MiniMenuPage />} />
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
    <Router>
      <ColorProvider>
        <AppContent />
      </ColorProvider>
    </Router>
  );
}

export default App;