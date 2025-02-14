import { NFTMetadata } from '../types/nft';

export async function fetchWithTimeout(url: string, timeout = 30000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

export function isValidMetadata(metadata: any): metadata is NFTMetadata {
    return (
        typeof metadata === 'object' &&
        metadata !== null &&
        (typeof metadata.name === 'string' || metadata.name === undefined) &&
        (typeof metadata.description === 'string' || metadata.description === undefined) &&
        (typeof metadata.image === 'string' || metadata.image === undefined) &&
        (Array.isArray(metadata.attributes) || metadata.attributes === undefined)
    );
}