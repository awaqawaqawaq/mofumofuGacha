import React from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Network } from '@aptos-labs/ts-sdk';

type Props = { children: React.ReactNode };

// Minimal provider setup using Wallet Standard so popular wallets can connect
const WalletProvider: React.FC<Props> = ({ children }) => {
  const plugins: any[] = [];

  return (
    <AptosWalletAdapterProvider
      plugins={plugins}
      autoConnect={false}
      dappConfig={{ network: Network.TESTNET }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export default WalletProvider;
