import { Layout } from './components/Layout';
import { NFTGrid } from './components/NFTGrid';

export default function Home() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold text-center mb-12 text-white">
        World NFT Collection
      </h1>

      <NFTGrid/>
    </Layout>
  );
}
