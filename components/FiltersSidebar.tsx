import React from 'react';

const Section: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="border border-white/10">
    <div className="px-3 py-2 text-xs text-gray-400 uppercase border-b border-white/10">{title}</div>
    <div className="p-3 text-sm text-gray-300 space-y-2">
      {items.map((i) => (
        <label key={i} className="flex items-center gap-2">
          <input type="checkbox" className="accent-purple-500" />
          <span>{i}</span>
        </label>
      ))}
    </div>
  </div>
);

const FiltersSidebar: React.FC = () => {
  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-6 space-y-4">
        <Section title="Status" items={["Show All", "Only Listed"]} />
        <Section title="Rarity" items={["Common", "Rare", "Epic", "Legendary"]} />
        <Section title="Price" items={["0 - 5", "5 - 10", "10 - 20", "> 20"]} />
        <Section title="Marketplace" items={["Primary", "Secondary"]} />
        <div className="text-xs text-gray-500 px-1">Attributes</div>
      </div>
    </aside>
  );
};

export default FiltersSidebar;
