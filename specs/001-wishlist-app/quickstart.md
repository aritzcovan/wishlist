# Quickstart Guide: Wishlist Application

**Date**: 2025-01-27  
**Feature**: Wishlist Application

## Prerequisites

- Node.js 18+ installed
- npm package manager
- Supabase account (free tier sufficient)
- Resend account (for email functionality)

## Setup Steps

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install resend
npm install --save-dev @types/node
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings → API
3. Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Setup Database Schema

Run the following SQL in Supabase SQL Editor:

```sql
-- Create wishlists table
CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create event_categories table
CREATE TABLE event_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  is_preset BOOLEAN NOT NULL DEFAULT false,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  event_category_id UUID NOT NULL REFERENCES event_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_items_wishlist_id ON items(wishlist_id);
CREATE INDEX idx_items_category_id ON items(event_category_id);
CREATE INDEX idx_event_categories_user_id ON event_categories(user_id);
CREATE INDEX idx_event_categories_preset ON event_categories(is_preset) WHERE is_preset = true;

-- Seed preset categories
INSERT INTO event_categories (name, is_preset) VALUES
  ('birthday', true),
  ('Christmas', true),
  ('anniversary', true),
  ('just because', true),
  ('graduation', true),
  ('wedding', true),
  ('housewarming', true),
  ('baby shower', true);

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wishlists
CREATE POLICY "Users can view own wishlists"
  ON wishlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlists"
  ON wishlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wishlists"
  ON wishlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlists"
  ON wishlists FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for event_categories
CREATE POLICY "Anyone can view preset categories"
  ON event_categories FOR SELECT
  USING (is_preset = true OR user_id = auth.uid());

CREATE POLICY "Users can insert own custom categories"
  ON event_categories FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_preset = false);

CREATE POLICY "Users can update own custom categories"
  ON event_categories FOR UPDATE
  USING (auth.uid() = user_id AND is_preset = false);

CREATE POLICY "Users can delete own custom categories"
  ON event_categories FOR DELETE
  USING (auth.uid() = user_id AND is_preset = false);

-- RLS Policies for items
CREATE POLICY "Users can view items in own wishlists"
  ON items FOR SELECT
  USING (
    wishlist_id IN (
      SELECT id FROM wishlists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items in own wishlists"
  ON items FOR INSERT
  WITH CHECK (
    wishlist_id IN (
      SELECT id FROM wishlists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items in own wishlists"
  ON items FOR UPDATE
  USING (
    wishlist_id IN (
      SELECT id FROM wishlists WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items in own wishlists"
  ON items FOR DELETE
  USING (
    wishlist_id IN (
      SELECT id FROM wishlists WHERE user_id = auth.uid()
    )
  );

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_wishlists_updated_at
  BEFORE UPDATE ON wishlists
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at
  BEFORE UPDATE ON items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 4. Setup shadcn/ui

```bash
npx shadcn@latest init
```

Follow prompts:
- Use TypeScript: Yes
- Style: Default
- Base color: Slate
- CSS variables: Yes

Install required components:
```bash
npx shadcn@latest add button card form input label textarea select dialog dropdown-menu
```

### 5. Setup Resend

1. Create account at [resend.com](https://resend.com)
2. Get API key from dashboard
3. Add to `.env.local`:

```env
RESEND_API_KEY=your-resend-api-key
```

### 6. Configure Supabase Auth

In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `http://localhost:3000` (development)
- Redirect URLs: Add `http://localhost:3000/api/auth/callback`

### 7. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Verification Checklist

- [ ] Supabase project created and connected
- [ ] Database schema created and RLS policies enabled
- [ ] Preset categories seeded
- [ ] Environment variables configured
- [ ] shadcn/ui initialized and components installed
- [ ] Resend API key configured
- [ ] Development server runs without errors
- [ ] Can register a new user
- [ ] Can log in with registered user
- [ ] Dashboard displays (or sample wishlist if new user)

## Common Issues

### "Invalid API key" error
- Verify environment variables are in `.env.local` (not `.env`)
- Restart development server after adding environment variables

### RLS policy errors
- Ensure RLS is enabled on all tables
- Verify policies match authenticated user ID

### shadcn/ui components not styling
- Check `tailwind.config.ts` includes shadcn paths
- Verify `globals.css` includes shadcn CSS variables

### Email not sending
- Verify Resend API key is correct
- Check Resend dashboard for delivery status
- Ensure email domain is verified (for production)

## Next Steps

1. Implement authentication pages (login, register, reset password)
2. Create dashboard page with wishlist cards
3. Implement wishlist CRUD operations
4. Add item management
5. Implement email sharing
6. Add theme switching

