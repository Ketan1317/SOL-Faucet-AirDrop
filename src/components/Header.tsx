
const Header = () => {
  return (
    <header className="mx-auto w-full max-w-4xl px-5 pt-14 text-center sm:pt-20">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/[0.08] px-4 py-2 text-xs font-medium tracking-wide text-purple-200">
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
        SOLANA DEVELOPMENT NETWORK
      </div>

      <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
        Build on Solana.
        <span className="mt-2 block bg-gradient-to-r from-violet-300 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
          Start with free SOL.
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base sm:leading-8">
        Get test SOL for your next Solana project. Fund a wallet, test
        transactions, and experiment with on-chain programs — all on Devnet,
        with no real funds required.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-400 sm:text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="text-emerald-400">✓</span>
          Free test tokens
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="text-emerald-400">✓</span>
          Direct to your wallet
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="text-emerald-400">✓</span>
          Devnet only
        </span>
      </div>
    </header>
  );
};

export default Header;
