# API Routes Contracts: Wishlist Application

**Date**: 2025-01-27  
**Feature**: Wishlist Application  
**Pattern**: Next.js Route Handlers

## Email Sharing Route

### POST /api/share

**Purpose**: Send wishlist content via email to recipients

**Authentication**: Required (user must be authenticated)

**Request Body**:
```typescript
{
  wishlist_id: string;        // UUID of wishlist to share
  recipient_emails: string[]; // Array of email addresses (1-10 recipients)
}
```

**Response** (200 OK):
```typescript
{
  success: boolean;
  message: string;  // "Wishlist shared successfully"
  sent_count: number;  // Number of emails successfully sent
  failed_count: number; // Number of emails that failed
}
```

**Response** (400 Bad Request):
```typescript
{
  success: false;
  error: string;  // "Invalid email address" | "Wishlist not found" | "No recipients provided"
}
```

**Response** (401 Unauthorized):
```typescript
{
  success: false;
  error: "Unauthorized";
}
```

**Response** (500 Internal Server Error):
```typescript
{
  success: false;
  error: string;  // "Failed to send email" | "Email service error"
}
```

**Validation**:
- `wishlist_id`: Required, must be valid UUID, must belong to authenticated user
- `recipient_emails`: Required, array of 1-10 valid email addresses
- Each email must pass email format validation

**Email Content**:
- Subject: `"[Wishlist Name] - My Wishlist"`
- Body: HTML formatted with:
  - Wishlist name
  - List of items grouped by category
  - Each item shows: name, description (if available)
  - Plain text fallback

**Error Handling**:
- Invalid email addresses: Return 400 with specific invalid emails
- Wishlist not found: Return 400
- Email service failure: Return 500, log error
- Partial failures: Return 200 with `failed_count > 0`

---

## Authentication Callback Route

### GET /api/auth/callback

**Purpose**: Handle Supabase authentication callback (OAuth, email verification, etc.)

**Query Parameters**:
- `code`: Authorization code (for OAuth flows)
- `type`: Callback type (`signup` | `recovery` | `invite`)

**Response**: Redirects to appropriate page based on callback type

**Note**: This route is primarily handled by Supabase Auth helpers, but may need custom logic for specific flows.

