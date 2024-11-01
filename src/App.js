import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './context/AuthContext';
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
import LoginPage from './pages/10_LoginPage';
import { ColorProvider, useThemeColors } from './context/ColorContext';

// Composant ProtectedRoute
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return null;
  return user ? children : null;
};

// Composant NavigationBar
const NavigationBar = () => {
  const { themeColors } = useThemeColors();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };
  
  return (
    <nav 
      className="backdrop-blur-md p-6 border-b transition-all duration-1000 relative z-[50]"
      style={{
        background: `linear-gradient(to bottom, ${themeColors.dark}E6, ${themeColors.main}80, transparent)`,
        borderColor: `${themeColors.light}33`
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Liens de navigation */}
        <div className="flex items-center gap-10">
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

        {/* Section Auth avec menu déroulant */}
        <div className="relative z-[90]">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-6 py-3 rounded-lg text-white/90 hover:text-white 
                         transition-all duration-300 relative group"
              >
                <img 
                  src="/images/Âmichettes Charly/Amichette_Verte.gif"
                  alt="Âme"
                  className="w-8 h-8 object-contain"
                />
                <span className="text-2xl">{user.nickname}</span>
                <span 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background: themeColors.gradient
                  }} 
                />
              </button>

              {/* Menu déroulant avec overlay */}
              {showUserMenu && (
                <>
                  {/* Overlay invisible pour fermer le menu */}
                  <div 
                    className="fixed inset-0 z-[90]"
                    onClick={() => setShowUserMenu(false)}
                  />
                  
                  {/* Contenu du menu */}
                  <div
                    className="absolute right-0 top-full mt-2 w-48 rounded-lg overflow-hidden shadow-lg backdrop-blur-md border z-[100]"
                    onClick={e => e.stopPropagation()}
                    style={{
                      background: `linear-gradient(to bottom, ${themeColors.dark}F2, ${themeColors.main}F2)`,
                      borderColor: `${themeColors.light}33`
                    }}
                  >
                    <div className="p-4 border-b border-white/10">
                      <div className="text-white/90 text-sm mb-1">Âmes collectées</div>
                      <div className="flex items-center gap-2">
                        <span className="text-white text-lg font-bold">{user.souls}</span>
                        <img 
                          src="/images/Petite âmichette.gif"
                          alt="âme"
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left text-white/90 hover:text-white hover:bg-white/5
                             transition-all duration-300"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link 
              to="/login"
              className="text-white/90 hover:text-white transition-all duration-300 text-2xl px-8 py-3 
                        rounded-lg relative group"
            >
              <span>Connexion</span>
              <span 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: themeColors.gradient
                }} 
              />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

// Composant AnimatedBackground
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

// Composant AppContent
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MainPage />} />
          <Route path="/games" element={<WheelPage />} />
          <Route path="/mini-games" element={<ProtectedRoute><MiniMenuPage /></ProtectedRoute>} />
          <Route path="/games/quete-des-ames" element={<ProtectedRoute><QuestSoulPage /></ProtectedRoute>} />
          <Route path="/games/chi-soul-mi" element={<ProtectedRoute><ChiSoulMiPage /></ProtectedRoute>} />
          <Route path="/games/reliques-perdues" element={<ProtectedRoute><LostRelicsPage /></ProtectedRoute>} />
          <Route path="/games/echo-de-lame" element={<ProtectedRoute><SoulEchoPage /></ProtectedRoute>} />
          <Route path="/games/labyrinthe" element={<ProtectedRoute><LabyrinthSpiritPage /></ProtectedRoute>} />
          <Route path="/thanks" element={<ProtectedRoute><ThanksPage /></ProtectedRoute>} />
          <Route path="/secret" element={<ProtectedRoute><SecretPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

// Composant App principal
function App() {
  return (
    <AuthProvider>
      <Router>
        <ColorProvider>
          <AppContent />
        </ColorProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
