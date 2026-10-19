
import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { toast } from "react-toastify";

const Form = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("1");
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  const fetchBalance = useCallback(
    async (walletAddress: string) => {
      try {
        setBalanceLoading(true);
        const publicKey = new PublicKey(walletAddress);
        const lamports = await connection.getBalance(publicKey, "confirmed");
        setBalance(lamports / LAMPORTS_PER_SOL);
      } catch {
        setBalance(null);
      } finally {
        setBalanceLoading(false);
      }
    },
    [connection]
  );

  useEffect(() => {
    if (wallet.publicKey) {
      setAddress(wallet.publicKey.toBase58());
      fetchBalance(wallet.publicKey.toBase58());
    } else {
      setBalance(null);
    }
  }, [wallet.publicKey, fetchBalance]);

  const validate = () => {
    setError("");

    if (!address.trim()) {
      setError("Enter a recipient wallet address.");
      return null;
    }

    let publicKey: PublicKey;

    try {
      publicKey = new PublicKey(address.trim());
    } catch {
      setError("That wallet address is invalid. Check it and try again.");
      return null;
    }

    const solAmount = Number(amount);

    if (!amount.trim() || !Number.isFinite(solAmount) || solAmount <= 0) {
      setError("Enter an amount greater than 0 SOL.");
      return null;
    }

    const lamports = solAmount * LAMPORTS_PER_SOL;

    if (!Number.isSafeInteger(lamports) || lamports < 1) {
      setError("Enter a valid SOL amount with up to 9 decimal places.");
      return null;
    }

    return { publicKey, lamports, solAmount };
  };

  const handleAirdrop = async () => {
    const result = validate();
    if (!result) return;

    setLoading(true);
    setSignature("");

    try {
      const { publicKey, lamports, solAmount } = result;

      const txSignature = await connection.requestAirdrop(
        publicKey,
        lamports
      );

      const latestBlockhash = await connection.getLatestBlockhash("confirmed");

      const confirmation = await connection.confirmTransaction(
        {
          signature: txSignature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        "confirmed"
      );

      if (confirmation.value.err) {
        throw new Error("The transaction failed on the network.");
      }

      setSignature(txSignature);
      toast.success(`${solAmount} SOL successfully requested!`);

      await fetchBalance(publicKey.toBase58());
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const copySignature = async () => {
    try {
      await navigator.clipboard.writeText(signature);
      toast.success("Transaction signature copied!");
    } catch {
      toast.error("Unable to copy. Please select the signature manually.");
    }
  };

  const explorerUrl = signature
    ? `https://explorer.solana.com/tx/${signature}?cluster=devnet`
    : "";

  return (
    <section className="w-full max-w-xl mx-auto px-4">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101019] shadow-2xl shadow-purple-950/20">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-600 via-fuchsia-400 to-violet-600" />

        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10 text-2xl">
                ◎
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Request test SOL
                </h2>
                <p className="mt-0.5 text-sm text-gray-400">
                  Free tokens for development
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              ● Devnet
            </span>
          </div>

          <div className="mt-7 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-gray-400">Recipient balance</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    {balanceLoading
                      ? "..."
                      : balance === null
                        ? "—"
                        : balance.toLocaleString("en-US", {
                            maximumFractionDigits: 4,
                          })}
                  </span>
                  <span className="text-sm font-medium text-gray-400">
                    SOL
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => address.trim() && fetchBalance(address.trim())}
                disabled={balanceLoading || !address.trim()}
                aria-label="Refresh recipient balance"
                title="Refresh balance"
                className="rounded-xl border border-white/10 p-2.5 text-gray-300 transition hover:border-purple-400/40 hover:bg-purple-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className={`h-4 w-4 ${balanceLoading ? "animate-spin" : ""}`}
                >
                  <path
                    d="M20 7v5h-5M4 17v-5h5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.6 9A7 7 0 0 1 18 6l2 1M4 17l2 1a7 7 0 0 0 12.4-3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <p className="mt-3 text-xs leading-5 text-gray-500">
              Balance is shown for the recipient address on Solana Devnet.
            </p>
          </div>

          <div className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="recipient-address"
                className="mb-2 block text-sm font-medium text-gray-200"
              >
                Recipient address
              </label>

              <input
                id="recipient-address"
                type="text"
                value={address}
                onChange={(event) => {
                  setAddress(event.target.value);
                  setError("");
                  setSignature("");
                  setBalance(null);
                }}
                placeholder="Paste a Solana wallet address"
                autoComplete="off"
                spellCheck={false}
                className="w-full rounded-xl border border-white/10 bg-[#090910] px-4 py-3.5 font-mono text-sm text-white outline-none transition placeholder:font-sans placeholder:text-gray-600 focus:border-purple-400/70 focus:ring-4 focus:ring-purple-500/10"
              />

              {wallet.publicKey && (
                <button
                  type="button"
                  onClick={() => {
                    setAddress(wallet.publicKey!.toBase58());
                    setError("");
                    setSignature("");
                    fetchBalance(wallet.publicKey!.toBase58());
                  }}
                  className="mt-2 text-xs font-medium text-purple-300 transition hover:text-purple-200"
                >
                  Use connected wallet
                </button>
              )}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="faucet-amount"
                  className="text-sm font-medium text-gray-200"
                >
                  Amount
                </label>
                <span className="text-xs text-gray-500">
                  Denominated in SOL
                </span>
              </div>

              <div className="relative">
                <input
                  id="faucet-amount"
                  type="number"
                  min="0.000000001"
                  step="0.1"
                  inputMode="decimal"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !loading) {
                      void handleAirdrop();
                    }
                  }}
                  placeholder="Enter amount"
                  className="w-full rounded-xl border border-white/10 bg-[#090910] py-4 pl-4 pr-16 text-xl font-semibold text-white outline-none transition placeholder:text-gray-600 focus:border-purple-400/70 focus:ring-4 focus:ring-purple-500/10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
                  SOL
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {[0.1, 0.5, 1, 2].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setAmount(String(value));
                      setError("");
                    }}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                      amount === String(value)
                        ? "border-purple-400/50 bg-purple-500/15 text-purple-200"
                        : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {value} SOL
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300"
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={() => void handleAirdrop()}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4 font-semibold text-white shadow-lg shadow-purple-900/25 transition duration-200 hover:from-violet-500 hover:to-purple-500 hover:shadow-purple-900/40 focus:outline-none focus:ring-4 focus:ring-purple-400/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Requesting SOL...
                </>
              ) : (
                <>
                  Request test SOL
                  <span aria-hidden="true">↗</span>
                </>
              )}
            </button>

            {!wallet.publicKey && (
              <p className="text-center text-xs leading-5 text-gray-500">
                You can request SOL for any valid address, even without
                connecting a wallet.
              </p>
            )}
          </div>

          {signature && (
            <div
              role="status"
              className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] p-4"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
                <span aria-hidden="true">✓</span>
                Airdrop confirmed
              </div>

              <p className="mt-1 text-xs text-gray-400">
                Your transaction was confirmed on Solana Devnet.
              </p>

              <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="mb-2 text-xs text-gray-500">
                  Transaction signature
                </p>
                <p className="break-all font-mono text-xs leading-5 text-gray-300">
                  {signature}
                </p>

                <button
                  type="button"
                  onClick={() => void copySignature()}
                  className="mt-3 text-xs font-semibold text-purple-300 transition hover:text-purple-200"
                >
                  Copy signature
                </button>
              </div>

              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
              >
                View on Solana Explorer <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}
        </div>

        <div className="border-t border-white/[0.07] px-6 py-4 sm:px-8">
          <p className="text-center text-xs leading-5 text-gray-500">
            Devnet SOL has no real-world monetary value. Requests are subject
            to Solana Devnet faucet and RPC limits.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Form;
