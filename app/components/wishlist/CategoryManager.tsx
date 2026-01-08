'use client';

import { useState, useEffect } from 'react';
import { getCategories, updateCustomCategory, deleteCustomCategory } from '@/app/lib/actions/categories';
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
import { Pencil, Trash2, Settings } from 'lucide-react';
import type { EventCategory } from '@/app/types';

export function CategoryManager() {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    const result = await getCategories();
    if (result.success && result.data) {
      // Only show custom categories
      setCategories(result.data.filter(cat => !cat.is_preset));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const handleEdit = (category: EventCategory) => {
    setEditingCategory(category);
    setEditName(category.name);
    setError(null);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory || !editName.trim()) return;

    setIsLoading(true);
    setError(null);

    const result = await updateCustomCategory({
      id: editingCategory.id,
      name: editName,
    });

    if (!result.success) {
      setError(result.error || 'Failed to update category');
      setIsLoading(false);
      return;
    }

    setEditingCategory(null);
    setEditName('');
    await loadCategories();
    setIsLoading(false);
  };

  const handleDelete = async (category: EventCategory) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? You cannot delete categories that have items assigned.`)) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await deleteCustomCategory(category.id);

    if (!result.success) {
      setError(result.error || 'Failed to delete category');
      setIsLoading(false);
      return;
    }

    await loadCategories();
    setIsLoading(false);
  };

  const customCategories = categories.filter(cat => !cat.is_preset);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="mr-2 h-4 w-4" />
        Manage Categories
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Custom Categories</DialogTitle>
            <DialogDescription>
              Edit or delete your custom event categories
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isLoading && categories.length === 0 && (
              <p className="text-sm text-muted-foreground">Loading...</p>
            )}

            {!isLoading && customCategories.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No custom categories yet. Create one when adding an item!
              </p>
            )}

            {customCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-2 rounded-md border p-3"
              >
                {editingCategory?.id === category.id ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={50}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={isLoading || !editName.trim()}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingCategory(null);
                        setEditName('');
                        setError(null);
                      }}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 capitalize">{category.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(category)}
                      disabled={isLoading}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(category)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

