export enum Rarity {
  Common = 'Common',
  Rare = 'Rare',
  Epic = 'Epic',
  Legendary = 'Legendary',
}

export interface CardData {
  id: number;
  name: string;
  description: string;
  rarity: Rarity;
  imageUrl: string;
}
