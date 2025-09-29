import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

const Form = () => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const [msg, setMsg] = useState<React.ReactNode>("");
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const AmountRef = useRef<HTMLInputElement>(null);
  const AddressRef = useRef<HTMLInputElement>(null);

  const fetchBalance = async (address: string) => {
    try {
      const publicKey = new PublicKey(address);
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch {
      setBalance(0);
    }
  };

  const airDropFunc = async () => {
    setLoading(true);
    setMsg(""); // clear old msg

    if (!AmountRef.current || !AddressRef.current) {
      toast.error("Please enter all the fields");
      setLoading(false);
      return;
    }

    const walletAddress = AddressRef.current.value.trim();
    const amount = Number(AmountRef.current.value);

    if (!walletAddress) {
      toast.error("Please enter a valid wallet address");
      setLoading(false);
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      setLoading(false);
      return;
    }

    try {
      const publicKey = new PublicKey(walletAddress);

      const sign = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(sign, "confirmed");

      setMsg(
        `✅ Airdropped ${amount} SOL to: ${publicKey.toBase58()}
\n🔗 Signature: ${sign}`
      );

      // Update balance after airdrop
      fetchBalance(publicKey.toBase58());

      // Clear input for next request
      if (AmountRef.current) AmountRef.current.value = "";
    } catch (error: any) {
      toast.error(error.message || "Airdrop failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (AddressRef.current && wallet.publicKey) {
      const addr = wallet.publicKey.toBase58();
      AddressRef.current.value = addr;
      fetchBalance(addr); // load balance on connect
    }
  }, [wallet.publicKey]);

  return (
    <div className="flex flex-col mt-16 gap-4 w-[90%] max-w-md mx-auto">
      <span className="text-white">Balance: {balance.toFixed(2)} SOL</span>

      <input
        ref={AddressRef}
        type="text"
        placeholder="Enter your Wallet Address"
        className="p-2 text-white rounded bg-[#222]"
      />

      <div className="flex flex-col gap-2">
        <input
          ref={AmountRef}
          type="number"
          placeholder="Enter Faucet Amount"
          className="flex-1 p-2 text-white rounded bg-[#222]"
        />

        <button
          onClick={airDropFunc}
          disabled={loading}
          className={`py-3 mt-3 text-2xl text-white font-semibold rounded-xl transition 
            ${
              loading
                ? "bg-[#9A2EFF]/50 cursor-not-allowed opacity-60"
                : "bg-[#9A2EFF] hover:bg-purple-700 cursor-pointer"
            }`}
        >
          {loading ? "AirDropping..." : "Airdrop 🚀"}
        </button>
      </div>

      {msg && (
        <div className="p-2 text-white overflow-auto bg-gray-800 rounded break-words whitespace-pre-wrap">
          {msg}
        </div>
      )}
    </div>
  );
};

export default Form;
