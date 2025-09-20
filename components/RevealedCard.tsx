import React, { useState, useEffect, useMemo } from 'react';
import type { CardData } from '../types';
import { Rarity } from '../types';
import Card from './Card';
import Particle from './Particle';

interface RevealedCardProps {
  card: CardData;
  isFlipped: boolean;
  onFlip: () => void;
}

const PARTICLE_CONFIG = {
  [Rarity.Rare]: { count: 20, color: '#3b82f6', size: 4 },
  [Rarity.Epic]: { count: 40, color: '#a855f7', size: 5 },
  [Rarity.Legendary]: { count: 60, color: '#f59e0b', size: 6 },
  [Rarity.Common]: { count: 0, color: '', size: 0 },
};

const RevealedCard: React.FC<RevealedCardProps> = ({ card, isFlipped, onFlip }) => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (isFlipped && card.rarity !== Rarity.Common) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 1000); // Particles last for 1 second
      return () => clearTimeout(timer);
    }
  }, [isFlipped, card.rarity]);

  const particleConfig = PARTICLE_CONFIG[card.rarity];

  const particles = useMemo(() => {
    if (!showParticles) return null;
    return Array.from({ length: particleConfig.count }).map((_, i) => (
      <Particle key={i} color={particleConfig.color} size={particleConfig.size} />
    ));
  }, [showParticles, particleConfig]);

  return (
    <div className="relative w-56 h-80">
      <Card
        card={card}
        isFlipped={isFlipped}
        onFlip={onFlip}
        className="absolute top-0 left-0 z-10"
      />
      {particles && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-20 pointer-events-none">
          {particles}
        </div>
      )}
    </div>
  );
};

export default RevealedCard;
