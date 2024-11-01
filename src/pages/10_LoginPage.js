import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(loginId, password);
      navigate('/'); // Redirection vers la page principale après connexion
    } catch (err) {
      setError('Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative">
      {/* Background avec animation similaire aux autres pages */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 200 + 50}px`,
              height: `${Math.random() * 200 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: 'linear-gradient(135deg, #00D9B5, #00C1A0, #00A88B)',
              opacity: 0.1,
              animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="mb-8 text-center">
          <img 
            src="/images/Soul_Eater_Logo_VVert_avec_âmichette.gif"
            alt="Soul On-Lan Logo"
            className="w-48 h-48 mx-auto"
          />
          <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-[#00C1A0] to-[#008B71] bg-clip-text text-transparent">
            Soul On-Lan
          </h1>
        </div>

        {/* Formulaire de connexion */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-8 border border-[#00C1A0]/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="loginId" 
                className="block text-white text-sm font-medium mb-2"
              >
                Identifiant
              </label>
              <input
                id="loginId"
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full bg-black/50 text-white border border-[#00C1A0]/30 rounded-lg px-4 py-3 
                         focus:outline-none focus:border-[#00C1A0] transition-colors"
                required
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-white text-sm font-medium mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 text-white border border-[#00C1A0]/30 rounded-lg px-4 py-3 
                         focus:outline-none focus:border-[#00C1A0] transition-colors"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg font-bold text-xl transition-all duration-300
                     bg-gradient-to-r from-[#00C1A0]/20 to-[#008B71]/20
                     hover:from-[#00C1A0]/30 hover:to-[#008B71]/30
                     border border-[#00C1A0]/30 hover:border-[#00C1A0]
                     text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
