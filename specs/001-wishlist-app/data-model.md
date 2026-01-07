# Data Model: Wishlist Application

**Date**: 2025-01-27  
**Feature**: Wishlist Application  
**Database**: Supabase PostgreSQL

## Entity Relationship Diagram

```
auth.users (Supabase managed)
    │
    ├─── wishlists (1:N)
    │       │
    │       └─── items (1:N)
    │               │
    │               └─── event_categories (N:1)
    │
    └─── event_categories (1:N, custom categories only)
```

## Tables

### 1. wishlists

**Purpose**: Store user wishlists

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| user_id | UUID | NOT NULL, FOREIGN KEY (auth.users.id) | Owner of the wishlist |
| name | TEXT | NOT NULL | Wishlist name (unique per user) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update timestamp |

**Indexes**:
- `idx_wishlists_user_id` on `user_id`
- `idx_wishlists_user_name` unique on `(user_id, name)` (enforces uniqueness per user)

**Row Level Security (RLS)**:
- Users can SELECT, INSERT, UPDATE, DELETE only their own wishlists
- Policy: `user_id = auth.uid()`

### 2. event_categories

**Purpose**: Store preset and custom event categories

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| name | TEXT | NOT NULL | Category name |
| is_preset | BOOLEAN | NOT NULL, DEFAULT false | Whether this is a preset category |
| user_id | UUID | NULLABLE, FOREIGN KEY (auth.users.id) | Owner (NULL for preset categories) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |

**Indexes**:
- `idx_event_categories_user_id` on `user_id`
- `idx_event_categories_preset` on `is_preset` WHERE `is_preset = true`

**Row Level Security (RLS)**:
- All users can SELECT preset categories (`is_preset = true`)
- Users can SELECT, INSERT, UPDATE, DELETE their own custom categories (`user_id = auth.uid()`)

**Preset Categories** (seeded data):
- birthday
- Christmas
- anniversary
- just because
- graduation
- wedding
- housewarming
- baby shower

### 3. items

**Purpose**: Store items within wishlists

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| wishlist_id | UUID | NOT NULL, FOREIGN KEY (wishlists.id) ON DELETE CASCADE | Parent wishlist |
| event_category_id | UUID | NOT NULL, FOREIGN KEY (event_categories.id) | Item's event category |
| name | TEXT | NOT NULL | Item name |
| description | TEXT | NULLABLE | Item description |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT now() | Last update timestamp |

**Indexes**:
- `idx_items_wishlist_id` on `wishlist_id`
- `idx_items_category_id` on `event_category_id`

**Row Level Security (RLS)**:
- Users can SELECT, INSERT, UPDATE, DELETE items in their own wishlists
- Policy: `wishlist_id IN (SELECT id FROM wishlists WHERE user_id = auth.uid())`

## Validation Rules

### Wishlist
- `name`: Required, 1-100 characters, unique per user
- `user_id`: Must match authenticated user

### Item
- `name`: Required, 1-200 characters
- `description`: Optional, max 1000 characters
- `wishlist_id`: Must belong to authenticated user's wishlist
- `event_category_id`: Must be valid category (preset or user's custom)

### Event Category (Custom)
- `name`: Required, 1-50 characters, unique per user (for custom categories)
- `user_id`: Must match authenticated user
- `is_preset`: Must be false for user-created categories

## State Transitions

### Wishlist Lifecycle
1. **Created**: User creates wishlist → `created_at` set
2. **Updated**: User edits wishlist name → `updated_at` set
3. **Deleted**: User deletes wishlist → All items cascade deleted

### Item Lifecycle
1. **Created**: User adds item to wishlist → `created_at` set
2. **Updated**: User edits item → `updated_at` set
3. **Deleted**: User deletes item → Removed from database

### Custom Category Lifecycle
1. **Created**: User creates custom category → `is_preset = false`, `user_id` set
2. **Updated**: User edits category name → Name updated
3. **Deleted**: User deletes category → If items use it, handle via:
   - Option A: Prevent deletion if items exist (recommended)
   - Option B: Reassign items to default category
   - Option C: Delete items (not recommended)

**Decision**: Option A - Prevent deletion of custom categories that have items assigned. Show error message to user.

## Sample Data

### Sample Wishlist (for new users)
- Name: "My First Wishlist"
- Items:
  - "Wireless Headphones" (birthday category)
  - "Coffee Maker" (just because category)
  - "Gift Card" (anniversary category)

## Database Functions

### Update Timestamp Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wishlists_updated_at BEFORE UPDATE ON wishlists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Migration Strategy

1. Create tables in order: `event_categories` → `wishlists` → `items`
2. Seed preset event categories
3. Enable RLS on all tables
4. Create RLS policies
5. Create indexes
6. Create triggers for `updated_at`

