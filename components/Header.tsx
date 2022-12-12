//uses web3uikit
import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div>
        Decentralized identity verification
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
