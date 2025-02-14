'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useNFTMetadata, useTokenURI } from '../hooks/useNFTData';
import { NFTState } from '../types/nft';

const CONTRACT_ADDRESS = '0xD4538962b4166516f54fc13ccA1A1c3466ab18Ef';

interface NFTDisplayProps {
  tokenId: string;
  price: string;
  currency?: string;
}

export function NFTDisplay({ tokenId, price, currency = 'ETH' }: NFTDisplayProps) {
  console.log("tokenId: ", tokenId);
  const [isLoading, setIsLoading] = useState(true);
  const [nftState, setNftState] = useState<NFTState>({
    metadata: null,
    isLoading: false,
    error: null
  });
  const { uri, isLoading: isUriLoading } = useTokenURI(CONTRACT_ADDRESS, tokenId);
  const nftMetadata = useNFTMetadata(tokenId, uri);

  useEffect(() => {
    if (!isUriLoading && nftMetadata) {
      setNftState(nftMetadata);
      setIsLoading(false);
    }
  }, [nftMetadata, isUriLoading]);

  if (isLoading || isUriLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (nftState.error || !nftState.metadata) {
    return <div className="text-red-500">{nftState.error || 'Failed to load NFT'}</div>;
  }

  const { metadata } = nftState;

  // IPFSのURLをHTTPSに変換する関数
  const convertIPFStoHTTPS = (ipfsUrl: string) => {
    if (ipfsUrl.startsWith('ipfs://')) {
      const path = ipfsUrl.replace('ipfs://', '');
      return `https://ipfs.io/ipfs/${path}`;
    }
    return ipfsUrl;
  };

  // 画像URLを変換
  const imageUrl = convertIPFStoHTTPS(metadata.image);

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 rounded-lg bg-white/5 backdrop-blur-sm">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={metadata.name}
          fill
          className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>

      <div className="mt-4 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl text-white font-bold">{metadata.name}</h2>
          <div className="text-xl font-bold text-blue-500">
            {price} {currency}
          </div>
        </div>

        <p className="mt-2 text-gray-400 dark:text-gray-400">
          {metadata.description}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {metadata.attributes.map((attr) => (
            <div
              key={attr.trait_type}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {attr.trait_type}
              </p>
              <p className="font-medium">{attr.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}