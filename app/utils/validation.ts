// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation (min 8 chars, at least one letter and one number)
export function isValidPassword(password: string): boolean {
  if (password.length < 8) {
    return false
  }
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  return hasLetter && hasNumber
}

export function getPasswordErrorMessage(password: string): string | null {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long'
  }
  if (!/[a-zA-Z]/.test(password)) {
    return 'Password must contain at least one letter'
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least one number'
  }
  return null
}

// Text length validation
export function isValidLength(
  text: string,
  min: number,
  max: number
): boolean {
  const length = text.trim().length
  return length >= min && length <= max
}

export function validateWishlistName(name: string): string | null {
  const trimmed = name.trim()
  if (trimmed.length === 0) {
    return 'Wishlist name is required'
  }
  if (trimmed.length > 100) {
    return 'Wishlist name must be 100 characters or less'
  }
  return null
}

export function validateItemName(name: string): string | null {
  const trimmed = name.trim()
  if (trimmed.length === 0) {
    return 'Item name is required'
  }
  if (trimmed.length > 200) {
    return 'Item name must be 200 characters or less'
  }
  return null
}

export function validateItemDescription(description: string): string | null {
  if (description && description.length > 1000) {
    return 'Item description must be 1000 characters or less'
  }
  return null
}

export function validateCategoryName(name: string): string | null {
  const trimmed = name.trim()
  if (trimmed.length === 0) {
    return 'Category name is required'
  }
  if (trimmed.length > 50) {
    return 'Category name must be 50 characters or less'
  }
  return null
}

// Multiple email validation
export function validateEmailList(emails: string[]): {
  valid: boolean
  invalidEmails: string[]
} {
  const invalidEmails = emails.filter((email) => !isValidEmail(email))
  return {
    valid: invalidEmails.length === 0,
    invalidEmails,
  }
}

// Check if recipient list is valid (1-10 emails)
export function validateRecipientList(emails: string[]): string | null {
  if (emails.length === 0) {
    return 'At least one recipient email is required'
  }
  if (emails.length > 10) {
    return 'Maximum 10 recipient emails allowed'
  }
  const { valid, invalidEmails } = validateEmailList(emails)
  if (!valid) {
    return `Invalid email addresses: ${invalidEmails.join(', ')}`
  }
  return null
}

