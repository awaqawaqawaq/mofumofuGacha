import React, { useEffect, useMemo, useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import PixelButton from './PixelButton';

// Lightweight connector UI that matches the project's button style
const WalletConnector: React.FC = () => {
  const { wallets, connect, disconnect, account, connected } = useWallet();
  const [selected, setSelected] = useState<string>('');

  const walletOptions = useMemo(() => wallets?.map((w) => w.name) ?? [], [wallets]);

  useEffect(() => {
    if (!selected && walletOptions.length > 0) setSelected(walletOptions[0]);
  }, [walletOptions, selected]);

  const shortAddr = useMemo(() => {
    const a = account?.address || '';
    return a ? `${a.slice(0, 8)}...${a.slice(-6)}` : '';
  }, [account?.address]);

  return (
    <div className="flex items-center gap-2">
      <div className="text-xs text-gray-300">
        Wallet: {connected ? shortAddr : 'Not connected'}
      </div>
      {!connected ? (
        <>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="bg-gray-800 text-white border-4 border-black px-2 py-2 text-xs"
          >
            {walletOptions.length === 0 ? (
              <option value="" disabled>No wallet detected</option>
            ) : (
              walletOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))
            )}
          </select>
          <PixelButton onClick={() => connect(selected)}>
            Connect Wallet
          </PixelButton>
        </>
      ) : (
        <PixelButton onClick={() => disconnect()}>Disconnect</PixelButton>
      )}
    </div>
  );
};

export default WalletConnector;

