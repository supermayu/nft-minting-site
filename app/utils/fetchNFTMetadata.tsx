import { NFTMetadata, NFTContract } from '../types/nft';

export async function fetchNFTMetadata(
  contract: NFTContract,
  tokenId?: string
): Promise<NFTMetadata> {
  try {
    // Token URIを取得するためのABI
    const minABI = [
      {
        inputs: [{ name: 'tokenId', type: 'uint256' }],
        name: 'tokenURI',
        outputs: [{ name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
    ];

    const ipfsHash = "QmWQqy2dADTWavWm4MRwXSWnDFq9eWxrwfiB5DN4geZseR";
    // IPFSゲートウェイを使用してメタデータを取得
    const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}/${tokenId}`;
    
    const response = await fetch(gatewayUrl);
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed to fetch NFT metadata');
    }

    const metadata = await response.json();
    return {
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
      attributes: metadata.attributes,
    };
  } catch (error) {
    console.error('Error fetching NFT metadata:', error);
    throw error;
  }
}