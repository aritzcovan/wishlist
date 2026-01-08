# Server Actions Contracts: Wishlist Application

**Date**: 2025-01-27  
**Feature**: Wishlist Application  
**Pattern**: Next.js Server Actions

## Authentication Actions

### registerUser

**Purpose**: Register a new user account

**Input**:
```typescript
{
  email: string;      // Valid email format
  password: string;   // Min 8 chars, at least one letter and one number
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;     // Error message if registration fails
  user?: {
    id: string;
    email: string;
  };
}
```

**Errors**:
- `"Email already exists"` - Email is already registered
- `"Invalid email format"` - Email validation failed
- `"Password does not meet requirements"` - Password validation failed

---

### loginUser

**Purpose**: Authenticate user and create session

**Input**:
```typescript
{
  email: string;
  password: string;
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  user?: {
    id: string;
    email: string;
  };
}
```

**Errors**:
- `"Invalid credentials"` - Email or password incorrect
- `"User not found"` - Email does not exist

---

### resetPassword

**Purpose**: Request password reset email

**Input**:
```typescript
{
  email: string;
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  message?: string;  // "Password reset email sent"
}
```

**Errors**:
- `"Email not found"` - Email is not registered
- `"Failed to send email"` - Email service error

---

## Wishlist Actions

### createWishlist

**Purpose**: Create a new wishlist

**Input**:
```typescript
{
  name: string;  // 1-100 characters, unique per user
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  wishlist?: {
    id: string;
    name: string;
    created_at: string;
  };
}
```

**Errors**:
- `"Wishlist name already exists"` - User already has wishlist with this name
- `"Name is required"` - Name is empty
- `"Name too long"` - Name exceeds 100 characters
- `"Unauthorized"` - User not authenticated

---

### updateWishlist

**Purpose**: Update wishlist name

**Input**:
```typescript
{
  id: string;   // Wishlist UUID
  name: string; // New name (1-100 characters, unique per user)
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  wishlist?: {
    id: string;
    name: string;
    updated_at: string;
  };
}
```

**Errors**:
- `"Wishlist not found"` - Wishlist doesn't exist or doesn't belong to user
- `"Wishlist name already exists"` - User already has another wishlist with this name
- `"Unauthorized"` - User not authenticated

---

### deleteWishlist

**Purpose**: Delete a wishlist and all its items

**Input**:
```typescript
{
  id: string;  // Wishlist UUID
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
}
```

**Errors**:
- `"Wishlist not found"` - Wishlist doesn't exist or doesn't belong to user
- `"Unauthorized"` - User not authenticated

---

### getWishlists

**Purpose**: Get all wishlists for authenticated user

**Input**: None (uses authenticated user from session)

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  wishlists?: Array<{
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    item_count: number;  // Number of items in wishlist
  }>;
}
```

---

### getWishlist

**Purpose**: Get a single wishlist with its items

**Input**:
```typescript
{
  id: string;  // Wishlist UUID
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  wishlist?: {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    items: Array<{
      id: string;
      name: string;
      description: string | null;
      category: {
        id: string;
        name: string;
        is_preset: boolean;
      };
      created_at: string;
      updated_at: string;
    }>;
  };
}
```

**Errors**:
- `"Wishlist not found"` - Wishlist doesn't exist or doesn't belong to user
- `"Unauthorized"` - User not authenticated

---

## Item Actions

### createItem

**Purpose**: Add an item to a wishlist

**Input**:
```typescript
{
  wishlist_id: string;
  name: string;              // 1-200 characters
  description?: string;      // Optional, max 1000 characters
  event_category_id: string; // UUID of event category
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  item?: {
    id: string;
    name: string;
    description: string | null;
    category: {
      id: string;
      name: string;
      is_preset: boolean;
    };
    created_at: string;
  };
}
```

**Errors**:
- `"Wishlist not found"` - Wishlist doesn't exist or doesn't belong to user
- `"Category not found"` - Category doesn't exist or user doesn't have access
- `"Name is required"` - Name is empty
- `"Name too long"` - Name exceeds 200 characters
- `"Description too long"` - Description exceeds 1000 characters
- `"Unauthorized"` - User not authenticated

---

### updateItem

**Purpose**: Update an item

**Input**:
```typescript
{
  id: string;                 // Item UUID
  name?: string;              // 1-200 characters
  description?: string;        // Max 1000 characters
  event_category_id?: string; // UUID of event category
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  item?: {
    id: string;
    name: string;
    description: string | null;
    category: {
      id: string;
      name: string;
      is_preset: boolean;
    };
    updated_at: string;
  };
}
```

**Errors**:
- `"Item not found"` - Item doesn't exist or doesn't belong to user's wishlist
- `"Category not found"` - Category doesn't exist or user doesn't have access
- `"Unauthorized"` - User not authenticated

---

### deleteItem

**Purpose**: Delete an item from a wishlist

**Input**:
```typescript
{
  id: string;  // Item UUID
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
}
```

**Errors**:
- `"Item not found"` - Item doesn't exist or doesn't belong to user's wishlist
- `"Unauthorized"` - User not authenticated

---

## Category Actions

### getCategories

**Purpose**: Get all preset categories and user's custom categories

**Input**: None (uses authenticated user from session)

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  categories?: Array<{
    id: string;
    name: string;
    is_preset: boolean;
  }>;
}
```

---

### createCustomCategory

**Purpose**: Create a custom event category

**Input**:
```typescript
{
  name: string;  // 1-50 characters, unique per user
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  category?: {
    id: string;
    name: string;
    is_preset: false;
  };
}
```

**Errors**:
- `"Category name already exists"` - User already has custom category with this name
- `"Name is required"` - Name is empty
- `"Name too long"` - Name exceeds 50 characters
- `"Unauthorized"` - User not authenticated

---

### updateCustomCategory

**Purpose**: Update a custom category name

**Input**:
```typescript
{
  id: string;   // Category UUID
  name: string; // New name (1-50 characters, unique per user)
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  category?: {
    id: string;
    name: string;
  };
}
```

**Errors**:
- `"Category not found"` - Category doesn't exist or is not user's custom category
- `"Cannot edit preset category"` - Attempting to edit a preset category
- `"Category name already exists"` - User already has another custom category with this name
- `"Unauthorized"` - User not authenticated

---

### deleteCustomCategory

**Purpose**: Delete a custom category

**Input**:
```typescript
{
  id: string;  // Category UUID
}
```

**Output**:
```typescript
{
  success: boolean;
  error?: string;
}
```

**Errors**:
- `"Category not found"` - Category doesn't exist or is not user's custom category
- `"Cannot delete preset category"` - Attempting to delete a preset category
- `"Category has items"` - Category is in use by items, deletion prevented
- `"Unauthorized"` - User not authenticated

---

## Sample Wishlist Actions

### createSampleWishlist

**Purpose**: Create a sample wishlist for new users (called automatically when user has no wishlists)

**Input**: None (uses authenticated user from session)

**Output**:
```typescript
{
  success: boolean;
  error?: string;
  wishlist?: {
    id: string;
    name: string;
    items: Array<{
      id: string;
      name: string;
      description: string | null;
      category: {
        id: string;
        name: string;
        is_preset: boolean;
      };
    }>;
  };
}
```

**Sample Data**:
- Wishlist name: "My First Wishlist"
- Items:
  - "Wireless Headphones" (birthday)
  - "Coffee Maker" (just because)
  - "Gift Card" (anniversary)

