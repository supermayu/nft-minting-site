import { Layout } from './components/Layout';
import { NFTDisplay } from './components/NFTDisplay';
import { MintingInterface } from './components/MintingInterface';


/*const exampleNFT = {
  name: "Example NFT Collection",
  description: "A unique collection of digital art pieces",
  image: "/path-to-your-nft-image.jpg",
  attributes: [
    { trait_type: "Rarity", value: "Legendary" },
    { trait_type: "Type", value: "Digital Art" },
  ],
};*/

const CONTRACT_ADDRESS = '0xD4538962b4166516f54fc13ccA1A1c3466ab18Ef' as `0x${string}`;
const MINT_PRICE = "0.01"; // ETH
const MAX_SUPPLY = 10000;

export default function Home() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold text-center mb-12 text-white">
        NFT Collection Name
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
        <NFTDisplay
          contract={{
            address: CONTRACT_ADDRESS,
            chainId: 11155111, // Sepolia Testnet
          }}
          tokenId= "0"
          price={MINT_PRICE}
          currency="ETH"
        />

        <div className="flex flex-col justify-center">
          <MintingInterface
            maxSupply={MAX_SUPPLY}
            mintPrice={MINT_PRICE}
            contractAddress={CONTRACT_ADDRESS}
            maxPerTransaction={5}
          />
        </div>
      </div>
    </Layout>
  );
}
