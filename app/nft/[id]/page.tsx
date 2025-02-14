import { Layout } from '../../components/Layout';
import { NFTDisplay } from '../../components/NFTDisplay';
import { MintingInterface } from '../../components/MintingInterface';
import * as React from 'react'

const CONTRACT_ADDRESS = '0xD4538962b4166516f54fc13ccA1A1c3466ab18Ef';
const MINT_PRICE = "0.01";
const MAX_SUPPLY = 12;

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
            maxSupply={MAX_SUPPLY}
            mintPrice={MINT_PRICE}
            contractAddress={CONTRACT_ADDRESS}
            maxPerTransaction={5}
          />
        </div>
      </div>
    </Layout>
  );
}