<!--
Sync Impact Report:
Version change: N/A → 1.0.0 (initial constitution)
Modified principles: N/A (all new)
Added sections: Technology Stack, Development Workflow
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section references constitution (no changes needed, dynamic reference)
  ✅ spec-template.md - No direct references, aligns with principles (no changes needed)
  ✅ tasks-template.md - Task organization aligns with principles (no changes needed)
  ✅ checklist-template.md - Generic template, no updates needed
Follow-up TODOs: None
-->

# Wishlist Constitution

## Core Principles

### I. Clean & Modular Code
Code MUST be organized into small, focused, reusable modules. Each module MUST have a single responsibility. Functions and components MUST be concise and well-named. Code MUST be self-documenting through clear naming and structure. Complex logic MUST be broken into smaller functions. Shared utilities MUST live in appropriate directories (`app/lib/`, `app/utils/`). Rationale: Clean, modular code improves maintainability, testability, and enables parallel development.

### II. Next.js Best Practices (Server-First Architecture)
The application MUST leverage Next.js App Router server components by default. Client components (`"use client"`) are ONLY used when interactivity is required (user input, browser APIs, state management, event handlers). Server components handle data fetching, rendering, and SEO optimization. Route handlers and Server Actions MUST be preferred over API routes when possible. Image optimization MUST use `next/image`. Fonts MUST use `next/font`. Metadata MUST be defined using the Metadata API. Rationale: Server-first approach improves performance, reduces client bundle size, provides better SEO, and follows Next.js recommended patterns.

### III. Type Safety (NON-NEGOTIABLE)
All code MUST be written in TypeScript with strict type checking enabled. No `any` types without explicit justification documented inline. Interfaces and types MUST be defined for all data structures, API responses, component props, and function parameters. Type definitions MUST be co-located with their usage or in shared `types/` directories. Rationale: Type safety prevents runtime errors, improves developer experience, enables better IDE support, and facilitates confident refactoring.

### IV. Testing Discipline
Critical user flows MUST have integration tests. Component interactions and API contracts MUST be tested. Unit tests are required for complex business logic and utility functions. Tests are written alongside implementation, not as afterthought. Test files MUST be co-located with source files or in dedicated `__tests__/` directories. Rationale: Testing ensures reliability, prevents regressions, and enables confident refactoring and feature additions.

### V. Performance & Accessibility
The application MUST meet Core Web Vitals thresholds (LCP < 2.5s, FID < 100ms, CLS < 0.1). All interactive elements MUST be keyboard accessible. Images MUST have descriptive alt text. Color contrast MUST meet WCAG AA standards. Semantic HTML MUST be used appropriately. Loading states and error boundaries MUST be implemented for better UX. Rationale: Performance and accessibility are essential for user experience, inclusive design, and SEO.

## Technology Stack

**Framework**: Next.js 16+ (App Router)  
**Language**: TypeScript 5+  
**Styling**: Tailwind CSS 4+  
**React**: React 19+  
**Linting**: ESLint with Next.js config  
**Package Manager**: npm

**Constraints**: 
- No client-side state management libraries until complexity justifies (start with React state, Context API)
- Prefer Next.js built-in features over external dependencies (Server Actions over API routes, `next/image` over `<img>`)
- Server components by default; client components only when necessary
- Use TypeScript strict mode

## Development Workflow

**Code Review**: All PRs MUST be reviewed before merge. Constitution compliance MUST be verified during review.

**Branching**: Feature branches follow pattern `[###-feature-name]`. Main branch is protected.

**Commits**: Clear, descriptive commit messages following conventional commits format. Atomic commits preferred.

**Documentation**: Feature specifications in `/specs/[###-feature-name]/spec.md`. Implementation plans in `/specs/[###-feature-name]/plan.md`.

**Quality Gates**: 
- TypeScript compilation must pass with no errors
- ESLint must pass with no errors
- No console errors in development
- Core Web Vitals must meet thresholds in production builds
- All tests must pass

## Governance

This constitution supersedes all other development practices. Amendments require:
1. Documentation of the change and rationale
2. Update to this file with version bump (semantic versioning: MAJOR for breaking changes, MINOR for additions, PATCH for clarifications)
3. Propagation to dependent templates and documentation
4. Team review and approval

All PRs and reviews MUST verify compliance with these principles. Complexity beyond these principles MUST be justified with explicit rationale.

**Version**: 1.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27
