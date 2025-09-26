import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";

const Form = () => {
  const wallet = useWallet();
  // useWallet → gives access to the connected wallet (publicKey, connect, disconnect)
  const { connection } = useConnection();
  // useConnection → gives access to the current Solana connection (RPC node)

  const [msg, setMsg] = useState<React.ReactNode>("");
  const [balance, setBalance] = useState<number>(); // user’s balance (in SOL)
  const [loading, setLoading] = useState<boolean>(false);

  const AmountRef = useRef<HTMLInputElement>(null); //points to the amount input
  const AddressRef = useRef<HTMLInputElement>(null); // points to wallet adddress

  const airDropFunc = async () => {
    setLoading(true);
    if (!AmountRef.current || !AddressRef.current) {
      toast.error("Please enter all the fields");
      return;
    }

    const walletAdress = AddressRef.current.value.trim();
    const amount = Number(AmountRef.current.value);

    if (!walletAdress) {
      toast.error("Please enter a valid wallet address");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    try {
      const publicKey = new PublicKey(walletAdress); // Convert address string → PublicKey
      const bal = await connection.getBalance(publicKey); // fetch balance
      setBalance(bal / LAMPORTS_PER_SOL); // converted from lamports → SOL

      const sign = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      ); // Request airdrop
      await connection.confirmTransaction(sign, "confirmed"); // confirm for transaction

      setMsg(
        `Airdropped ${amount} SOL to: ${publicKey.toBase58()}
   \nSignature: ${sign}`
      );
    } catch (error) {
      toast.error("Error: " + String(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (AddressRef.current && wallet.publicKey) {
      AddressRef.current.value = wallet.publicKey.toBase58(); // If user connects wallet → automatically fill wallet address input
    }
  }, [wallet.publicKey]);

  return (
    <div className="flex flex-col mt-16 gap-4 w-[90%] max-w-md mx-auto">
      <span className="text-white">Balance: {balance ?? 0} SOL</span>
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
          className=" py-3 mt-3 text-2xl text-white cursor-pointer font-semibold rounded-xl bg-[#9A2EFF] hover:bg-purple-700"
        >
          {loading ? "AirDropping" : "Airdrop 🚀"}
        </button>
      </div>
      {msg && (
        <div className="p-2 text-white bg-gray-800 rounded whitespace-pre-wrap">
          {msg}
        </div>
      )}
    </div>
  );
};

export default Form;
