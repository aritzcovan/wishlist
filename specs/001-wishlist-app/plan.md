# Implementation Plan: Wishlist Application

**Branch**: `001-wishlist-app` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-wishlist-app/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a wishlist application that allows users to create, manage, and share wishlists with event-based categorization. The application uses Next.js App Router with Supabase for authentication and data storage, and shadcn/ui components for a modern, accessible UI.

**Key Technical Decisions**:
- **Backend**: Supabase (PostgreSQL database + authentication)
- **UI Components**: shadcn/ui (accessible, themeable components)
- **Email Service**: Resend (third-party email API)
- **Architecture**: Next.js App Router with Server Components by default, Server Actions for mutations, Client Components only for interactivity

## Technical Context

**Language/Version**: TypeScript 5+  
**Primary Dependencies**: Next.js 16.1.1, React 19.2.3, Supabase (auth + database), shadcn/ui, Tailwind CSS 4+  
**Storage**: Supabase PostgreSQL (via Supabase client)  
**Testing**: Jest, React Testing Library, Playwright (for integration tests)  
**Target Platform**: Web (Next.js App Router, server and client components)  
**Project Type**: Web application (Next.js single project structure)  
**Performance Goals**: Dashboard loads within 5 seconds (SC-002), support 1,000 concurrent users (SC-010), meet Core Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)  
**Constraints**: Server components by default, client components only for interactivity, TypeScript strict mode, no client-side state management libraries until justified  
**Scale/Scope**: 1,000 concurrent authenticated users, multiple wishlists per user, unlimited items per wishlist

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Clean & Modular Code
✅ **PASS**: Code will be organized into focused modules. Components in `app/components/`, utilities in `app/lib/` or `app/utils/`. Single responsibility principle applied.

### II. Next.js Best Practices (Server-First Architecture)
✅ **PASS**: Using Next.js App Router with server components by default. Client components (`"use client"`) only for forms, theme switching, and interactive UI. Server Actions for data mutations. Supabase client used in Server Actions and Route Handlers.

### III. Type Safety (NON-NEGOTIABLE)
✅ **PASS**: TypeScript 5+ with strict mode. All Supabase types will be generated. Component props and function parameters fully typed.

### IV. Testing Discipline
✅ **PASS**: Integration tests for critical flows (auth, wishlist CRUD, sharing). Component tests for UI interactions. Unit tests for business logic.

### V. Performance & Accessibility
✅ **PASS**: Core Web Vitals targets defined. shadcn/ui components are accessible by default. Keyboard navigation required. Theme switching without reload.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── reset-password/
│       └── page.tsx
├── (dashboard)/
│   ├── layout.tsx
│   ├── page.tsx              # Dashboard with wishlist cards
│   └── wishlists/
│       ├── [id]/
│       │   └── page.tsx       # Wishlist detail view
│       └── new/
│           └── page.tsx       # Create new wishlist
├── api/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts       # Supabase auth callback
│   └── share/
│       └── route.ts           # Email sharing endpoint
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── wishlist/
│   │   ├── WishlistCard.tsx
│   │   ├── WishlistForm.tsx
│   │   └── ItemForm.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   └── ThemeProvider.tsx      # Already exists
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Supabase client (server)
│   │   ├── middleware.ts      # Auth middleware
│   │   └── types.ts           # Generated Supabase types
│   ├── actions/
│   │   ├── wishlist.ts        # Server Actions for wishlists
│   │   ├── items.ts           # Server Actions for items
│   │   └── categories.ts      # Server Actions for categories
│   └── email/
│       └── send.ts            # Email sending service
├── types/
│   └── index.ts               # Shared TypeScript types
└── utils/
    └── validation.ts           # Validation utilities

__tests__/
├── integration/
│   ├── auth.test.ts
│   ├── wishlist.test.ts
│   └── sharing.test.ts
└── unit/
    └── validation.test.ts
```

**Structure Decision**: Next.js App Router single project structure. Server components for data fetching, client components for forms and interactive UI. Supabase client used in Server Actions and Route Handlers. shadcn/ui components in `app/components/ui/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
