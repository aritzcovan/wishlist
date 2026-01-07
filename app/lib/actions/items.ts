'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/app/lib/supabase/client';
import { validateItemName, validateItemDescription } from '@/app/utils/validation';
import type {
  ActionResponse,
  Item,
  CreateItemInput,
  UpdateItemInput,
} from '@/app/types';

export async function createItem(
  input: CreateItemInput
): Promise<ActionResponse<Item>> {
  // Validate name
  const nameError = validateItemName(input.name);
  if (nameError) {
    return {
      success: false,
      error: nameError,
    };
  }

  // Validate description
  const descriptionError = validateItemDescription(input.description || '');
  if (descriptionError) {
    return {
      success: false,
      error: descriptionError,
    };
  }

  try {
    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    // Verify wishlist belongs to user
    const { data: wishlist } = await supabase
      .from('wishlists')
      .select('id')
      .eq('id', input.wishlist_id)
      .eq('user_id', user.id)
      .single();

    if (!wishlist) {
      return {
        success: false,
        error: 'Wishlist not found',
      };
    }

    // Verify category exists and is accessible to user
    const { data: category } = await supabase
      .from('event_categories')
      .select('id')
      .eq('id', input.event_category_id)
      .or(`is_preset.eq.true,user_id.eq.${user.id}`)
      .single();

    if (!category) {
      return {
        success: false,
        error: 'Category not found',
      };
    }

    // Create item
    const { data: item, error } = await supabase
      .from('items')
      .insert({
        wishlist_id: input.wishlist_id,
        name: input.name.trim(),
        description: input.description?.trim() || null,
        event_category_id: input.event_category_id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating item:', error);
      return {
        success: false,
        error: 'Failed to create item',
      };
    }

    revalidatePath(`/dashboard/wishlists/${input.wishlist_id}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      data: item,
    };
  } catch (error) {
    console.error('Error creating item:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function updateItem(
  input: UpdateItemInput
): Promise<ActionResponse<Item>> {
  // Validate name if provided
  if (input.name !== undefined) {
    const nameError = validateItemName(input.name);
    if (nameError) {
      return {
        success: false,
        error: nameError,
      };
    }
  }

  // Validate description if provided
  if (input.description !== undefined) {
    const descriptionError = validateItemDescription(input.description);
    if (descriptionError) {
      return {
        success: false,
        error: descriptionError,
      };
    }
  }

  try {
    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    // Get item with wishlist to verify ownership
    const { data: existingItem } = await supabase
      .from('items')
      .select('*, wishlist:wishlists!inner(user_id)')
      .eq('id', input.id)
      .single();

    if (!existingItem || existingItem.wishlist.user_id !== user.id) {
      return {
        success: false,
        error: 'Item not found',
      };
    }

    // If category is being updated, verify it exists and is accessible
    if (input.event_category_id) {
      const { data: category } = await supabase
        .from('event_categories')
        .select('id')
        .eq('id', input.event_category_id)
        .or(`is_preset.eq.true,user_id.eq.${user.id}`)
        .single();

      if (!category) {
        return {
          success: false,
          error: 'Category not found',
        };
      }
    }

    // Build update object
    const updateData: any = {};
    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.description !== undefined)
      updateData.description = input.description.trim() || null;
    if (input.event_category_id !== undefined)
      updateData.event_category_id = input.event_category_id;

    // Update item
    const { data: item, error } = await supabase
      .from('items')
      .update(updateData)
      .eq('id', input.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating item:', error);
      return {
        success: false,
        error: 'Failed to update item',
      };
    }

    revalidatePath(`/dashboard/wishlists/${existingItem.wishlist_id}`);
    revalidatePath('/dashboard');

    return {
      success: true,
      data: item,
    };
  } catch (error) {
    console.error('Error updating item:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function deleteItem(id: string): Promise<ActionResponse<void>> {
  try {
    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    // Get item with wishlist to verify ownership
    const { data: existingItem } = await supabase
      .from('items')
      .select('wishlist_id, wishlist:wishlists!inner(user_id)')
      .eq('id', id)
      .single();

    if (!existingItem || existingItem.wishlist.user_id !== user.id) {
      return {
        success: false,
        error: 'Item not found',
      };
    }

    // Delete item
    const { error } = await supabase.from('items').delete().eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      return {
        success: false,
        error: 'Failed to delete item',
      };
    }

    revalidatePath(`/dashboard/wishlists/${existingItem.wishlist_id}`);
    revalidatePath('/dashboard');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting item:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

