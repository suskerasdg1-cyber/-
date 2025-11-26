import React from 'react';

interface PokemonSpriteProps {
  src: string;
  alt: string;
  isTakingDamage: boolean;
  isAttacking: boolean;
  isPlayer: boolean;
}

const PokemonSprite: React.FC<PokemonSpriteProps> = ({ src, alt, isTakingDamage, isAttacking, isPlayer }) => {
  let animationClass = "";

  if (isTakingDamage) {
    animationClass = "animate-shake brightness-200 sepia"; // Flash effect
  } else if (isAttacking) {
    animationClass = isPlayer ? "translate-x-8 -translate-y-4" : "-translate-x-8 translate-y-4";
  } else {
    // Idle animation
    animationClass = "animate-bounce"; 
  }

  return (
    <div className={`relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center transition-transform duration-200 ${animationClass}`}>
      <div className="absolute bottom-4 w-32 h-8 bg-black/40 blur-xl rounded-[100%]"></div>
      <img 
        src={src} 
        alt={alt} 
        className={`w-full h-full object-contain drop-shadow-2xl rendering-pixelated ${isTakingDamage ? 'opacity-80' : 'opacity-100'}`}
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export default PokemonSprite;
