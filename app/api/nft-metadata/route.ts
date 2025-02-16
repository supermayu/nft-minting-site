import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ipfsHash = searchParams.get('ipfsHash');
    const tokenId = searchParams.get('tokenId') || '0';

    // IPFS Gateway URLの構築
    const gatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}/${tokenId}`;

    const response = await fetch(gatewayUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`IPFS fetch failed with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('API Route error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}