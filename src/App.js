import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainPage from './pages/00_MainPage';
import WheelPage from './pages/01_WheelPage';
import ThanksPage from './pages/04_ThanksPage';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black relative overflow-hidden">
        <AnimatedBackground />
        <div className="relative z-10">
          {/* Navigation avec bannière plus grande et boutons améliorés */}
          <nav className="bg-gradient-to-b from-black/90 to-[#00755E]/50 backdrop-blur-md p-6 border-b border-[#00755E]/20">
            <div className="container mx-auto flex justify-center items-center gap-10">
              <Link 
                to="/" 
                className="text-white/90 hover:text-[#00C1A0] transition-all duration-300 text-2xl px-8 py-3 rounded-lg 
                          hover:bg-black/20 font-medium tracking-wide relative
                          after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] 
                          after:bg-[#00C1A0] after:scale-x-0 hover:after:scale-x-100 after:transition-transform 
                          after:duration-300"
              >
                Accueil
              </Link>
              <Link 
                to="/games" 
                className="text-white/90 hover:text-[#00C1A0] transition-all duration-300 text-2xl px-8 py-3 rounded-lg 
                          hover:bg-black/20 font-medium tracking-wide relative
                          after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] 
                          after:bg-[#00C1A0] after:scale-x-0 hover:after:scale-x-100 after:transition-transform 
                          after:duration-300"
              >
                Mini-Jeux
              </Link>
              <Link 
                to="/thanks" 
                className="text-white/90 hover:text-[#00C1A0] transition-all duration-300 text-2xl px-8 py-3 rounded-lg 
                          hover:bg-black/20 font-medium tracking-wide relative
                          after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] 
                          after:bg-[#00C1A0] after:scale-x-0 hover:after:scale-x-100 after:transition-transform 
                          after:duration-300"
              >
                Remerciements
              </Link>
            </div>
          </nav>

          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/games" element={<WheelPage />} />
            <Route path="/thanks" element={<ThanksPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;