# Research: Wishlist Application

**Date**: 2025-01-27  
**Feature**: Wishlist Application  
**Purpose**: Resolve technical decisions and research best practices

## Technology Decisions

### Supabase for Authentication and Database

**Decision**: Use Supabase for authentication and PostgreSQL database storage.

**Rationale**:
- Supabase provides built-in authentication with email/password, password reset, and session management
- PostgreSQL database with Row Level Security (RLS) for data protection
- Real-time capabilities available if needed in future
- TypeScript client with type generation
- Free tier suitable for MVP, scales to production
- Integrates well with Next.js App Router via Server Actions and Route Handlers
- RLS policies ensure users can only access their own data (FR-017)

**Alternatives Considered**:
- **Firebase**: More complex setup, NoSQL database (less suitable for relational data)
- **Custom auth + PostgreSQL**: More development time, security risks, maintenance burden
- **Prisma + separate auth**: More setup complexity, Supabase provides both

**Implementation Notes**:
- Use `@supabase/supabase-js` for server-side operations
- Generate TypeScript types from Supabase schema
- Use Supabase Auth helpers for Next.js middleware
- RLS policies will enforce data isolation per user

### shadcn/ui for UI Components

**Decision**: Use shadcn/ui component library for consistent, accessible UI.

**Rationale**:
- Built on Radix UI primitives (accessible by default)
- Tailwind CSS styling (already in project)
- Copy components into project (not a dependency)
- Fully customizable and themeable
- Supports dark/light mode (FR-014)
- Modern design system (FR-015)
- TypeScript-first with excellent type safety

**Alternatives Considered**:
- **Material-UI**: Heavier bundle, less customizable
- **Chakra UI**: Good but shadcn/ui is more modern and lightweight
- **Custom components**: Too much development time for MVP

**Implementation Notes**:
- Install shadcn/ui CLI: `npx shadcn@latest init`
- Configure for Tailwind CSS 4+
- Add components as needed (Button, Card, Form, Dialog, etc.)
- Theme configuration for dark/light mode

### Third-Party Email Service

**Decision**: Use Resend for email delivery (recommended for Next.js apps).

**Rationale**:
- Simple API, excellent Next.js integration
- Developer-friendly with good free tier
- Reliable delivery rates
- TypeScript SDK available
- Good documentation and support

**Alternatives Considered**:
- **SendGrid**: More complex setup, higher cost
- **AWS SES**: Requires AWS account setup, more configuration
- **SMTP directly**: Deliverability issues, maintenance burden

**Implementation Notes**:
- Install `resend` package
- Use Server Actions or Route Handlers to send emails
- Store API key in environment variables
- Email templates for password reset and wishlist sharing

## Database Schema Design

### Tables

1. **users** (managed by Supabase Auth)
   - id (UUID, primary key)
   - email (unique)
   - created_at

2. **wishlists**
   - id (UUID, primary key)
   - user_id (UUID, foreign key to auth.users)
   - name (text, unique per user)
   - created_at (timestamp)
   - updated_at (timestamp)

3. **event_categories**
   - id (UUID, primary key)
   - name (text)
   - is_preset (boolean)
   - user_id (UUID, nullable, foreign key to auth.users for custom categories)
   - created_at (timestamp)

4. **items**
   - id (UUID, primary key)
   - wishlist_id (UUID, foreign key to wishlists)
   - event_category_id (UUID, foreign key to event_categories)
   - name (text)
   - description (text, nullable)
   - created_at (timestamp)
   - updated_at (timestamp)

### Row Level Security (RLS) Policies

- Users can only read/write their own wishlists
- Users can only read/write items in their own wishlists
- Users can only read/write their own custom categories
- Preset categories are readable by all users

## Next.js App Router Patterns

### Server Components
- Dashboard page: Fetch wishlists server-side
- Wishlist detail page: Fetch items server-side
- Use Supabase client in Server Components for data fetching

### Server Actions
- Create/update/delete wishlists
- Create/update/delete items
- Create/update/delete custom categories
- Share wishlist via email

### Client Components
- Forms (LoginForm, RegisterForm, WishlistForm, ItemForm)
- Theme toggle
- Interactive UI elements (dialogs, dropdowns)

## Authentication Flow

1. User registers → Supabase Auth creates account
2. User logs in → Supabase Auth validates credentials
3. Session stored in HTTP-only cookie (via Supabase middleware)
4. Protected routes check session via middleware
5. Password reset → Supabase Auth sends reset email

## Email Integration

### Password Reset
- Supabase Auth handles password reset emails
- Configure email templates in Supabase dashboard

### Wishlist Sharing
- Server Action or Route Handler calls Resend API
- Email includes wishlist name and formatted item list
- Handle errors gracefully (invalid email, network failures)

## Performance Considerations

- Server Components reduce client bundle size
- Database queries optimized with proper indexes
- Supabase connection pooling for scalability
- Image optimization via `next/image` (if needed for items)

## Security Considerations

- RLS policies enforce data isolation
- Password hashing handled by Supabase Auth
- API keys stored in environment variables
- CSRF protection via Next.js built-in mechanisms
- Input validation on both client and server

