'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useNFTMetadata, useTokenURI } from '../hooks/useNFTData';
import { NFTState } from '../types/nft';
import { useCallback } from 'react';

const MINT_PRICE = "0.01"; // ETH
const CONTRACT_ADDRESS = '0xD4538962b4166516f54fc13ccA1A1c3466ab18Ef';

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

  const [nftState, setNftState] = useState<NFTState>({
    metadata: null,
    isLoading: false,
    error: null
  });
  const { uri, isLoading: isUriLoading } = useTokenURI(CONTRACT_ADDRESS, tokenId)
  const nftMetadata = useNFTMetadata(tokenId, uri);

  const convertIPFStoHTTPS = useCallback((ipfsUrl: string, gatewayIndex: number) => {
    if (ipfsUrl.startsWith('ipfs://')) {
      const path = ipfsUrl.replace('ipfs://', '');
      return `${IPFS_GATEWAYS[gatewayIndex]}${path}`;
    }
    return ipfsUrl;
  }, []);

  useEffect(() => {
    if (!isUriLoading && nftMetadata) {
      setNftState(nftMetadata);
      setIsLoading(false);

      if (nftMetadata.metadata?.image) {
        const newUrl = convertIPFStoHTTPS(nftMetadata.metadata.image, currentGatewayIndex);
        setCurrentImageUrl(newUrl);
        console.log('Setting initial image URL:', newUrl);
      }
    }
  }, [nftMetadata, isUriLoading, convertIPFStoHTTPS, currentGatewayIndex]);

  const handleImageError = useCallback(() => {
    console.log('Image error occurred with gateway index:', currentGatewayIndex);

    if (currentGatewayIndex < IPFS_GATEWAYS.length - 1) {
      const nextGatewayIndex = currentGatewayIndex + 1;
      setCurrentGatewayIndex(nextGatewayIndex);

      if (nftState.metadata?.image) {
        const newUrl = convertIPFStoHTTPS(nftState.metadata.image, nextGatewayIndex);
        setCurrentImageUrl(newUrl);
        console.log('Trying next gateway URL:', newUrl);
      }

      setImageError(false);
    } else {
      console.log('All gateways failed');
      setImageError(true);
    }
  }, [currentGatewayIndex, nftState.metadata?.image, convertIPFStoHTTPS]);

  if (isLoading || isUriLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (nftState.error || !nftState.metadata) {
    return <div className="text-red-500">{nftState.error || 'Failed to load NFT'}</div>;
  }

  const { metadata } = nftState;

  return (
    <div className="rounded-lg overflow-hidden bg-gray-800 hover:shadow-xl transition-shadow">
      <div className="relative w-full" style={{ paddingTop: '66.67%' }}>
        <Image
          key={currentImageUrl} // URLが変更されたときに強制的に再レンダリング
          src={currentImageUrl}
          alt={metadata.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-contain transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
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