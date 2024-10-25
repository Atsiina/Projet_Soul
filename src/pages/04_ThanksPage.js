import React from 'react';

const ThanksPage = () => {
  // Liste des participants
  const participants = [
    { id: 1, name: "Participant 1", role: "Organisateur" },
    { id: 2, name: "Participant 2", role: "Admin Discord" },
    { id: 3, name: "Participant 3", role: "Modérateur" },
    { id: 4, name: "Participant 4", role: "Streamer" },
    { id: 5, name: "Participant 5", role: "Modérateur" },
    { id: 6, name: "Participant 6", role: "Participant VIP" },
    { id: 7, name: "Participant 7", role: "Sponsor" },
    { id: 8, name: "Participant 8", role: "Community Manager" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Texte central */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center text-white max-w-2xl px-4">
          <h1 className="text-4xl font-bold mb-6 bg-gray-900/80 p-4 rounded-lg">
            Merci à tous les participants
          </h1>
          <p className="text-xl bg-gray-900/80 p-4 rounded-lg">
            Cette événement n'aurait pas été possible sans votre participation
            et votre enthousiasme. Merci d'avoir fait de Soul On-Lan un moment
            inoubliable !
          </p>
        </div>
      </div>

      {/* Sphères flottantes */}
      <div className="absolute inset-0">
        {participants.map((participant, index) => (
          <div
            key={participant.id}
            className="absolute"
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 80 + 10}%`,
              animation: `
                float-${index} 8s infinite ease-in-out,
                glow 3s infinite alternate
              `,
            }}
          >
            <div className="relative">
              {/* Sphère avec photo */}
              <div className="w-20 h-20 rounded-full overflow-hidden relative group">
                <img
                  src={`/api/placeholder/80/80`}
                  alt={participant.name}
                  className="w-full h-full object-cover"
                />
                {/* Effet de lueur */}
                <div className="absolute inset-0 bg-purple-500/20 group-hover:bg-purple-500/40 
                              transition-colors duration-300"></div>
              </div>
              
              {/* Effet d'âme/flamme */}
              <div className="absolute -bottom-4 left-0 w-full">
                <div className="h-12 bg-gradient-to-t from-purple-500/0 to-purple-500/20 
                              animate-flame rounded-full"></div>
              </div>
              
              {/* Info bulle au survol */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                            bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                {participant.name}
                <br />
                {participant.role}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
        }

        ${participants.map((_, index) => `
          @keyframes float-${index} {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            25% {
              transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) rotate(${Math.random() * 10 - 5}deg);
            }
            50% {
              transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) rotate(${Math.random() * 10 - 5}deg);
            }
            75% {
              transform: translate(${Math.random() * 30 - 15}px, ${Math.random() * 30 - 15}px) rotate(${Math.random() * 10 - 5}deg);
            }
          }
        `).join('\n')}

        @keyframes flame {
          0%, 100% { transform: scaleY(1); opacity: 0.2; }
          50% { transform: scaleY(1.2); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default ThanksPage;