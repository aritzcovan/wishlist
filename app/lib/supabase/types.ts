// Supabase Database Types
// This file will be generated from Supabase schema once the database is set up
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > app/lib/supabase/types.ts

// Placeholder types - replace with generated types after running Supabase setup
export type Database = {
  public: {
    Tables: {
      wishlists: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      event_categories: {
        Row: {
          id: string
          name: string
          is_preset: boolean
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          is_preset?: boolean
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          is_preset?: boolean
          user_id?: string | null
          created_at?: string
        }
      }
      items: {
        Row: {
          id: string
          wishlist_id: string
          event_category_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          wishlist_id: string
          event_category_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          wishlist_id?: string
          event_category_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

