import type { CardData } from '../types';
import { CARD_POOL, PACK_SIZE, RARITY_STYLES } from '../constants';

export const openPack = (): CardData[] => {
  const weightedPool: CardData[] = [];
  
  CARD_POOL.forEach(card => {
    const weight = RARITY_STYLES[card.rarity]?.weight || 1;
    for (let i = 0; i < weight; i++) {
      weightedPool.push(card);
    }
  });

  const pack: CardData[] = [];
  const drawnIds = new Set<number>();

  while (pack.length < PACK_SIZE && weightedPool.length > 0) {
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    const randomCard = weightedPool[randomIndex];

    if (!drawnIds.has(randomCard.id)) {
      pack.push(randomCard);
      drawnIds.add(randomCard.id);
    }
  }
  
  // Sort by rarity for a more dramatic reveal
  pack.sort((a, b) => RARITY_STYLES[a.rarity].weight - RARITY_STYLES[b.rarity].weight);

  return pack;
};
