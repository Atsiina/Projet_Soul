import React, { useState, useEffect } from 'react';

const LostRelicsPage = () => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes par défaut
  const [initialTime, setInitialTime] = useState(300); // Pour la réinitialisation
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [blinkCount, setBlinkCount] = useState(0);
  
  const gameColors = {
    main: '#C9880C',
    light: '#E09D0E',
    dark: '#A16C0A',
    gradient: 'linear-gradient(135deg, #E09D0E, #C9880C, #A16C0A)'
  };

  useEffect(() => {
    let interval;
    if (isRunning && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isBlinking) {
      setIsBlinking(true);
      setBlinkCount(0);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, timeLeft, isBlinking]);

  useEffect(() => {
    let blinkInterval;
    if (isBlinking && blinkCount < 10) {
      blinkInterval = setInterval(() => {
        setBlinkCount(prev => prev + 1);
      }, 500);
    } else if (blinkCount >= 10) {
      setIsBlinking(false);
      setIsRunning(false);
      setIsPaused(false);
    }
    return () => clearInterval(blinkInterval);
  }, [isBlinking, blinkCount]);

  const startTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
    setIsBlinking(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsRunning(false);
    setIsPaused(false);
    setIsBlinking(false);
    setBlinkCount(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const setTimerMinutes = (minutes) => {
    const newTime = minutes * 60;
    setTimeLeft(newTime);
    setInitialTime(newTime);
    setIsRunning(false);
    setIsPaused(false);
    setIsBlinking(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-12 relative z-10">
      {/* En-tête du mini-jeu */}
      <header className="w-full max-w-6xl mx-auto text-center mb-12">
        <h1 
          className="text-8xl font-bold mb-4"
          style={{
            background: gameColors.gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `0 0 30px ${gameColors.light}30`
          }}
        >
          Les Reliques Perdues
        </h1>
        <div 
          className="text-4xl font-bold mb-8"
          style={{ color: gameColors.light }}
        >
          BONUS
        </div>
      </header>

      {/* Section Chronomètre */}
      <div className="bg-black/40 backdrop-blur-sm rounded-xl p-8 border-2 transition-all duration-300 w-full max-w-2xl mx-auto"
           style={{ borderColor: `${gameColors.main}30` }}>
        {/* Affichage du temps */}
        <div className={`text-8xl font-bold text-center mb-8 transition-opacity duration-500
                      ${isBlinking ? 'animate-pulse' : ''}`}
             style={{ color: gameColors.light }}>
          {formatTime(timeLeft)}
        </div>

        {/* Contrôles du chronomètre */}
        <div className="flex flex-col gap-6">
          {/* Sélection du temps */}
          <div className="flex justify-center gap-4 flex-wrap">
            {[5, 10, 15, 20, 25, 30].map(minutes => (
              <button
                key={minutes}
                onClick={() => setTimerMinutes(minutes)}
                disabled={isRunning}
                className="px-4 py-2 rounded-lg text-xl font-bold transition-all duration-300
                         border-2 hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: timeLeft === minutes * 60 ? `${gameColors.main}30` : 'transparent',
                  borderColor: timeLeft === minutes * 60 ? gameColors.light : `${gameColors.main}30`,
                  color: timeLeft === minutes * 60 ? gameColors.light : 'white'
                }}
              >
                {minutes}min
              </button>
            ))}
          </div>

          {/* Boutons de contrôle */}
          <div className="flex justify-center gap-4">
            {/* Bouton Start/Pause */}
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="px-8 py-4 rounded-xl text-3xl font-bold transition-all duration-300
                         border-2 hover:bg-opacity-30"
                style={{
                  backgroundColor: `${gameColors.main}20`,
                  borderColor: gameColors.light,
                  color: gameColors.light
                }}
              >
                GO !
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="px-8 py-4 rounded-xl text-3xl font-bold transition-all duration-300
                         border-2 hover:bg-opacity-30"
                style={{
                  backgroundColor: isPaused ? `${gameColors.main}20` : `${gameColors.dark}40`,
                  borderColor: gameColors.light,
                  color: gameColors.light
                }}
              >
                {isPaused ? 'Reprendre' : 'Pause'}
              </button>
            )}

            {/* Bouton Reset */}
            {(isRunning || isPaused) && (
              <button
                onClick={resetTimer}
                className="px-8 py-4 rounded-xl text-3xl font-bold transition-all duration-300
                         border-2 hover:bg-opacity-30"
                style={{
                  backgroundColor: 'transparent',
                  borderColor: gameColors.light,
                  color: gameColors.light
                }}
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Styles pour l'animation de clignotement */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-pulse {
          animation: pulse 0.5s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LostRelicsPage;