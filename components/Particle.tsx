import React, { useEffect, useState } from 'react';

interface ParticleProps {
  color: string;
  size: number;
}

const Particle: React.FC<ParticleProps> = ({ color, size }) => {
  const [style, setStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const angle = Math.random() * 360;
    const distance = 50 + Math.random() * 50;
    const duration = 0.5 + Math.random() * 0.5;

    // Initial state (centered)
    setStyle({
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderRadius: '50%',
      transform: 'translate(-50%, -50%) scale(1)',
      opacity: 1,
      transition: `transform ${duration}s ease-out, opacity ${duration}s ease-out`,
    });

    // Animate to final state
    const timeoutId = setTimeout(() => {
      setStyle(prev => ({
        ...prev,
        transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
        opacity: 0,
      }));
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [color, size]);

  return <div style={style} />;
};

export default Particle;
