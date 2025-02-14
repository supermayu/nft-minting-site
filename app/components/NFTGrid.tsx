'use client';

import Link from 'next/link';
import { NFTCard } from './NFTCard';

const MAX_SUPPLY = 12;

export function NFTGrid() {
  // 固定のNFT数を設定
  const totalNFTs = MAX_SUPPLY;
  
  // NFTの配列を生成（0からmaxSupply-1まで）
  const nftArray = Array.from({ length: totalNFTs }, (_, i) => i);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">World NFT Collection</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nftArray.map((tokenId) => (
          <Link key={tokenId} href={`/nft/${tokenId}`}>
            <NFTCard
              tokenId={tokenId.toString()}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}