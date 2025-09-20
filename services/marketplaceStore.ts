// 简易商品仓库（内存 + localStorage 持久化）

export type ItemCategory = '标准包' | '进阶包' | '传奇包' | '其他';

export interface MarketItem {
  id: string;
  name: string;
  desc: string;
  category: ItemCategory;
  priceApt: number; // 使用 APT 计价
  image?: string;
  seller?: string;
  createdAt: number;
}

type Listener = (items: MarketItem[]) => void;

// bump storage key to clear previous mock data and reload fresh dataset
const LS_KEY = 'marketItems_v2';

function initialItems(): MarketItem[] {
  const now = Date.now();
  const make = (i: number, name: string, desc: string, category: ItemCategory, priceApt: number) => ({
    id: `itm-${i}`,
    name,
    desc,
    category,
    priceApt,
    image: `https://picsum.photos/seed/itm${i}/300/220`,
    createdAt: now - i * 30000,
  } as MarketItem);

  const items: MarketItem[] = [
    make(101, 'Pixel Avatar #101', 'Unique pixel avatar', '其他', 0.9),
    make(102, 'Pixel Avatar #102', 'Limited pixel avatar', '其他', 1.1),
    make(103, 'Sword of Bits', '8-bit forged sword', '其他', 2.4),
    make(104, 'Shield of Bytes', 'Protects against bugs', '其他', 1.8),
    make(105, 'Mystic Cape', 'Enchanted pixel cape', '其他', 3.2),
    make(106, 'Treasure Map', 'Find hidden loot', '其他', 0.7),
    make(107, 'Potion: Speed', 'Increase move speed', '其他', 0.5),
    make(108, 'Potion: Luck', 'Slightly better odds', '其他', 0.6),
    make(109, 'Badge: Explorer', 'Proof of exploration', '其他', 0.4),
    make(110, 'Badge: Slayer', 'Defeated 100 foes', '其他', 0.8),
    // themed items by categories for filtering
    make(201, 'Standard Ticket A', 'Entry ticket (standard)', '标准包', 0.3),
    make(202, 'Standard Ticket B', 'Entry ticket (standard)', '标准包', 0.35),
    make(203, 'Standard Ticket C', 'Entry ticket (standard)', '标准包', 0.4),
    make(301, 'Pro Booster A', 'Enhanced drop chance', '进阶包', 1.9),
    make(302, 'Pro Booster B', 'Enhanced drop chance', '进阶包', 2.2),
    make(303, 'Pro Booster C', 'Enhanced drop chance', '进阶包', 2.5),
    make(401, 'Legend Relic A', 'Chase legendary vibes', '传奇包', 4.5),
    make(402, 'Legend Relic B', 'Chase legendary vibes', '传奇包', 5.2),
    make(403, 'Legend Relic C', 'Chase legendary vibes', '传奇包', 6.0),
    // more avatars / art
    make(501, 'Pixel Avatar #501', 'Fresh drop', '其他', 1.25),
    make(502, 'Pixel Avatar #502', 'Fresh drop', '其他', 1.35),
    make(503, 'Pixel Avatar #503', 'Fresh drop', '其他', 1.45),
    make(504, 'Pixel Avatar #504', 'Fresh drop', '其他', 1.55),
  ];

  return items;
}

function read(): MarketItem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as MarketItem[];
  } catch {}
  return initialItems();
}

let items: MarketItem[] = read();
const listeners: Set<Listener> = new Set();

function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  } catch {}
}

function emit() {
  listeners.forEach((l) => l(items));
}

export function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function getItems(): MarketItem[] {
  return items.slice();
}

export function addItem(input: Omit<MarketItem, 'id' | 'createdAt'>) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const item: MarketItem = { ...input, id, createdAt: Date.now() };
  items = [item, ...items];
  persist();
  emit();
  return item;
}
