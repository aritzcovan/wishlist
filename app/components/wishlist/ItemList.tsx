import type { ItemWithCategory } from '@/app/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ItemListProps {
  items: ItemWithCategory[];
}

export function ItemList({ items }: ItemListProps) {
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
    <div className="space-y-6">
      {Object.entries(itemsByCategory).map(([categoryName, categoryItems]) => (
        <div key={categoryName} className="space-y-3">
          <h3 className="text-lg font-semibold capitalize">{categoryName}</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryItems.map((item) => (
              <Card key={item.id} className="h-full">
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
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

