'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useNFTMetadata, useTokenURI } from '../hooks/useNFTData';

interface NFTDisplayProps {
  tokenId: string;
  price: string;
  currency?: string;
}

export function NFTDisplay({ tokenId, price, currency = 'ETH' }: NFTDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { uri, isLoading: isUriLoading } = useTokenURI(tokenId);
  const { metadata, isLoading: isMetadataLoading, error } = useNFTMetadata(tokenId, uri);

  useEffect(() => {
    if (!isUriLoading && !isMetadataLoading) {
      setIsLoading(false);
    }
  }, [isUriLoading, isMetadataLoading]);

  if (isLoading || isUriLoading || isMetadataLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (error || !metadata) {
    return <div className="text-red-500">{error || 'Failed to load NFT'}</div>;
  }

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