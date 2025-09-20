import React, { useEffect, useState } from 'react';
import PixelButton from './PixelButton';
import { addItem, ItemCategory } from '../services/marketplaceStore';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

interface ListItemProps {
  onBack: () => void;
}

const categories: ItemCategory[] = ['标准包', '进阶包', '传奇包', '其他'];

const ListItem: React.FC<ListItemProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<ItemCategory>('其他');
  const [priceApt, setPriceApt] = useState('1');
  const [image, setImage] = useState('');
  const [seller, setSeller] = useState<string | undefined>(undefined);
  const { account } = useWallet();

  useEffect(() => {
    setSeller(account?.address ?? undefined);
  }, [account?.address]);

  const canSubmit = name.trim() !== '' && desc.trim() !== '' && Number(priceApt) >= 0;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-3xl text-yellow-400 [text-shadow:3px_3px_0_#000] mb-6">List Item</h2>
      <div className="bg-gray-800 border-4 border-black p-4 grid grid-cols-1 gap-4">
        <label className="text-xs text-gray-300">
          Name
          <input className="block w-full mt-2 bg-gray-900 text-white border-2 border-black p-2 text-xs" value={name} onChange={e => setName(e.target.value)} />
        </label>
        <label className="text-xs text-gray-300">
          Description
          <textarea className="block w-full mt-2 bg-gray-900 text-white border-2 border-black p-2 text-xs" rows={3} value={desc} onChange={e => setDesc(e.target.value)} />
        </label>
        <div className="flex flex-col md:flex-row gap-4">
          <label className="text-xs text-gray-300 flex-1">
            Category
            <select className="block w-full mt-2 bg-gray-900 text-white border-2 border-black p-2 text-xs" value={category} onChange={e => setCategory(e.target.value as ItemCategory)}>
              {categories.map(c => (
                <option key={c} value={c}>{({ '标准包':'Standard Pack','进阶包':'Pro Pack','传奇包':'Legendary Pack','其他':'Other'} as Record<string,string>)[c] || c}</option>
              ))}
            </select>
          </label>
          <label className="text-xs text-gray-300 w-40">
            Price (APT)
            <input type="number" step="0.01" className="block w-full mt-2 bg-gray-900 text-white border-2 border-black p-2 text-xs" value={priceApt} onChange={e => setPriceApt(e.target.value)} />
          </label>
        </div>
        <label className="text-xs text-gray-300">
          Image URL (optional)
          <input className="block w-full mt-2 bg-gray-900 text-white border-2 border-black p-2 text-xs" value={image} onChange={e => setImage(e.target.value)} />
        </label>
        <div className="text-xs text-gray-400">Seller: {seller ?? 'Not connected'}</div>
        <div className="flex gap-4">
          <PixelButton
            onClick={() => {
              if (!canSubmit) return;
              const item = addItem({
                name: name.trim(),
                desc: desc.trim(),
                category,
                priceApt: Number(priceApt),
                image: image.trim() || undefined,
                seller,
              });
              alert('Listed: ' + item.name);
              onBack();
            }}
            className={canSubmit ? '' : 'opacity-60 pointer-events-none'}
          >
            Publish
          </PixelButton>
          <PixelButton onClick={onBack}>Back</PixelButton>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
