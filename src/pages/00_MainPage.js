import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import ScoreTable from '../components/ScoreTable';
import GameDescription from '../components/GameDescription';
import MainPagePlanning from '../components/MainPagePlanning';
import AnimatedBackground from '../components/AnimatedBackground';

const MainPage = () => {
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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <header className="relative z-10 pt-16 text-center">
        {/* Titre Soul On-Lan */}
        <div className="flex items-center justify-center gap-8 mb-0.10">
          <img 
            src="/images/Âmichettes Charly/Amichette_Verte.gif"
            alt="Soul Animation Left"
            className="w-20 object-contain transform -scale-x-100"
          />
          <h1 className="text-9xl font-bold tracking-wider relative">    
            <span className="relative bg-gradient-to-b from-[#00C1A0] via-[#008B71] to-[#00755E]
                         bg-clip-text text-transparent">
              Soul On-Lan
            </span>
          </h1>
          <img 
            src="/images/Âmichettes Charly/Amichette_Verte.gif"
            alt="Soul Animation Right"
            className="w-20 object-contain"
          />
        </div>

        {/* Logo Soul Eater */}
        <div className="w-[350px] h-[350px] mx-auto mb-2">
          <img 
            src="/images/Soul_Eater_Logo_VVert_avec_âmichette.gif"
            alt="Logo Soul Eater"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Titres */}
        <div className="relative max-w-4xl mx-auto px-4 -mt-6">
          <img 
            src="/images/Logo_Fairy_Tail.png"
            alt="Fairy Tail Left"
            className="absolute left-36 top-1/2 -translate-y-1/2 h-28 transform -scale-x-100"
          />
          <img 
            src="/images/Logo_Fairy_Tail.png"
            alt="Fairy Tail Right"
            className="absolute right-36 top-1/2 -translate-y-1/2 h-28"
          />
          <h1 className="text-8xl font-bold mb-4" style={{ color: '#00755E' }}>
            Soul Eaters
          </h1>
          <div className="absolute right-[16rem] -top-5">
            <p className="text-5xl text-white">Ba Fuii</p>
          </div>
        </div>
      </header>

      {/* Planning Section avec la date intégrée */}
      <MainPagePlanning />

      {/* Section Classement */}
      <ScoreTable scores={scores} updateSouls={updateSouls} />

      {/* Description */}
      <GameDescription 
        mainColor="#00755E"
        soulImage="/images/Âmichettes Charly/Amichette_Bleu.gif"
        title="Rappel"
        titleColor="text-blue-500"
      >
        <div className="flex flex-col items-center space-y-7">
          <p className="text-center">
            Devient le <img src="/images/SoulKing.png" alt="Soul King Logo" className="inline-block h-6 mx-1" /> 
            <strong className="text-yellow-500">@👑Soul King🤘</strong> en collectant plus d'âmes que tes adversaires pendant trois jours, 
            dans un tournoi épique alliant adresse, connaissance et endurance sur divers jeux, 
            quizz avec un Mini-Jeu Bonus pour t'aider durant ta chasse. 
            Bonne chance Eater que ta moisson soit abondante !
          </p>

          <div className="space-y-6 w-full">
            <p className="text-center">
              <strong>En récompense !</strong>
            </p>
      
            <div className="space-y-4">
              <p>
                <strong>N°1 :</strong> Le premier recevra <strong>un titre unique</strong> sur le discord 
                <img src="/images/SoulKing.png" alt="Soul King Logo" className="inline-block h-6 mx-1" />
                <strong className="text-yellow-500">@👑Soul King🤘</strong>, 
                qui montrera à tous l'étendue de son skill ! 
                <span className="line-through">(Ou pas)</span> 
                Mais ce n'est pas tout il gagnera la modique somme de <strong>50€</strong> !
              </p>
              <p>
                <strong>N°2 :</strong> Le second aura <strong>25€ + un T-Shirt</strong> de notre confection !
              </p>
              <p>
                <strong>N°3 :</strong> Le troisième lui <strong>15€ + une Tasse personnalisée</strong> aussi !
              </p>
            </div>
          </div>
        </div>
      </GameDescription>

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
    </div>
  );
};

export default MainPage;