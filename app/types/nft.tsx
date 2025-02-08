export interface NFTAttribute {
    trait_type: string;
    value: string | number;
}

export interface NFTMetadata {
    name: string;
    description: string;
    image: string;
    attributes: NFTAttribute[];
}

export interface MintingState {
    status: 'idle' | 'loading' | 'success' | 'error';
    error?: string;
}