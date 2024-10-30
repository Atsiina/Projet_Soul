import React from 'react';

const PlanningSection = () => {
  const days = [
    {
      name: "Vendredi",
      time: "21:00",
      color: "#00C1A0",
      gifPath: "/images/Âmichettes Charly/Amichette_Verte.gif",
      games: [
        {
          name: "GARTIC PHONE",
          logo: "/images/Logo Jeux/Gartic Phone.png"
        },
        {
          name: "FAAAST PENGIUIN",
          logo: "/images/Logo Jeux/Faaast Penguin.png"
        },
        {
          name: "MICRO WORKS",
          logo: "/images/Logo Jeux/MicroWorks.png"
        }
      ]
    },
    {
      name: "Samedi",
      time: "21:00",
      color: "#0088FF",
      gifPath: "/images/Âmichettes Charly/Amichette_Bleu.gif",
      games: [
        {
          name: "ROLLIN RASCAL",
          logo: "/images/Logo Jeux/Rollin Rascal.png"
        },
        {
          name: "LYCANS",
          logo: "/images/Logo Jeux/Lycans.png"
        },
        {
          name: "MINECRAFT",
          logo: "/images/Logo Jeux/Minecraft Lucky World Invasion.png"
        }
      ]
    },
    {
      name: "Dimanche",
      time: "14:00",
      color: "#B860FF",
      gifPath: "/images/Âmichettes Charly/Amichette_Mauve.gif",
      games: [
        {
          name: "LETHAL COMPAGNY",
          logo: "/images/Logo Jeux/Lethal Compagny.png"
        },
        {
          name: "PUSH BATTLE",
          logo: "/images/Logo Jeux/Push Battle.png"
        },
        {
          name: "LEAGUE OF LEGENDS",
          logo: "/images/Logo Jeux/League of Legends.png"
        }
      ]
    }
  ];

  return (
    <section className="w-full max-w-6xl mx-auto mt-12 px-4">
      <div 
        className="backdrop-blur-md p-8 rounded-xl shadow-lg border"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), #00755E50)',
          borderColor: '#00755E20'
        }}
      >
        {/* Date ajoutée ici */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white">
            01 Novembre - 03 Novembre
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-16">
          {days.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  {/* Left GIF */}
                  <img 
                    src={day.gifPath}
                    alt="Soul Icon Left"
                    className="w-12 h-12 object-contain transform -scale-x-100"
                  />
                  <h3 
                    className="text-4xl font-bold"
                    style={{ color: day.color }}
                  >
                    {day.name}
                  </h3>
                  {/* Right GIF */}
                  <img 
                    src={day.gifPath}
                    alt="Soul Icon Right"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                {/* Horaire */}
                <p className="text-white text-3xl" style={{ fontFamily: 'Taurunum Ferrum' }}>
                  {day.time}
                </p>
              </div>
              <div className="flex flex-col items-center space-y-8 w-full">
                {day.games.map((game, gameIndex) => (
                  <div 
                    key={gameIndex}
                    className="flex flex-col items-center w-full"
                  >
                    {/* Logo du jeu */}
                    <img 
                      src={game.logo}
                      alt={game.name}
                      className="h-20 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanningSection;