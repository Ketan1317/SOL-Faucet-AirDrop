
"use client";

import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

import Header from "./components/Header";
import Wallet from "./components/Wallet";
import Form from "./components/Form";

const Page = () => {
  const endpoint = "https://api.devnet.solana.com";

  const wallets = useMemo(
    () => [new UnsafeBurnerWalletAdapter()],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <main className="relative isolate min-h-screen overflow-hidden bg-[#08080d] text-white selection:bg-purple-500/30">
            {/* Background lighting */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.17),transparent_65%)]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[500px] -z-10 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-purple-600/[0.06] blur-[100px]"
            />

            {/* Page content */}
            <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6">
              <Header />

              <div className="mt-8 sm:mt-10">
                <Wallet />
              </div>

              <section className="mt-8 flex-1 pb-12 sm:mt-10">
                <Form />
              </section>

              
            </div>
          </main>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default Page;
