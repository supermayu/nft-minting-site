'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

interface MintingInterfaceProps {
    mintPrice: string;
    maxPerTransaction?: number;
    tokenId: string;
}

export function MintingInterface({
    mintPrice,
    maxPerTransaction = 3,
    tokenId,
}: MintingInterfaceProps) {
    const [mounted, setMounted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(mintPrice);
    const { address, isConnected } = useAccount();

    const { writeContract, data: hash } = useWriteContract();

    const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
        hash,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const total = Number(mintPrice) * quantity;
        setTotalPrice(total.toString());
    }, [quantity, mintPrice]);

    const handleMint = async () => {
        if (!address) return;

        const config = {
            address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
            abi: [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "_receiver",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_tokenId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_quantity",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "_currency",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_pricePerToken",
                            "type": "uint256"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "bytes32[]",
                                    "name": "proof",
                                    "type": "bytes32[]"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "quantityLimitPerWallet",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "pricePerToken",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "address",
                                    "name": "currency",
                                    "type": "address"
                                }
                            ],
                            "internalType": "struct IDrop1155.AllowlistProof",
                            "name": "_allowlistProof",
                            "type": "tuple"
                        },
                        {
                            "internalType": "bytes",
                            "name": "_data",
                            "type": "bytes"
                        }
                    ],
                    "name": "claim",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                }
            ],
            functionName: 'claim',
            args: [
                address,
                BigInt(tokenId),
                BigInt(quantity),
                '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
                parseEther(mintPrice),
                {
                    proof: [],
                    quantityLimitPerWallet: 0,
                    pricePerToken: 0,
                    currency: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
                },
                '0x'
            ],
            value: parseEther(totalPrice),
        }

        try {
            await writeContract(config);
        } catch (error) {
            console.error('Error claiming NFT:', error);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 rounded-lg bg-white/5 backdrop-blur-sm">
            <div className="mb-6">
                <h3 className="text-xl text-white font-bold mb-2">Mint Your NFT</h3>
                <p className="text-sm text-gray-400">
                    Price per NFT: {mintPrice} ETH
                </p>
            </div>

            <div className="flex items-center justify-between mb-4">
                <label htmlFor="quantity" className="text-lg text-white font-medium">
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
                        href={`https://sepolia.etherscan.io/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm underline mt-2 block text-center"
                    >
                        View on Etherscan
                    </a>
                </div>
            )
            }

            {
                isError && (
                    <p className="mt-4 text-red-500 text-center">
                        Error minting NFT. Please try again.
                    </p>
                )
            }
        </div >
    );
}