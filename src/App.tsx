import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";

import Headers from "./components/Header";
import Wallet from "./components/Wallet";
import Form from "./components/Form";

const page = () => {
  const wallets = [new UnsafeBurnerWalletAdapter()]; // An array of wallet adapters that the Site supports
  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Headers />
          <Wallet />
          <Form />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default page;
