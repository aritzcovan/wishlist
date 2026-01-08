import { Metadata } from 'next';
import { WishlistForm } from '@/app/components/wishlist/WishlistForm';

export const metadata: Metadata = {
  title: 'Create Wishlist',
  description: 'Create a new wishlist',
};

export default function NewWishlistPage() {
  return (
    <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center">
      <WishlistForm />
    </div>
  );
}

