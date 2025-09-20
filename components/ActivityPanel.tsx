import React from 'react';

const HeaderRow: React.FC = () => (
  <div className="px-3 py-2 grid grid-cols-4 gap-2 text-[11px] text-gray-500 border-b border-white/10">
    <div>ITEM</div>
    <div>PRICE</div>
    <div>SELLER</div>
    <div>BUYER</div>
  </div>
);

const Row: React.FC<{ t: string; price: string; seller: string; buyer: string }> = ({ t, price, seller, buyer }) => (
  <div className="px-3 py-2 grid grid-cols-4 gap-2 text-[12px] text-gray-300 border-b border-white/5">
    <div>{t}</div>
    <div className="text-gray-200">{price} APT</div>
    <div className="text-gray-400 truncate" title={seller}>{seller}</div>
    <div className="text-gray-400 truncate" title={buyer}>{buyer}</div>
  </div>
);

const ActivityPanel: React.FC = () => {
  const rows = Array.from({ length: 10 }, (_, i) => ({
    t: i === 0 ? '12h' : `${i}d`,
    price: (22 + i + Math.random()).toFixed(2),
    seller: `0x${(Math.random() * 1e16).toString(16).slice(0, 8)}`,
    buyer: `0x${(Math.random() * 1e16).toString(16).slice(0, 8)}`,
  }));

  return (
    <aside className="w-80 shrink-0 hidden xl:block">
      <div className="sticky top-6 border border-white/10">
        <div className="px-3 py-2 text-xs text-gray-400 uppercase border-b border-white/10">Activity</div>
        <HeaderRow />
        <div className="py-1">
          {rows.map((r, i) => (
            <Row key={i} t={r.t} price={r.price} seller={r.seller} buyer={r.buyer} />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default ActivityPanel;
