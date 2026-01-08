// Database entity types
export interface User {
  id: string
  email: string
  created_at: string
}

export interface Wishlist {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
  item_count?: number
}

export interface EventCategory {
  id: string
  name: string
  is_preset: boolean
  user_id: string | null
  created_at: string
}

export interface Item {
  id: string
  wishlist_id: string
  event_category_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  category?: EventCategory
}

// Wishlist with items
export interface WishlistWithItems extends Wishlist {
  items: ItemWithCategory[]
}

// Item with category details
export interface ItemWithCategory extends Item {
  category: EventCategory
}

// Server Action response types
export interface ActionResponse<T = void> {
  success: boolean
  error?: string
  data?: T
}

// Form input types
export interface RegisterInput {
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface ResetPasswordInput {
  email: string
}

export interface CreateWishlistInput {
  name: string
}

export interface UpdateWishlistInput {
  id: string
  name: string
}

export interface CreateItemInput {
  wishlist_id: string
  name: string
  description?: string
  event_category_id: string
}

export interface UpdateItemInput {
  id: string
  name?: string
  description?: string
  event_category_id?: string
}

export interface CreateCustomCategoryInput {
  name: string
}

export interface UpdateCustomCategoryInput {
  id: string
  name: string
}

export interface ShareWishlistInput {
  wishlist_id: string
  recipient_emails: string[]
}

