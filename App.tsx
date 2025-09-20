import React, { useState, useEffect, useCallback } from 'react';
import CardPack from './components/CardPack';
import RevealedCard from './components/RevealedCard';
import PixelButton from './components/PixelButton';
import Marketplace from './components/Marketplace';
import ListItem from './components/ListItem';
import { openPack } from './services/cardService';
import type { CardData } from './types';

enum GameState {
  Idle,
  Opening,
  Revealing,
  Done,
}

enum ViewState {
  Marketplace,
  Opener,
  ListItem,
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.Marketplace);
  const [gameState, setGameState] = useState<GameState>(GameState.Idle);
  const [packCards, setPackCards] = useState<CardData[]>([]);
  const [flippedStates, setFlippedStates] = useState<boolean[]>([]);
  const [cardsAnimating, setCardsAnimating] = useState(false);

  const handleOpenPack = useCallback(() => {
    if (gameState !== GameState.Idle) return;
    setGameState(GameState.Opening);
    const newCards = openPack();

    setTimeout(() => {
      setPackCards(newCards);
      // 初始化为全部未翻开，后续自动依次翻开
      setFlippedStates(new Array(newCards.length).fill(false));
      setGameState(GameState.Revealing);
    }, 600); // 保留轻微的抖动时间
  }, [gameState]);

  // 市场页点击后，仅进入抽卡页；需要再点击一次卡包才开包
  const goToOpenerAndOpen = () => {
    setPackCards([]);
    setFlippedStates([]);
    setCardsAnimating(false);
    setGameState(GameState.Idle);
    setView(ViewState.Opener);
  };

  // 直接进入并立即开包（用于购买高级卡包后）
  const goToOpenerAndOpenNow = () => {
    setPackCards([]);
    setFlippedStates([]);
    setCardsAnimating(false);
    setGameState(GameState.Idle);
    setView(ViewState.Opener);
    setTimeout(() => handleOpenPack(), 0);
  };

  // 进入揭示阶段后，自动依次翻开所有卡片（无需点击）
  useEffect(() => {
    if (gameState === GameState.Revealing && flippedStates.length > 0) {
      setCardsAnimating(true);
      flippedStates.forEach((_, idx) => {
        setTimeout(() => {
          setFlippedStates(prev => {
            const next = [...prev];
            next[idx] = true;
            return next;
          });
        }, 150 * idx);
      });
    }
  }, [gameState, flippedStates.length]);

  // 全部翻开后，进入完成态
  useEffect(() => {
    if (gameState === GameState.Revealing && flippedStates.length > 0 && flippedStates.every(f => f)) {
      const t = setTimeout(() => setGameState(GameState.Done), 300);
      return () => clearTimeout(t);
    }
  }, [flippedStates, gameState]);

  const handleReset = () => {
    setPackCards([]);
    setFlippedStates([]);
    setCardsAnimating(false);
    setGameState(GameState.Idle);
    setView(ViewState.Marketplace);
  };

  const renderOpener = () => {
    switch (gameState) {
      case GameState.Idle:
      case GameState.Opening:
        return (
          <div className="flex flex-col items-center">
            <h1 className="text-4xl text-yellow-400 mb-8 [text-shadow:4px_4px_0_#000]">Pixel Pack Opener</h1>
            <CardPack onClick={handleOpenPack} isOpening={gameState === GameState.Opening} />
          </div>
        );
      case GameState.Revealing:
      case GameState.Done:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl text-white mb-8 [text-shadow:2px_2px_0_#000]">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
              {packCards.map((card, index) => (
                <div
                  key={card.id + '-' + index}
                  className="transition-all duration-700 ease-out"
                  style={{
                    transform: cardsAnimating ? 'translateY(0) scale(1)' : 'translateY(100px) scale(0.9)',
                    opacity: cardsAnimating ? 1 : 0,
                    transitionDelay: `${index * 120}ms`
                  }}
                >
                  <RevealedCard 
                    card={card} 
                    isFlipped={flippedStates[index]} 
                    onFlip={() => { /* 自动翻开，无需点击 */ }} 
                  />
                </div>
              ))}
            </div>
            {gameState === GameState.Done && (
              <div className="flex gap-4">
                <PixelButton onClick={handleReset}>Return</PixelButton>
                <PixelButton onClick={() => {
                  // 连续抽一包
                  setGameState(GameState.Idle);
                  setTimeout(() => handleOpenPack(), 0);
                }}>Again</PixelButton>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px] text-white flex flex-col items-center justify-center p-4 overflow-hidden">
      {view === ViewState.Marketplace && (
        <Marketplace onStartOpen={goToOpenerAndOpen} onStartOpenNow={goToOpenerAndOpenNow} onListItem={() => setView(ViewState.ListItem)} />
      )}
      {view === ViewState.Opener && renderOpener()}
      {view === ViewState.ListItem && (
        <div className="w-full">
          <ListItem onBack={() => setView(ViewState.Marketplace)} />
        </div>
      )}
    </main>
  );
};

export default App;
