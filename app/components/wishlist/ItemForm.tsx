'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createItem } from '@/app/lib/actions/items';
import { getCategories } from '@/app/lib/actions/categories';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EventCategory } from '@/app/types';

interface ItemFormProps {
  wishlistId: string;
}

export function ItemForm({ wishlistId }: ItemFormProps) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const result = await getCategories();
      if (result.success && result.data) {
        setCategories(result.data);
        // Pre-select first category if available
        if (result.data.length > 0) {
          setCategoryId(result.data[0].id);
        }
      } else {
        setError('Failed to load categories');
      }
      setIsLoadingCategories(false);
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError('Please select a category');
      return;
    }

    setIsLoading(true);

    try {
      const result = await createItem({
        wishlist_id: wishlistId,
        name,
        description: description || undefined,
        event_category_id: categoryId,
      });

      if (!result.success) {
        setError(result.error || 'Failed to create item');
        setIsLoading(false);
        return;
      }

      // Success - reset form and refresh
      setName('');
      setDescription('');
      // Keep category selection for convenience
      setIsLoading(false);
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  if (isLoadingCategories) {
    return <div className="text-sm text-muted-foreground">Loading...</div>;
  }

  if (categories.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No categories available. Please contact support.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="item-name">Item Name *</Label>
          <Input
            id="item-name"
            type="text"
            placeholder="e.g., Wireless Headphones"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={200}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            value={categoryId}
            onValueChange={setCategoryId}
            disabled={isLoading}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                  {!category.is_preset && ' (custom)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Add any details about this item..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={1000}
          disabled={isLoading}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          {description.length}/1000 characters
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Item'}
      </Button>
    </form>
  );
}

