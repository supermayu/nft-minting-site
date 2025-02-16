import { Layout } from '../../components/Layout';
import { NFTDisplay } from '../../components/NFTDisplay';
import { MintingInterface } from '../../components/MintingInterface';
import * as React from 'react'

const MINT_PRICE = "0";

type PageParams = {
  id: string;
}

export default async function NFTPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
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