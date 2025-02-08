import { WalletConnect } from './WalletConnect';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-black">
      <header className="relative w-full py-4 px-6">
        <WalletConnect />
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="w-full py-6 px-4 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto text-center text-gray-400">
          <p>© {new Date().getFullYear()} NFT Collection. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}