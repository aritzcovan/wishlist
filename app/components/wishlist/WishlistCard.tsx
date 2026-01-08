'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import type { Wishlist } from '@/app/types';
import { updateWishlist, deleteWishlist } from '@/app/lib/actions/wishlist';

interface WishlistCardProps {
  wishlist: Wishlist;
}

export function WishlistCard({ wishlist }: WishlistCardProps) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editName, setEditName] = useState(wishlist.name);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const itemText =
    wishlist.item_count === 1 ? '1 item' : `${wishlist.item_count || 0} items`;

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await updateWishlist({
      id: wishlist.id,
      name: editName,
    });

    if (!result.success) {
      setError(result.error || 'Failed to update wishlist');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsEditOpen(false);
    router.refresh();
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const result = await deleteWishlist(wishlist.id);

    if (!result.success) {
      setError(result.error || 'Failed to delete wishlist');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setIsDeleteOpen(false);
    router.refresh();
  };

  return (
    <>
      <Card className="transition-shadow hover:shadow-md relative group">
        <Link href={`/dashboard/wishlists/${wishlist.id}`}>
          <CardHeader>
            <CardTitle className="line-clamp-2">{wishlist.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{itemText}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Created {new Date(wishlist.created_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Link>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsEditOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit {wishlist.name}</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete {wishlist.name}</span>
          </Button>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Edit Wishlist</DialogTitle>
            <DialogDescription>
              Update the name of your wishlist
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="space-y-4">
              <div>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Wishlist name"
                  required
                  maxLength={100}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{wishlist.name}&quot; and all of
              its items. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
