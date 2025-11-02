import { NextResponse } from 'next/server';

/**
 * NFT Collection Metadata
 * GET /api/nft/collection.json
 */
export async function GET() {
  const metadata = {
    name: 'Qora NFT Collection',
    description: 'Collect fragments around the city and craft unique NFT cards in the Qora metaverse',
    image: 'https://qora.store/images/collection-cover.jpg',
    external_link: 'https://qora.store',
    seller_fee_basis_points: 500, // 5% royalty
    fee_recipient: process.env.NEXT_PUBLIC_TON_COLLECTION_ADDRESS || '',
  };

  return NextResponse.json(metadata);
}
