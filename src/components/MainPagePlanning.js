import React from 'react';

const PlanningSection = () => {
  const days = [
    {
      name: "Vendredi",
      color: "#00C1A0",
      games: ["GARTIC PHONE", "FAAAST PENGIUIN", "MICRO WORKS"]
    },
    {
      name: "Samedi",
      color: "#0088FF",
      games: ["ROLLIN RASCAL", "LYCANS", "MINECRAFT"]
    },
    {
      name: "Dimanche",
      color: "#B860FF",
      games: ["LETHAL COMPAGNY", "PUSH BATTLE", "LEAGUE OF LEGENDS"]
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
          <h2 className="text-3xl font-bold text-white">
            01 Novembre - 03 Novembre
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-16">
          {days.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex justify-center items-center gap-4 mb-8">
                <img 
                  src="/images/Âmichettes Charly/Amichette_Verte.gif"
                  alt="Soul Icon"
                  className="w-8 h-8 object-contain"
                />
                <h3 
                  className="text-3xl font-bold"
                  style={{ color: day.color }}
                >
                  {day.name}
                </h3>
                <img 
                  src="/images/Âmichettes Charly/Amichette_Verte.gif"
                  alt="Soul Icon"
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div className="flex flex-col items-center space-y-6 w-full">
                {day.games.map((game, gameIndex) => (
                  <div 
                    key={gameIndex}
                    className="text-2xl text-white hover:text-[#00C1A0] transition-colors duration-300 w-full text-center"
                  >
                    {game}
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