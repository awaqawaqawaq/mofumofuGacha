import type { CardData } from './types';
import { Rarity } from './types';

export const PACK_SIZE = 5;

export const RARITY_STYLES: { [key in Rarity]: { color: string; glow: string; weight: number } } = {
  [Rarity.Common]: { color: 'border-gray-400', glow: '', weight: 70 },
  [Rarity.Rare]: { color: 'border-blue-500', glow: 'glow-rare', weight: 20 },
  [Rarity.Epic]: { color: 'border-purple-600', glow: 'glow-epic', weight: 8 },
  [Rarity.Legendary]: { color: 'border-amber-400', glow: 'glow-legendary', weight: 2 },
};

export const CARD_POOL: CardData[] = [
  { id: 1, name: 'Pixel Slime', description: 'A basic, wobbly creature of the pixelated plains.', rarity: Rarity.Common, imageUrl: 'https://picsum.photos/seed/slime/200/150' },
  { id: 2, name: '8-Bit Bat', description: 'Flies through the darkest code caverns.', rarity: Rarity.Common, imageUrl: 'https://picsum.photos/seed/bat/200/150' },
  { id: 3, name: 'Bit-Rat', description: 'Scurries through digital dungeons, seeking cheese code.', rarity: Rarity.Common, imageUrl: 'https://picsum.photos/seed/rat/200/150' },
  { id: 4, name: 'Sprite Spider', description: 'Weaves webs of pure data.', rarity: Rarity.Common, imageUrl: 'https://picsum.photos/seed/spider/200/150' },
  { id: 5, name: 'Code Goblin', description: 'A mischievous creature that loves to cause syntax errors.', rarity: Rarity.Common, imageUrl: 'https://picsum.photos/seed/goblin/200/150' },
  
  { id: 6, name: 'Stone Golem', description: 'A sturdy protector carved from ancient bedrock.', rarity: Rarity.Rare, imageUrl: 'https://picsum.photos/seed/golem/200/150' },
  { id: 7, name: 'Aqua Serpent', description: 'A swift serpent of the digital seas.', rarity: Rarity.Rare, imageUrl: 'https://picsum.photos/seed/serpent/200/150' },
  { id: 8, name: 'Giga-Knight', description: 'A valiant warrior in shining pixel armor.', rarity: Rarity.Rare, imageUrl: 'https://picsum.photos/seed/knight/200/150' },
  { id: 9, name: 'Sky Griffon', description: 'Soars above the clouds, guarding the byte-sphere.', rarity: Rarity.Rare, imageUrl: 'https://picsum.photos/seed/griffon/200/150' },

  { id: 10, name: 'Shadow Necromancer', description: 'Raises fallen code from the recycle bin.', rarity: Rarity.Epic, imageUrl: 'https://picsum.photos/seed/necromancer/200/150' },
  { id: 11, name: 'Mecha-Behemoth', description: 'A colossal machine built for digital warfare.', rarity: Rarity.Epic, imageUrl: 'https://picsum.photos/seed/behemoth/200/150' },
  { id: 12, name: 'Fire Wyrm', description: 'Breathes flames that can corrupt data files.', rarity: Rarity.Epic, imageUrl: 'https://picsum.photos/seed/wyrm/200/150' },
  
  { id: 13, name: 'Glitch Dragon', description: 'A legendary beast born from a critical system error.', rarity: Rarity.Legendary, imageUrl: 'https://picsum.photos/seed/dragon/200/150' },
  { id: 14, name: 'Celestial Coder', description: 'The architect of the entire digital universe.', rarity: Rarity.Legendary, imageUrl: 'https://picsum.photos/seed/coder/200/150' },
];
