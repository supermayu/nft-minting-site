'use client';

import { useState } from 'react';
import Image from 'next/image';
import { NFTMetadata } from '../types/nft';

interface NFTDisplayProps {
  metadata: NFTMetadata;
  price: string;
  currency?: string;
}

export function NFTDisplay({ metadata, price, currency = 'ETH' }: NFTDisplayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Support multiple images if available
  const images = Array.isArray(metadata.image) 
    ? metadata.image 
    : [metadata.image];

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 rounded-lg bg-white/5 backdrop-blur-sm">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden">
        <Image
          src={images[currentImageIndex]}
          alt={metadata.name}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoadingComplete={() => setIsLoading(false)}
        />
        
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-2 h-2 rounded-full ${
                  idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 w-full">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{metadata.name}</h2>
          <div className="text-xl font-bold text-blue-500">
            {price} {currency}
          </div>
        </div>

        <p className="mt-2 text-gray-600 dark:text-gray-300">
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