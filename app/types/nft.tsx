export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes: {
        trait_type: string;
        value: string | number;
    }[];
}

export interface NFTState {
    metadata: NFTMetadata | null;  // または undefined
    isLoading: boolean;
    error: string | null;
}

export interface MintingState {
    status: 'idle' | 'loading' | 'success' | 'error';
    error?: string;
}

export interface NFTContract {
    address: string;
    //tokenId?: string;
    chainId: number;
    tokenURI(tokenId: string): Promise<string>;
    baseURI?(): Promise<string>;
}