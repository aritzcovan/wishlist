---
description: "Task list template for feature implementation"
---

# Tasks: Wishlist Application

**Input**: Design documents from `/specs/001-wishlist-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in specification, so test tasks are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Next.js App Router structure with `app/` directory
- Paths follow Next.js App Router conventions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project directory structure per implementation plan in `app/`
- [x] T002 Install Supabase dependencies: `@supabase/supabase-js` and `@supabase/ssr` via npm
- [x] T003 Install Resend dependency: `resend` via npm
- [x] T004 [P] Initialize shadcn/ui with `npx shadcn@latest init` in project root
- [x] T005 [P] Install required shadcn/ui components: button, card, form, input, label, textarea, select, dialog, dropdown-menu
- [x] T006 Create `.env.local` file with Supabase and Resend environment variable placeholders
- [x] T007 [P] Configure TypeScript strict mode in `tsconfig.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 Setup Supabase project and create database schema using SQL from `quickstart.md` (MANUAL - Complete when ready)
- [x] T009 Create Supabase server client in `app/lib/supabase/client.ts`
- [x] T010 Create Supabase middleware for authentication in `app/lib/supabase/middleware.ts`
- [x] T011 [P] Create shared TypeScript types in `app/types/index.ts`
- [x] T012 [P] Create validation utilities in `app/utils/validation.ts` (email, password, text length)
- [x] T013 Generate Supabase TypeScript types and save to `app/lib/supabase/types.ts`
- [x] T014 Create email service wrapper in `app/lib/email/send.ts` for Resend integration
- [x] T015 Setup Next.js middleware to protect routes using Supabase auth in `middleware.ts` at project root

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts, log in, and authenticate securely

**Independent Test**: Can be fully tested by creating a new account, logging in, and verifying the user can access their dashboard. This delivers a secure, personalized experience.

### Implementation for User Story 1

- [x] T016 [US1] Create register page in `app/(auth)/register/page.tsx` (server component)
- [x] T017 [US1] Create RegisterForm client component in `app/components/auth/RegisterForm.tsx` with email and password fields
- [x] T018 [US1] Create registerUser server action in `app/lib/actions/auth.ts` with email/password validation
- [x] T019 [US1] Create login page in `app/(auth)/login/page.tsx` (server component)
- [x] T020 [US1] Create LoginForm client component in `app/components/auth/LoginForm.tsx` with email and password fields
- [x] T021 [US1] Create loginUser server action in `app/lib/actions/auth.ts` with credential validation
- [x] T022 [US1] Create reset password page in `app/(auth)/reset-password/page.tsx` (server component)
- [x] T023 [US1] Create resetPassword server action in `app/lib/actions/auth.ts` for password reset requests
- [x] T024 [US1] Create auth callback route handler in `app/api/auth/callback/route.ts` for Supabase auth callbacks
- [x] T025 [US1] Add logout functionality to navigation/header component
- [x] T026 [US1] Add password validation (min 8 chars, at least one letter and one number) in `app/utils/validation.ts`
- [x] T027 [US1] Add error handling and user feedback for authentication failures

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can register, log in, reset passwords, and log out.

---

## Phase 4: User Story 2 - View Wishlist Dashboard (Priority: P1) 🎯 MVP

**Goal**: Display all user wishlists as cards on dashboard, or show sample wishlist if user has none

**Independent Test**: Can be fully tested by logging in and verifying the dashboard displays wishlist cards (or a sample wishlist if none exist). This delivers immediate value and demonstrates the app's purpose.

### Implementation for User Story 2

- [x] T028 [US2] Create dashboard layout in `app/(dashboard)/layout.tsx` with authentication check
- [x] T029 [US2] Create dashboard page in `app/(dashboard)/page.tsx` (server component) that fetches user wishlists
- [x] T030 [US2] Create getWishlists server action in `app/lib/actions/wishlist.ts` to fetch all wishlists for authenticated user
- [x] T031 [US2] Create WishlistCard component in `app/components/wishlist/WishlistCard.tsx` to display wishlist information
- [x] T032 [US2] Create createSampleWishlist server action in `app/lib/actions/wishlist.ts` with sample data (3 items with different categories)
- [x] T033 [US2] Add logic to dashboard to create and display sample wishlist when user has no wishlists
- [x] T034 [US2] Add navigation from WishlistCard to wishlist detail page
- [x] T035 [US2] Style dashboard with grid layout for wishlist cards using shadcn/ui Card component

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can authenticate and view their wishlist dashboard.

