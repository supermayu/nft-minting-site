'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useNFTMetadata, useTokenURI } from '../hooks/useNFTData';
import { useCallback } from 'react';

const MINT_PRICE = "0"; // ETH

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
];

interface NFTCardProps {
  tokenId: string;
}

export function NFTCard({ tokenId }: NFTCardProps) {
  const [imageError, setImageError] = useState(false);
  const [currentGatewayIndex, setCurrentGatewayIndex] = useState(0);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const { uri, isLoading: isUriLoading } = useTokenURI(tokenId);
  const { metadata, isLoading: isMetadataLoading, error } = useNFTMetadata(tokenId, uri);

  const convertIPFStoHTTPS = useCallback((ipfsUrl: string, gatewayIndex: number) => {
    if (ipfsUrl.startsWith('ipfs://')) {
      const path = ipfsUrl.replace('ipfs://', '');
      return `${IPFS_GATEWAYS[gatewayIndex]}${path}`;
    }
    return ipfsUrl;
  }, []);

  useEffect(() => {
    if (!isUriLoading && !isMetadataLoading && metadata?.image) {
      const newUrl = convertIPFStoHTTPS(metadata.image, currentGatewayIndex);
      setCurrentImageUrl(newUrl);
      setIsLoading(false);
    }
  }, [isUriLoading, isMetadataLoading, metadata, convertIPFStoHTTPS, currentGatewayIndex]);

  useEffect(() => {
    if (imageError && currentGatewayIndex < IPFS_GATEWAYS.length - 1 && metadata?.image) {
      const nextGatewayIndex = currentGatewayIndex + 1;
      setCurrentGatewayIndex(nextGatewayIndex);
      const newUrl = convertIPFStoHTTPS(metadata.image, nextGatewayIndex);
      setCurrentImageUrl(newUrl);
      setImageError(false);
    }
  }, [imageError, currentGatewayIndex, metadata?.image, convertIPFStoHTTPS]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  if (isLoading || isUriLoading || isMetadataLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (error || !metadata) {
    return <div className="text-red-500">{error || 'Failed to load NFT'}</div>;
  }

  return (
    <div className="rounded-lg overflow-hidden bg-gray-800 hover:shadow-xl transition-shadow">
      <div className="relative w-full" style={{ paddingTop: '66.67%' }}>
        <Image
          key={currentImageUrl}
          src={currentImageUrl}
          alt={metadata.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-contain transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onError={handleImageError}
          onLoadingComplete={() => setIsLoading(false)}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg text-white font-semibold">{metadata.name}</h3>
        <p className="text-sm text-gray-400">{MINT_PRICE} ETH</p>
      </div>
    </div>
  );
}