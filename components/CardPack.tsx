import React from 'react';

interface CardPackProps {
  onClick: () => void;
  isOpening: boolean;
}

const CardPack: React.FC<CardPackProps> = ({ onClick, isOpening }) => {
  return (
    <div className="flex flex-col items-center justify-center cursor-pointer group" onClick={onClick}>
       <div 
        className={`relative transition-transform duration-300 w-64 h-80 ${isOpening ? 'animate-shake' : 'group-hover:scale-105'}`}
        style={{ perspective: '1000px' }}
      >
        <div className="absolute w-full h-full bg-gray-700 border-4 border-black p-4 flex flex-col items-center justify-center text-center">
            <div className="w-48 h-48 border-4 border-black bg-purple-900 flex items-center justify-center">
                <div className="text-yellow-400 text-6xl font-black">?</div>
            </div>
            <h2 className="text-white text-2xl mt-4">CARD PACK</h2>
            <p className="text-gray-400 text-xs mt-2">Click to Open</p>
        </div>
      </div>
    </div>
  );
};

export default CardPack;
