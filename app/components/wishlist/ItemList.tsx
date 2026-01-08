'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ItemWithCategory } from '@/app/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { updateItem, deleteItem } from '@/app/lib/actions/items';
import { getCategories } from '@/app/lib/actions/categories';
import type { EventCategory } from '@/app/types';

interface ItemListProps {
  items: ItemWithCategory[];
}

export function ItemList({ items }: ItemListProps) {
  const router = useRouter();
  const [editingItem, setEditingItem] = useState<ItemWithCategory | null>(null);
  const [deletingItem, setDeletingItem] = useState<ItemWithCategory | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadCategories = async () => {
    const result = await getCategories();
    if (result.success && result.data) {
      setCategories(result.data);
    }
  };

  const handleEditClick = async (item: ItemWithCategory) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditDescription(item.description || '');
    setEditCategoryId(item.category_id);
    setError(null);
    await loadCategories();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setError(null);
    setIsLoading(true);

    const result = await updateItem({
      id: editingItem.id,
      name: editName,
      description: editDescription || null,
      category_id: editCategoryId,
    });

    if (!result.success) {
      setError(result.error || 'Failed to update item');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setEditingItem(null);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    setIsLoading(true);
    const result = await deleteItem(deletingItem.id);

    if (!result.success) {
      setError(result.error || 'Failed to delete item');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    setDeletingItem(null);
    router.refresh();
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No items yet. Add your first item above!
      </div>
    );
  }

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const categoryName = item.category?.name || 'Uncategorized';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {} as Record<string, ItemWithCategory[]>);

  return (
    <>
      <div className="space-y-6">
        {Object.entries(itemsByCategory).map(([categoryName, categoryItems]) => (
          <div key={categoryName} className="space-y-3">
            <h3 className="text-lg font-semibold capitalize">{categoryName}</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryItems.map((item) => (
                <Card key={item.id} className="h-full relative group">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge variant="secondary" className="capitalize shrink-0">
                        {categoryName}
                      </Badge>
                    </div>
                    {item.description && (
                      <CardDescription className="mt-2">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    Added {new Date(item.created_at).toLocaleDateString()}
                  </CardContent>

                  {/* Action Buttons */}
                  <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 bg-background/80 backdrop-blur-sm"
                      onClick={() => handleEditClick(item)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit {item.name}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 bg-background/80 backdrop-blur-sm hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeletingItem(item)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete {item.name}</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>
              Update the item details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Item Name</Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g., Coffee Maker"
                  required
                  maxLength={100}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Optional: Add details like brand, size, color..."
                  maxLength={500}
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editCategoryId}
                  onValueChange={setEditCategoryId}
                  disabled={isLoading}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat.is_preset)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    {categories.filter((cat) => !cat.is_preset).length > 0 && (
                      <>
                        <SelectItem value="divider" disabled>
                          ── Custom Categories ──
                        </SelectItem>
                        {categories
                          .filter((cat) => !cat.is_preset)
                          .map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
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
                onClick={() => setEditingItem(null)}
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
      <AlertDialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &quot;{deletingItem?.name}&quot;. This
              action cannot be undone.
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
