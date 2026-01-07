import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWishlist } from '@/app/lib/actions/wishlist';
import { ItemList } from '@/app/components/wishlist/ItemList';
import { ItemForm } from '@/app/components/wishlist/ItemForm';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'View and manage your wishlist',
};

interface WishlistDetailPageProps {
  params: {
    id: string;
  };
}

export default async function WishlistDetailPage({
  params,
}: WishlistDetailPageProps) {
  const result = await getWishlist(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const wishlist = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/dashboard">← Back to Dashboard</Link>
          </Button>
          <h1 className="text-3xl font-bold">{wishlist.name}</h1>
          <p className="text-sm text-muted-foreground">
            Created {new Date(wishlist.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Add Item Form */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Add New Item</h2>
        <ItemForm wishlistId={wishlist.id} />
      </div>

      {/* Items List */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">
          Items ({wishlist.items?.length || 0})
        </h2>
        <ItemList items={wishlist.items || []} />
      </div>
    </div>
  );
}

