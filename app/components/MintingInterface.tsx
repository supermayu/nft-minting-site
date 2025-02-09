'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

interface MintingInterfaceProps {
    maxSupply: number;
    mintPrice: string;
    contractAddress: `0x${string}`;
    maxPerTransaction?: number;
}

export function MintingInterface({
    mintPrice,
    contractAddress,
    maxPerTransaction = 5
}: MintingInterfaceProps) {
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(mintPrice);
    const { isConnected} = useAccount();

    const { writeContract, data: hash } = useWriteContract();

    const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        const total = Number(mintPrice) * quantity;
        setTotalPrice(total.toString());
    }, [quantity, mintPrice]);

    const handleMint = () => {
        if (!isConnected) return;

        writeContract({
            address: contractAddress,
            abi: [{
                name: 'mint',
                type: 'function',
                stateMutability: 'payable',
                inputs: [{ name: 'quantity', type: 'uint256' }],
                outputs: [],
            }],
            functionName: 'mint',
            args: [BigInt(quantity)],
            value: parseEther(totalPrice),
        });
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 rounded-lg bg-white/5 backdrop-blur-sm">
            <div className="mb-6">
                <h3 className="text-xl text-white font-bold mb-2">Mint Your NFT</h3>
                <p className="text-sm text-gray-400">
                    Price per NFT: {mintPrice} ETH
                </p>
            </div>

            <div className="flex items-center justify-between mb-4">
                <label htmlFor="quantity" className="text-lg font-medium">
                    Quantity
                </label>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-800"
                    >
                        -
                    </button>
                    <span className="w-8 text-white text-center">{quantity}</span>
                    <button
                        onClick={() => setQuantity(Math.min(maxPerTransaction, quantity + 1))}
                        className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-800"
                    >
                        +
                    </button>
                </div>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                <div className="flex justify-between">
                    <span>Total Price:</span>
                    <span className="font-bold">{totalPrice} ETH</span>
                </div>
            </div>

            <button
                onClick={handleMint}
                disabled={!isConnected || isLoading}
                className={`w-full py-3 rounded-lg font-medium transition-colors
          ${isConnected
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
                    }
        `}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full" />
                        Minting...
                    </span>
                ) : isConnected ? (
                    `Mint ${quantity} NFT${quantity > 1 ? 's' : ''}`
                ) : (
                    'Connect Wallet to Mint'
                )}
            </button>

            {isSuccess && (
                <div className="mt-4 p-4 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100">
                    <p className="text-center">Successfully minted your NFT!</p>
                    <a 
                        href={`https://etherscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline mt-2 block text-center"
                    >
                        View on Etherscan
                    </a>
                </div>
            )}
            
            {isError && (
                <p className="mt-4 text-red-500 text-center">
                    Error minting NFT. Please try again.
                </p>
            )}
        </div>
    );
}