---

## Phase 5: User Story 3 - Create Wishlist and Add Items (Priority: P2)

**Goal**: Enable users to create new wishlists and add items with preset event categories

**Independent Test**: Can be fully tested by creating a new wishlist, adding items with preset categories, and verifying items appear correctly. This delivers the main functionality users expect.

### Implementation for User Story 3

- [x] T036 [US3] Create new wishlist page in `app/(dashboard)/wishlists/new/page.tsx` (server component)
- [x] T037 [US3] Create WishlistForm client component in `app/components/wishlist/WishlistForm.tsx` with name input
- [x] T038 [US3] Create createWishlist server action in `app/lib/actions/wishlist.ts` with name validation and uniqueness check
- [x] T039 [US3] Create wishlist detail page in `app/(dashboard)/wishlists/[id]/page.tsx` (server component) that fetches wishlist and items
- [x] T040 [US3] Create getWishlist server action in `app/lib/actions/wishlist.ts` to fetch wishlist with items
- [x] T041 [US3] Create ItemForm client component in `app/components/wishlist/ItemForm.tsx` with name, description, and category selection
- [x] T042 [US3] Create getCategories server action in `app/lib/actions/categories.ts` to fetch preset event categories
- [x] T043 [US3] Create createItem server action in `app/lib/actions/items.ts` with validation for name, description, and category
- [x] T044 [US3] Add category selection dropdown in ItemForm with preset categories (birthday, Christmas, anniversary, just because, graduation, wedding, housewarming, baby shower)
- [x] T045 [US3] Display items on wishlist detail page grouped or filterable by event categories
- [x] T046 [US3] Add item list display component showing item name, description, and category
- [x] T047 [US3] Add validation for wishlist name (1-100 characters, unique per user) in createWishlist action
- [x] T048 [US3] Add validation for item name (1-200 characters) and description (max 1000 characters) in createItem action

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Users can create wishlists and add items with preset categories.

---

## Phase 6: User Story 4 - Create Custom Event Categories (Priority: P2)

**Goal**: Enable users to create and use custom event categories beyond preset list

**Independent Test**: Can be fully tested by creating a custom category when adding an item, and verifying it can be reused for other items. This delivers personalized categorization.

### Implementation for User Story 4

- [x] T049 [US4] Add custom category creation option to ItemForm component in `app/components/wishlist/ItemForm.tsx`
- [x] T050 [US4] Create createCustomCategory server action in `app/lib/actions/categories.ts` with name validation (1-50 characters, unique per user)
- [x] T051 [US4] Update getCategories server action to include user's custom categories alongside preset categories
- [x] T052 [US4] Update ItemForm to display both preset and custom categories in selection dropdown
- [x] T053 [US4] Create updateCustomCategory server action in `app/lib/actions/categories.ts` for editing custom category names
- [x] T054 [US4] Create deleteCustomCategory server action in `app/lib/actions/categories.ts` with check to prevent deletion if category has items
- [x] T055 [US4] Add UI for managing custom categories (edit/delete) in wishlist detail page or settings

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently. Users can create and use custom event categories.

---

## Phase 7: User Story 5 - Share Wishlist via Email (Priority: P3)

**Goal**: Enable users to share wishlists via email to recipients

**Independent Test**: Can be fully tested by selecting a wishlist, entering an email address, and verifying an email is sent with the wishlist content. This delivers social functionality.

### Implementation for User Story 5

- [x] T056 [US5] Add share button to wishlist detail page
- [x] T057 [US5] Create share dialog component in `app/components/wishlist/ShareDialog.tsx` with email input field(s)
- [x] T058 [US5] Create email sharing API route handler in `app/api/share/route.ts` with POST method
- [x] T059 [US5] Implement email sending logic in API route using Resend service from `app/lib/email/send.ts`
- [x] T060 [US5] Format wishlist content for email (wishlist name, items grouped by category) in email template
- [x] T061 [US5] Add email validation for recipient addresses in share API route
- [x] T062 [US5] Add error handling for email sending failures (invalid addresses, network errors)
- [x] T063 [US5] Add success confirmation message after email is sent
- [x] T064 [US5] Support multiple recipient email addresses (1-10 recipients)

