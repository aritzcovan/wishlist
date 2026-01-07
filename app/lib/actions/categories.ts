'use server';

import { createClient } from '@/app/lib/supabase/client';
import { validateCategoryName } from '@/app/utils/validation';
import type {
  ActionResponse,
  EventCategory,
  CreateCustomCategoryInput,
  UpdateCustomCategoryInput,
} from '@/app/types';

export async function getCategories(): Promise<
  ActionResponse<EventCategory[]>
> {
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

    // Fetch preset categories and user's custom categories
    const { data: categories, error } = await supabase
      .from('event_categories')
      .select('*')
      .or(`is_preset.eq.true,user_id.eq.${user.id}`)
      .order('is_preset', { ascending: false })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        error: 'Failed to fetch categories',
      };
    }

    return {
      success: true,
      data: categories || [],
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function createCustomCategory(
  input: CreateCustomCategoryInput
): Promise<ActionResponse<EventCategory>> {
  // Validate name
  const nameError = validateCategoryName(input.name);
  if (nameError) {
    return {
      success: false,
      error: nameError,
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

    // Check for duplicate name (for user's custom categories)
    const { data: existing } = await supabase
      .from('event_categories')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', input.name.trim())
      .single();

    if (existing) {
      return {
        success: false,
        error: 'Category name already exists',
      };
    }

    // Create category
    const { data: category, error } = await supabase
      .from('event_categories')
      .insert({
        user_id: user.id,
        name: input.name.trim(),
        is_preset: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return {
        success: false,
        error: 'Failed to create category',
      };
    }

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error('Error creating category:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function updateCustomCategory(
  input: UpdateCustomCategoryInput
): Promise<ActionResponse<EventCategory>> {
  // Validate name
  const nameError = validateCategoryName(input.name);
  if (nameError) {
    return {
      success: false,
      error: nameError,
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

    // Check if category exists and belongs to user
    const { data: existing } = await supabase
      .from('event_categories')
      .select('id, is_preset')
      .eq('id', input.id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return {
        success: false,
        error: 'Category not found',
      };
    }

    if (existing.is_preset) {
      return {
        success: false,
        error: 'Cannot edit preset categories',
      };
    }

    // Check for duplicate name (excluding current category)
    const { data: duplicate } = await supabase
      .from('event_categories')
      .select('id')
      .eq('user_id', user.id)
      .eq('name', input.name.trim())
      .neq('id', input.id)
      .single();

    if (duplicate) {
      return {
        success: false,
        error: 'Category name already exists',
      };
    }

    // Update category
    const { data: category, error } = await supabase
      .from('event_categories')
      .update({
        name: input.name.trim(),
      })
      .eq('id', input.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return {
        success: false,
        error: 'Failed to update category',
      };
    }

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error('Error updating category:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

export async function deleteCustomCategory(
  id: string
): Promise<ActionResponse<void>> {
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

    // Check if category exists and belongs to user
    const { data: existing } = await supabase
      .from('event_categories')
      .select('id, is_preset')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      return {
        success: false,
        error: 'Category not found',
      };
    }

    if (existing.is_preset) {
      return {
        success: false,
        error: 'Cannot delete preset categories',
      };
    }

    // Check if category has items
    const { data: items, error: itemsError } = await supabase
      .from('items')
      .select('id')
      .eq('event_category_id', id)
      .limit(1);

    if (itemsError) {
      console.error('Error checking category items:', itemsError);
      return {
        success: false,
        error: 'Failed to check category usage',
      };
    }

    if (items && items.length > 0) {
      return {
        success: false,
        error: 'Cannot delete category with items. Please reassign items first.',
      };
    }

    // Delete category
    const { error } = await supabase
      .from('event_categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting category:', error);
      return {
        success: false,
        error: 'Failed to delete category',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

