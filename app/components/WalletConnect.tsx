import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletConnect() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ConnectButton 
        chainStatus="icon"
        showBalance={false}
        accountStatus="address"
      />
    </div>
  );
}