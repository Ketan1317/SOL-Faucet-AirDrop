import { WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

const Wallet = () => {
  return (
    <div className="flex gap-3 text-white mt-12 justify-center mb-6">
      <WalletMultiButton />
      <WalletDisconnectButton />
    </div>
  )
}

export default Wallet