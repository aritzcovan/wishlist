import { redirect } from 'next/navigation'
import { getWishlists, createSampleWishlist } from '@/app/lib/actions/wishlist'
import { WishlistCard } from '@/app/components/wishlist/WishlistCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard | Wishlist App',
  description: 'View and manage your wishlists',
}

export default async function DashboardPage() {
  // Fetch wishlists
  const result = await getWishlists()

  if (!result.success) {
    // If unauthorized, redirect handled by layout
    // For other errors, show error message
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">{result.error}</p>
        </div>
      </div>
    )
  }

  const wishlists = result.data || []

  // If no wishlists, create sample wishlist
  if (wishlists.length === 0) {
    const sampleResult = await createSampleWishlist()
    
    if (sampleResult.success && sampleResult.data) {
      // Redirect to refresh the page with the new wishlist
      redirect('/dashboard')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Wishlists</h1>
          <p className="mt-2 text-muted-foreground">
            {wishlists.length === 0
              ? 'Create your first wishlist to get started'
              : `You have ${wishlists.length} ${wishlists.length === 1 ? 'wishlist' : 'wishlists'}`}
          </p>
        </div>
        <Link href="/wishlists/new">
          <Button>Create Wishlist</Button>
        </Link>
      </div>

      {/* Wishlists Grid */}
      {wishlists.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {wishlists.map((wishlist) => (
            <WishlistCard key={wishlist.id} wishlist={wishlist} />
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
          <div className="text-center">
            <h3 className="text-lg font-semibold">No wishlists yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get started by creating your first wishlist
            </p>
            <Link href="/wishlists/new">
              <Button className="mt-4">Create Your First Wishlist</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

