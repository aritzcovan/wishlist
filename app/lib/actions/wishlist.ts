'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/app/lib/supabase/client'
import { validateWishlistName } from '@/app/utils/validation'
import type {
  ActionResponse,
  Wishlist,
  WishlistWithItems,
  CreateWishlistInput,
  UpdateWishlistInput,
} from '@/app/types'

export async function getWishlists(): Promise<
  ActionResponse<Wishlist[]>
> {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    // Fetch wishlists with item count
    const { data: wishlists, error } = await supabase
      .from('wishlists')
      .select('*, items(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching wishlists:', error)
      return {
        success: false,
        error: 'Failed to fetch wishlists',
      }
    }

    // Format with item count
    const formattedWishlists = wishlists?.map((wishlist) => ({
      id: wishlist.id,
      user_id: wishlist.user_id,
      name: wishlist.name,
      created_at: wishlist.created_at,
      updated_at: wishlist.updated_at,
      item_count: wishlist.items?.[0]?.count || 0,
    }))

    return {
      success: true,
      data: formattedWishlists || [],
    }
  } catch (error) {
    console.error('Error fetching wishlists:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

export async function getWishlist(
  id: string
): Promise<ActionResponse<WishlistWithItems>> {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    // Fetch wishlist with items and categories
    const { data: wishlist, error } = await supabase
      .from('wishlists')
      .select(
        `
        *,
        items (
          *,
          category:event_categories (*)
        )
      `
      )
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching wishlist:', error)
      return {
        success: false,
        error: 'Wishlist not found',
      }
    }

    return {
      success: true,
      data: wishlist as WishlistWithItems,
    }
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

export async function createWishlist(
  input: CreateWishlistInput
): Promise<ActionResponse<Wishlist>> {
  // Validate name
  const nameError = validateWishlistName(input.name)
  if (nameError) {
    return {
      success: false,
      error: nameError,
    }
  }

  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    // Check for duplicate name
    const { data: existing } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', input.name.trim())
      .single()

    if (existing) {
      return {
        success: false,
        error: 'Wishlist name already exists',
      }
    }

    // Create wishlist
    const { data: wishlist, error } = await supabase
      .from('wishlists')
      .insert({
        user_id: user.id,
        name: input.name.trim(),
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating wishlist:', error)
      return {
        success: false,
        error: 'Failed to create wishlist',
      }
    }

    revalidatePath('/dashboard')
    return {
      success: true,
      data: wishlist,
    }
  } catch (error) {
    console.error('Error creating wishlist:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

export async function updateWishlist(
  input: UpdateWishlistInput
): Promise<ActionResponse<Wishlist>> {
  // Validate name
  const nameError = validateWishlistName(input.name)
  if (nameError) {
    return {
      success: false,
      error: nameError,
    }
  }

  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    // Check for duplicate name (excluding current wishlist)
    const { data: existing } = await supabase
      .from('wishlists')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', input.name.trim())
      .neq('id', input.id)
      .single()

    if (existing) {
      return {
        success: false,
        error: 'Wishlist name already exists',
      }
    }

    // Update wishlist
    const { data: wishlist, error } = await supabase
      .from('wishlists')
      .update({ name: input.name.trim() })
      .eq('id', input.id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating wishlist:', error)
      return {
        success: false,
        error: 'Wishlist not found',
      }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/wishlists/${input.id}`)
    return {
      success: true,
      data: wishlist,
    }
  } catch (error) {
    console.error('Error updating wishlist:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

export async function deleteWishlist(id: string): Promise<ActionResponse> {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    // Delete wishlist (items will cascade delete)
    const { error } = await supabase
      .from('wishlists')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting wishlist:', error)
      return {
        success: false,
        error: 'Wishlist not found',
      }
    }

    revalidatePath('/dashboard')
    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting wishlist:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

export async function createSampleWishlist(): Promise<
  ActionResponse<WishlistWithItems>
> {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      }
    }

    // Get preset categories
    const { data: categories } = await supabase
      .from('event_categories')
      .select('id, name')
      .eq('is_preset', true)
      .in('name', ['birthday', 'just because', 'anniversary'])

    if (!categories || categories.length < 3) {
      return {
        success: false,
        error: 'Preset categories not found',
      }
    }

    const birthdayCategory = categories.find((c) => c.name === 'birthday')
    const justBecauseCategory = categories.find((c) => c.name === 'just because')
    const anniversaryCategory = categories.find((c) => c.name === 'anniversary')

    // Create wishlist
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlists')
      .insert({
        user_id: user.id,
        name: 'My First Wishlist',
      })
      .select()
      .single()

    if (wishlistError || !wishlist) {
      console.error('Error creating sample wishlist:', wishlistError)
      return {
        success: false,
        error: 'Failed to create sample wishlist',
      }
    }

    // Create sample items
    const sampleItems = [
      {
        wishlist_id: wishlist.id,
        name: 'Wireless Headphones',
        description: 'Noise-canceling with long battery life',
        event_category_id: birthdayCategory!.id,
      },
      {
        wishlist_id: wishlist.id,
        name: 'Coffee Maker',
        description: 'Programmable with thermal carafe',
        event_category_id: justBecauseCategory!.id,
      },
      {
        wishlist_id: wishlist.id,
        name: 'Gift Card',
        description: 'For favorite store or restaurant',
        event_category_id: anniversaryCategory!.id,
      },
    ]

    const { error: itemsError } = await supabase
      .from('items')
      .insert(sampleItems)

    if (itemsError) {
      console.error('Error creating sample items:', itemsError)
      // Wishlist was created, but items failed - still return success
    }

    // Fetch complete wishlist with items
    const result = await getWishlist(wishlist.id)
    
    revalidatePath('/dashboard')
    return result
  } catch (error) {
    console.error('Error creating sample wishlist:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

