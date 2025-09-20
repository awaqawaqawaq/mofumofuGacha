import React, { useEffect, useMemo, useState } from 'react';
import PixelButton from './PixelButton';
import { getItems, MarketItem, subscribe as subItems } from '../services/marketplaceStore';
import WalletConnector from './WalletConnector';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import FiltersSidebar from './FiltersSidebar';
import ActivityPanel from './ActivityPanel';

interface MarketplaceProps {
  onStartOpen: () => void;       // 进入开包页（需再点击）
  onStartOpenNow: () => void;    // 直接开包
  onListItem: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ onStartOpen, onStartOpenNow, onListItem }) => {
  const [tier, setTier] = useState<'all' | 'std' | 'pro' | 'leg' | 'other'>('all');
  const [query, setQuery] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'new' | 'priceAsc' | 'priceDesc'>('new');
  const [items, setItems] = useState<MarketItem[]>(getItems());
  const { connected } = useWallet();

  useEffect(() => {
    const off1 = subItems(setItems);
    return () => { off1(); };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : -Infinity;
    const max = maxPrice ? Number(maxPrice) : Infinity;
    const list = items.filter((it) => {
      if (it.id.startsWith('pk-')) return false; // 卡包在上方专区展示
      const tierOk = tier === 'all' ||
        (tier === 'std' && it.category === '标准包') ||
        (tier === 'pro' && it.category === '进阶包') ||
        (tier === 'leg' && it.category === '传奇包') ||
        (tier === 'other' && it.category === '其他');
      const qOk = q === '' || it.name.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q);
      const priceOk = it.priceApt >= min && it.priceApt <= max;
      return tierOk && qOk && priceOk;
    });
    switch (sortBy) {
      case 'priceAsc': return list.sort((a, b) => a.priceApt - b.priceApt);
      case 'priceDesc': return list.sort((a, b) => b.priceApt - a.priceApt);
      default: return list.sort((a, b) => b.createdAt - a.createdAt);
    }
  }, [items, tier, query, minPrice, maxPrice, sortBy]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* 集合头 */}
      <header className="flex items-center gap-3 py-6">
        <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-black">
          <img src="https://picsum.photos/seed/collection/80/80" alt="logo" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl text-white">Mofu Mofu Travelers</h1>
            <span className="w-3 h-3 rounded-full bg-sky-400 inline-block" title="verified" />
          </div>
          <div className="text-xs text-gray-400">Collection • Portfolio • Activity • Airdrop</div>
        </div>
      </header>

      {/* 统计栏 */}
      <div className="flex items-center overflow-x-auto border-4 border-black bg-gray-900/70 px-3 py-2 gap-6 mb-4">
        {[
          ['Floor Price', '17.489 APT'],
          ['Top Bid', '13 APT'],
          ['1D Change', '-0.01%'],
          ['7D Change', '-7.95%'],
          ['1D Volume', '45.57 APT'],
          ['7D Volume', '344.04 APT'],
          ['Owner', '2132 (38%)'],
          ['Listed/Supply', '51 / 5555'],
          ['Royalty', '5%'],
        ].map((s) => (
          <div key={s[0]} className="min-w-[110px]">
            <div className="text-[10px] text-gray-400 uppercase">{s[0]}</div>
            <div className="text-sm font-semibold">{s[1]}</div>
          </div>
        ))}
      </div>

      {/* Wallet + Listing (right aligned) */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex gap-2">
          <PixelButton onClick={onListItem}>List Item</PixelButton>
        </div>
        <div>
          <WalletConnector />
        </div>
      </div>


      {/* Packs section (highlighted) */}
      <section aria-labelledby="packs-heading" className="w-full mb-6">
        <div className="bg-gray-900/70 border-4 border-black p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 id="packs-heading" className="text-2xl text-yellow-300 [text-shadow:2px_2px_0_#000]">Packs</h2>
            <span className="text-[10px] text-gray-400">Choose a pack to start opening</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ id: 'pk-std', name: 'Standard Pack', desc: '5 random pixel cards', priceApt: 0 },
            { id: 'pk-pro', name: 'Pro Pack', desc: 'Higher rare chance', priceApt: 2 },
            { id: 'pk-leg', name: 'Legendary Pack', desc: 'Chase legendary odds', priceApt: 5 }].map(pack => (
              <div key={pack.id} className="bg-gray-800 border-4 border-black p-4 flex flex-col items-center text-center">
                <div className="w-32 h-24 bg-black border-2 border-gray-600 mb-3 flex items-center justify-center text-gray-400 text-xs">PACK</div>
                <h3 className="text-white text-lg mb-1">{pack.name}</h3>
                <p className="text-gray-400 text-[10px] mb-3">{pack.desc}</p>
                <div className="text-yellow-300 text-xs mb-4">{pack.priceApt === 0 ? 'FREE' : `${pack.priceApt} APT`}</div>
                {pack.id === 'pk-std' ? (
                  <PixelButton onClick={onStartOpen} className="w-full">Enter Opener</PixelButton>
                ) : (
                  <PixelButton onClick={() => { const res = pay('APT', pack.priceApt); if (!res.ok) return alert(res.error); alert(`Paid ${pack.priceApt} APT for ${pack.name}`); onStartOpenNow(); }} className="w-full">Buy & Open</PixelButton>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs + Token filter */}
      <div className="flex items-center gap-3 mb-4">
        {['Items', 'Bid', 'Holders'].map((t, i) => (
          <button key={t} className={`text-sm px-2 py-1 border-4 border-black ${i === 0 ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}>{t}</button>
        ))}
        <div className="flex-1" />
        <input placeholder="Token ID" className="bg-gray-800 text-white border-4 border-black px-3 py-2 text-xs w-44" />
      </div>

      {/* Global filter row (full width) */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-300">Filter:</label>
          <select value={tier} onChange={e => setTier(e.target.value as any)} className="bg-gray-800 text-white border-4 border-black px-3 py-2 text-xs">
            <option value="all">All</option>
            <option value="std">Standard Pack</option>
            <option value="pro">Pro Pack</option>
            <option value="leg">Legendary Pack</option>
            <option value="other">Other</option>
          </select>
        </div>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search name or description" className="flex-1 md:flex-none bg-gray-800 text-white border-4 border-black px-3 py-2 text-xs" />
        <div className="flex items-center gap-2">
          <input type="number" step="0.01" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Min Price" className="w-24 bg-gray-800 text-white border-4 border-black px-2 py-2 text-xs" />
          <span className="text-xs text-gray-400">-</span>
          <input type="number" step="0.01" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Max Price" className="w-24 bg-gray-800 text-white border-4 border-black px-2 py-2 text-xs" />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-300">Sort:</label>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-gray-800 text-white border-4 border-black px-3 py-2 text-xs">
            <option value="new">Newest</option>
            <option value="priceAsc">Price Low → High</option>
            <option value="priceDesc">Price High → Low</option>
          </select>
        </div>
      </div>

      {/* Three-column layout (previous version) */}
      <div className="grid grid-cols-1 xl:[grid-template-columns:16rem_minmax(0,1fr)_20rem] gap-6 items-start">
        <FiltersSidebar />
        <section className="flex-1 min-w-0">

          {/* Items grid */}
          <section aria-labelledby="market-heading" className="w-full mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 id="market-heading" className="text-2xl text-cyan-300 [text-shadow:2px_2px_0_#000]">Marketplace</h2>
              <span className="text-[10px] text-gray-400">Combine filters, search and sort</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filtered.map(item => (
                <div key={item.id} className="bg-gray-800 border-4 border-black p-4 flex flex-col items-center text-center">
                  <div className="w-32 h-24 bg-black border-2 border-gray-600 mb-3 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>NO IMAGE</span>
                    )}
                  </div>
                  <h3 className="text-white text-lg mb-1">{item.name}</h3>
                  <p className="text-gray-400 text-[10px] mb-2">{item.desc}</p>
                  <div className="text-yellow-300 text-xs mb-2">{item.priceApt} APT</div>
                  <div className="text-gray-500 text-[10px] mb-3">Category: {({ '标准包': 'Standard Pack', '进阶包': 'Pro Pack', '传奇包': 'Legendary Pack', '其他': 'Other' } as Record<string, string>)[item.category] || item.category}</div>
                  <PixelButton
                    onClick={() => {
                      if (!connected) {
                        alert('请先连接 Aptos 钱包');
                        return;
                      }
                      // 这里仅做演示：真实支付需集成 Aptos SDK 的交易提交
                      alert(`Ready to purchase ${item.name} for ${item.priceApt} APT (demo)`);
                    }}
                    className="w-full"
                  >
                    Buy
                  </PixelButton>
                </div>
              ))}
            </div>
          </section>
        </section>
        <ActivityPanel />
      </div>

      <footer className="w-full text-center text-gray-400 text-xs mt-6">Tip: Packs on top — Standard needs one more click in opener; Pro/Legendary buy then open automatically. Other items use APT Mock payments.</footer>
    </div>
  );
};

export default Marketplace;
