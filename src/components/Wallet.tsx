
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

import "@solana/wallet-adapter-react-ui/styles.css";

const Wallet = () => {
  return (
    <section className="mx-auto mt-9 w-full max-w-xl px-4">
      <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:flex-row">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-5 w-5 text-purple-300"
            >
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="M3 9h18" />
              <path d="M16 14h2" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Your wallet
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              Connect to autofill your address
            </p>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:w-auto sm:justify-end">
          <WalletMultiButton className="!h-11 !rounded-xl !bg-purple-600 !px-4 !text-sm !font-semibold !text-white hover:!bg-purple-500" />

          <WalletDisconnectButton className="!h-11 !rounded-xl !border !border-white/10 !bg-white/5 !px-3 !text-sm !text-gray-300 hover:!bg-white/10" />
        </div>
      </div>
    </section>
  );
};

export default Wallet;
