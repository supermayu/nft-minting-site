'use client';

import Link from 'next/link';
import { NFTCard } from './NFTCard';

const MAX_SUPPLY = 12;

export function NFTGrid() {
  const totalNFTs = MAX_SUPPLY;
  const nftArray = Array.from({ length: totalNFTs }, (_, i) => i);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">World NFT Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nftArray.map((tokenId) => (
          <Link 
            key={tokenId} 
            href={`/nft/${tokenId}`}
            className="transform transition-transform hover:scale-105 cursor-pointer"
          >
            <div className="h-full">
              <NFTCard
                tokenId={tokenId.toString()}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}