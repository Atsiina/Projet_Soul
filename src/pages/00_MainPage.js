import React, { useState, useEffect } from 'react';
import { Award, Gamepad2, Users, RotateCw, Plus, Minus } from 'lucide-react';
import GameDescription from '../components/GameDescription';

const MainPage = () => {
  const [bubbles, setBubbles] = useState([]);
  const [scores, setScores] = useState([
    { id: 1, player: "Charly", souls: 0 },
    { id: 2, player: "Zaza", souls: 0 },
    { id: 3, player: "Quasibrother", souls: 0 },
    { id: 4, player: "Billy", souls: 0 },
    { id: 5, player: "Logy", souls: 0 },
    { id: 6, player: "Evil Luxus", souls: 0 },
    { id: 7, player: "Gray", souls: 0 },
    { id: 8, player: "Atsina", souls: 0 },
    { id: 9, player: "Shishi", souls: 0 },
    { id: 10, player: "Akuma", souls: 0 },
    { id: 11, player: "NoNo", souls: 0 }
  ]);

  const updateSouls = (playerId, increment) => {
    setScores(prevScores => 
      prevScores.map(player => 
        player.id === playerId 
          ? { ...player, souls: Math.max(0, player.souls + increment) }
          : player
      )
    );
  };

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = Array.from({ length: 60 }, (_, i) => {
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
      setBubbles(newBubbles);
    };

    generateBubbles();
  }, []);
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Bulles en arrière-plan */}
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
              background: `linear-gradient(135deg, #00C1A0, #008B71, #00755E)`,
              animation: `float ${bubble.duration}s ease-in-out ${bubble.delay}s infinite`,
              filter: bubble.hasGlow ? `drop-shadow(0 0 ${8 * bubble.glowIntensity}px rgba(0, 193, 160, ${0.3 * bubble.glowIntensity}))` : 'none',
              opacity: bubble.hasGlow ? 0.1 + (bubble.glowIntensity * 0.1) : 0.1
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <header className="relative z-10 pt-20 text-center">
        {/* Titre de l'événement avec effet dégradé amélioré */}
        <div className="flex items-center justify-center gap-12 mb-0.10">
          <img 
            src="/images/Âmichettes Charly/Amichette_Verte.gif"
            alt="Soul Animation Left"
            className="w-40 object-contain transform -scale-x-100"
          />
          <h1 className="text-[150px] font-bold tracking-wider relative">
            <span className="absolute inset-0 bg-gradient-to-b from-[#00C1A0] via-[#008B71] to-[#00755E] opacity-90 
                         bg-clip-text text-transparent z-10">
              Soul On-Lan
            </span>
            <span className="absolute inset-0 bg-gradient-to-b from-[#00C1A0] via-[#008B71] to-[#00755E] opacity-50
                         bg-clip-text text-transparent blur-[2px]">
              Soul On-Lan
            </span>
            <span className="relative bg-gradient-to-b from-[#00C1A0] via-[#008B71] to-[#00755E]
                         bg-clip-text text-transparent">
              Soul On-Lan
            </span>
          </h1>
          <img 
            src="/images/Âmichettes Charly/Amichette_Verte.gif"
            alt="Soul Animation Right"
            className="w-40 object-contain"
          />
        </div>

        {/* Logo animé */}
        <div className="w-[414px] h-[414px] mx-auto mb-2">
          <img 
            src="/images/Soul_Eater_Logo_VVert_avec_âmichette.gif"
            alt="Logo Soul Eater"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Titres */}
        <div className="relative max-w-6xl mx-auto px-4 -mt-6">
          <img 
            src="/images/Logo_Fairy_Tail.png"
            alt="Fairy Tail Left"
            className="absolute left-40 top-1/2 -translate-y-1/2 h-32 transform -scale-x-100"
          />
          <img 
            src="/images/Logo_Fairy_Tail.png"
            alt="Fairy Tail Right"
            className="absolute right-40 top-1/2 -translate-y-1/2 h-32"
          />
          <h1 className="text-9xl font-bold mb-4" style={{ color: '#00755E' }}>
            Soul Eaters
          </h1>
          <div className="absolute right-[20.4rem] -top-6">
            <p className="text-6xl text-white">Ba Fuii</p>
          </div>
        </div>

        {/* Date */}
        <p className="relative z-10 text-4xl mt-8 mb-12 text-white font-bold">
          01 Novembre - 03 Novembre
        </p>
      </header>

