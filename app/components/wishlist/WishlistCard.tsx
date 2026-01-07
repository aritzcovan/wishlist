import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Wishlist } from '@/app/types'

interface WishlistCardProps {
  wishlist: Wishlist
}

export function WishlistCard({ wishlist }: WishlistCardProps) {
  const itemText =
    wishlist.item_count === 1 ? '1 item' : `${wishlist.item_count || 0} items`

  return (
    <Link href={`/wishlists/${wishlist.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="line-clamp-2">{wishlist.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{itemText}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Created {new Date(wishlist.created_at).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

