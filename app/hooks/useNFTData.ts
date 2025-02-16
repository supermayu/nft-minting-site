import { useReadContract } from 'wagmi'
import { normalizeURI } from '../utils/uri'
import { useState, useEffect } from 'react';
import { NFTMetadata } from '../types/nft';
import { fetchWithTimeout, isValidMetadata } from '../utils/fetchNFTMetadata';

export function useTokenURI(
    tokenId: string,
) {

    const result = useReadContract({
        address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "uint256",
                        "name": "_tokenId",
                        "type": "uint256"
                    }
                ],
                "name": "uri",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ],
        functionName: 'uri',
        args: [BigInt(tokenId)],
    })

    const { data, isError, error, isLoading } = result;
    // Loading state
    if (isLoading) {
        return {
            uri: '',
            isLoading: true,
            error: null
        }
    }

    // Error state
    if (isError) {
        return {
            uri: '',
            isLoading: false,
            error: error?.message || 'Failed to fetch token URI'
        }
    }

    // Success state
    try {
        const normalizedUri = data ? normalizeURI(data as string) : '';
        return {
            uri: normalizedUri,
            isLoading: false,
            error: null
        }
    } catch (error) {
        console.error(`Error normalizing URI for token ${tokenId}:`, error)
        return {
            uri: '',
            isLoading: false,
            error: 'Failed to normalize token URI'
        }
    }
}

export function useNFTMetadata(tokenId: string, uri: string) {
    const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchMetadata() {
            if (!uri) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetchWithTimeout(uri);

                // JSONとしてパース
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(`Failed to fetch metadata: ${response.statusText}`);
                }

                if (!isValidMetadata(data)) {
                    throw new Error('Invalid metadata format');
                }

                if (isMounted) {
                    setMetadata({
                        name: data.name || `Token #${tokenId}`,
                        description: data.description || '',
                        image: normalizeURI(data.image) || '',
                        attributes: Array.isArray(data.attributes) ? data.attributes : []
                    });
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to load NFT metadata');
                    console.error(err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchMetadata();

        return () => {
            isMounted = false;
        };
    }, [uri, tokenId]);

    return {
        metadata,
        isLoading: isLoading,
        error
    };
}