{/* Description avec la nouvelle police */}
<GameDescription 
        mainColor="#00755E"
        soulImage="/images/Âmichettes Charly/Amichette_Verte.gif"
      >
        <p>
          <strong>Aide-nous à récolter le plus d'âmes</strong> en triomphant de tes adversaires dans un tournoi épique alliant adresse, connaissance et endurance.
        </p>
        
        <p>
          <strong>Celui qui dispose du plus grand nombre d'âmes sera le grand vainqueur incontesté !</strong>
        </p>

        <div className="space-y-6 pl-8">
          <p>
            <strong>En récompense !</strong>
          </p>
          <ul className="list-disc space-y-4">
            <li>
              <strong>N°1:</strong> Le premier recevra <strong>un titre unique</strong> sur le discord : <strong className="text-[#00C1A0]">@👑Soul King🤘</strong>, qui montrera à tous l'étendue de son skill ! <span className="line-through">(Ou pas)</span> Mais ce n'est pas tout il gagnera la modique somme de <strong>50€</strong> !
            </li>
            <li>
              <strong>N°2:</strong> Le second aura <strong>25€ + un T-Shirt</strong> de notre confection !
            </li>
            <li>
              <strong>N°3:</strong> Le troisième lui <strong>15€ + une Tasse personnalisé</strong> aussi !
            </li>
          </ul>
        </div>

        <div className="bg-black/40 p-6 rounded-lg mt-8">
          <p>
            <strong>Le tournois commence à 21h00 le vendredi</strong>, jusqu'au soir. Il reprendra ensuite le samedi soir aussi à 21h00 puis le dimanche dans l'après-midi vers 14h00 jusqu'à la final.
          </p>
        </div>

        <p>
          Aucun jeu n'est éliminatoire, tu dois participer à chaque épreuve pour pouvoir gagner !
        </p>

        <div className="space-y-6">
          <p>
            Pendant ces trois jours <strong>il y aura un Quizz avec divers thèmes</strong>:
          </p>
          <ul className="list-disc pl-8 space-y-4">
            <li>Lore de LOL</li>
            <li>Blind test</li>
            <li>Et bien plus...</li>
          </ul>
        </div>

        <p>
          <strong>Une surprise</strong> qui attend chaque participant, c'est un petit bonus pour vous faire <span className="line-through">gobber</span> gagner encore plus d'âme !!!
        </p>

        <p className="text-3xl font-bold mt-10">
          Et ce que vous attendez tous <strong>la liste des jeux</strong>...
          Voici les terrains de jeu <strong>POSSIBLES</strong> de cette année !
          Let's go guys !
        </p>
      </GameDescription>

      {/* Section Classement avec nouvelle police pour le contenu */}
      <section className="relative z-10 max-w-6xl mx-auto py-16 px-4">
        <div className="bg-gradient-to-b from-black/90 to-[#00755E]/50 backdrop-blur-md p-8 rounded-xl shadow-lg border border-[#00755E]/20">
          <div className="flex items-center gap-4 mb-8">
            <img 
              src="/images/Âmichettes Charly/Amichette_Verte.gif"
              alt="Soul Icon"
              className="w-16 h-16 object-contain -translate-y-2.5"
            />
            {/* Le titre reste en Taurunum Ferrum */}
            <h2 className="text-5xl text-white font-bold">Classement</h2>
          </div>

          {/* Contenu du tableau en Bree Serif */}
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-[#00755E]/30">
                  <th className="py-6 px-8 text-left text-3xl description-content">Participant</th>
                  <th className="py-6 px-8 text-center text-3xl description-content">Âmes collectées</th>
                  <th className="py-6 px-8 text-right text-3xl description-content">Total</th>
                  <th className="py-6 px-8 text-center text-3xl description-content">Actions</th>
                </tr>
              </thead>
              <tbody className="description-content">
                {scores.map((player) => (
                  <tr key={player.id} className="border-b border-[#00755E]/20">
                    <td className="py-6 px-8 text-3xl font-medium">{player.player}</td>
                    <td className="py-6 px-8">
                      <div className="flex flex-wrap justify-center gap-2 min-h-[48px]">
                        {[...Array(player.souls)].map((_, i) => (
                          <img 
                            key={i}
                            src="/images/Petite âmichette.gif"
                            alt="âme"
                            className="w-6 object-contain"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="py-6 px-8 text-2xl text-right">{player.souls}</td>
                    <td className="py-6 px-8">
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => updateSouls(player.id, 1)}
                          className="p-2 text-[#00C1A0] hover:text-white transition-colors"
                        >
                          <Plus className="w-8 h-8" />
                        </button>
                        <button
                          onClick={() => updateSouls(player.id, -1)}
                          className="p-2 text-[#00C1A0] hover:text-white transition-colors"
                        >
                          <Minus className="w-8 h-8" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section Discord */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-lg mx-auto p-6 rounded-xl backdrop-blur-sm 
                    bg-gradient-to-b from-black/90 to-[#00755E]/50
                    hover:from-black/80 hover:to-[#00755E]/60 
                    transition-all duration-300 cursor-pointer
                    border border-[#00755E]/20">
          <a href="votre-lien-discord" target="_blank" rel="noopener noreferrer"
             className="flex items-center justify-center gap-6">
            <img 
              src="/images/discord-icon.png" 
              alt="Discord" 
              className="w-16 h-16"
            />
            <span className="text-3xl text-white hover:text-[#00C1A0] transition-colors duration-300">
              Rejoignez-nous sur Discord
            </span>
          </a>
        </div>
      </section>

      {/* Style pour l'animation des bulles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            transform: translateY(-50px) translateX(20px

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

export default MainPage;