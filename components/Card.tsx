import React from 'react';
import type { CardData } from '../types';
import { Rarity } from '../types';
import { RARITY_STYLES } from '../constants';

interface CardProps {
  card: CardData;
  isFlipped: boolean;
  onFlip?: () => void; // onFlip is optional for use in RevealedCard
  className?: string; // Allow passing custom classes
}

const Card: React.FC<CardProps> = ({ card, isFlipped, onFlip, className }) => {
  const rarityStyle = RARITY_STYLES[card.rarity];

  return (
    <div
      className={`w-56 h-80 cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg) scale(1.05)' : 'none' 
        }}
      >
        {/* Card Back */}
        <div className="absolute w-full h-full bg-gray-700 border-4 border-black p-4 flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
          <div className="w-32 h-32 border-4 border-black bg-purple-900 flex items-center justify-center">
            <div className="text-yellow-400 text-5xl font-black">?</div>
          </div>
        </div>

        {/* Card Front */}
        <div
          className={`absolute w-full h-full bg-gray-800 border-8 ${rarityStyle.color} ${isFlipped ? rarityStyle.glow : ''}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="p-2 flex flex-col h-full text-white text-center">
            <p className="text-xs mb-1">{card.name}</p>
            <div className="flex-shrink-0 w-full h-36 bg-black mb-2 border-2 border-gray-600">
               <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow flex flex-col justify-center text-xs p-1 bg-black/30 border border-gray-600">
              <p>{card.description}</p>
            </div>
            <p className={`mt-2 text-xs font-bold ${rarityStyle.color.replace('border-', 'text-')}`}>
              {card.rarity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
