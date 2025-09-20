import React from 'react';

interface PixelButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const PixelButton: React.FC<PixelButtonProps> = ({ onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-200 text-black border-4 border-b-8 border-r-8 border-black px-6 py-3 transition-all duration-100 ease-in-out hover:bg-gray-300 hover:translate-x-1 hover:translate-y-1 hover:border-b-4 hover:border-r-4 active:bg-yellow-300 ${className}`}
    >
      {children}
    </button>
  );
};

export default PixelButton;
