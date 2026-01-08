import { LoadingSpinner } from '@/app/components/LoadingSpinner';

export default function WishlistDetailLoading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}