**Checkpoint**: At this point, all user stories should be independently functional. Users can share wishlists via email.

---

## Phase 8: Edit and Delete Functionality

**Purpose**: Implement edit and delete capabilities for wishlists, items, and custom categories (from clarifications)

- [x] T065 [P] Create updateWishlist server action in `app/lib/actions/wishlist.ts` for editing wishlist names
- [x] T066 [P] Create deleteWishlist server action in `app/lib/actions/wishlist.ts` with cascade delete of items
- [x] T067 [P] Create updateItem server action in `app/lib/actions/items.ts` for editing item name, description, and category
- [x] T068 [P] Create deleteItem server action in `app/lib/actions/items.ts` for removing items from wishlists
- [x] T069 [P] Add edit functionality to WishlistCard component (edit name)
- [x] T070 [P] Add delete functionality to WishlistCard component with confirmation dialog
- [x] T071 [P] Add edit functionality to item display components (edit name, description, category)
- [x] T072 [P] Add delete functionality to item display components with confirmation
- [x] T073 [P] Add confirmation dialogs for all delete operations using shadcn/ui Dialog component

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T074 [P] Enhance ThemeProvider to persist theme preference in localStorage
- [ ] T075 [P] Add loading states to all data-fetching operations
- [ ] T076 [P] Add error boundaries for better error handling
- [ ] T077 [P] Add keyboard navigation support for all interactive elements
- [ ] T078 [P] Optimize images if any are added (using next/image)
- [ ] T079 [P] Add metadata to all pages using Next.js Metadata API
- [ ] T080 [P] Run quickstart.md validation checklist
- [ ] T081 [P] Code cleanup and refactoring
- [ ] T082 [P] Performance optimization (ensure Core Web Vitals targets met)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Edit/Delete (Phase 8)**: Depends on User Stories 3 and 4 completion
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on User Story 1 (authentication required) - Can start immediately after US1
- **User Story 3 (P2)**: Depends on User Story 2 (dashboard needed) - Can start after US2
- **User Story 4 (P2)**: Depends on User Story 3 (items needed) - Can start after US3
- **User Story 5 (P3)**: Depends on User Story 3 (wishlists and items needed) - Can start after US3

### Within Each User Story

- Server actions before UI components
- Data fetching before display components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T004, T005, T007)
- All Foundational tasks marked [P] can run in parallel (T011, T012)
- Once Foundational phase completes:
  - User Story 1 can start (authentication)
  - After US1, User Stories 2, 3 can be planned in parallel (but US2 should complete first)
- All Edit/Delete tasks marked [P] can run in parallel (T065-T073)
- All Polish tasks marked [P] can run in parallel (T074-T082)

---

## Parallel Example: User Story 3

```bash
# These tasks can run in parallel (different files):
- T036: Create new wishlist page
- T041: Create ItemForm component
- T042: Create getCategories server action

# After those complete, these can run:
- T038: Create createWishlist server action (depends on T036)
- T043: Create createItem server action (depends on T041, T042)
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Authentication)
4. Complete Phase 4: User Story 2 (Dashboard)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Auth working!)
3. Add User Story 2 → Test independently → Deploy/Demo (MVP - Dashboard!)
4. Add User Story 3 → Test independently → Deploy/Demo (Core functionality!)
5. Add User Story 4 → Test independently → Deploy/Demo (Custom categories!)
6. Add User Story 5 → Test independently → Deploy/Demo (Sharing!)
7. Add Edit/Delete → Test independently → Deploy/Demo (Full CRUD!)
8. Add Polish → Final production-ready version

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Authentication)
3. Once US1 is done:
   - Developer A: User Story 2 (Dashboard)
   - Developer B: Can start planning User Story 3
4. Once US2 is done:
   - Developer A: User Story 3 (Core functionality)
   - Developer B: User Story 4 (Custom categories)
   - Developer C: User Story 5 (Sharing)
5. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All tasks include exact file paths for clarity
- Server Actions use Next.js Server Actions pattern (not API routes unless specified)
- Client components marked with `"use client"` directive
- Server components are default (no directive needed)

