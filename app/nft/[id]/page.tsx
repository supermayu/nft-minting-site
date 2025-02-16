import { Layout } from '../../components/Layout';
import { NFTDisplay } from '../../components/NFTDisplay';
import { MintingInterface } from '../../components/MintingInterface';
import * as React from 'react'

const MINT_PRICE = "0";

interface Params {
  id: string;
}

export default async function NFTPage({ params }: { params: Params }) {
  const { id } = await params;

  return (
    <Layout>
      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <NFTDisplay
          tokenId={id}
          price={MINT_PRICE}
          currency="ETH"
        />

        <div className="flex flex-col justify-center">
          <MintingInterface
            mintPrice={MINT_PRICE}
            maxPerTransaction={3}
            tokenId={id}
          />
        </div>
      </div>
    </Layout>
  );
}