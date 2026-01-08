'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import {
  isValidEmail,
  isValidPassword,
  getPasswordErrorMessage,
} from '@/app/utils/validation'
import type {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
  ActionResponse,
  User,
} from '@/app/types'

export async function registerUser(
  input: RegisterInput
): Promise<ActionResponse<User>> {
  // Validate email
  if (!isValidEmail(input.email)) {
    return {
      success: false,
      error: 'Invalid email format',
    }
  }

  // Validate password
  if (!isValidPassword(input.password)) {
    const passwordError = getPasswordErrorMessage(input.password)
    return {
      success: false,
      error: passwordError || 'Password does not meet requirements',
    }
  }

  const supabase = await createClient()

  // Create user (Supabase will handle duplicate email check)
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`,
    },
  })

  if (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: error.message || 'Failed to create account',
    }
  }

  if (!data.user) {
    return {
      success: false,
      error: 'Failed to create account',
    }
  }

  // Check if email confirmation is required
  if (data.session) {
    // User is logged in, redirect to dashboard (redirect throws to perform the redirect)
    revalidatePath('/dashboard', 'layout')
    redirect('/dashboard')
  } else {
    // Email confirmation required
    return {
      success: true,
      data: {
        id: data.user.id,
        email: data.user.email!,
        created_at: data.user.created_at,
      },
    }
  }
}

export async function loginUser(
  input: LoginInput
): Promise<ActionResponse<User>> {
  // Validate email
  if (!isValidEmail(input.email)) {
    return {
      success: false,
      error: 'Invalid email format',
    }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })

  if (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Invalid credentials',
    }
  }

  if (!data.user) {
    return {
      success: false,
      error: 'User not found',
    }
  }

  // Redirect to dashboard (redirect throws an error to perform the redirect)
  revalidatePath('/dashboard', 'layout')
  redirect('/dashboard')
}

export async function logoutUser(): Promise<ActionResponse> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      error: 'Failed to log out',
    }
  }

  // Redirect to login (redirect throws to perform the redirect)
  revalidatePath('/auth/login', 'layout')
  redirect('/auth/login')
}

export async function resetPassword(
  input: ResetPasswordInput
): Promise<ActionResponse> {
  // Validate email
  if (!isValidEmail(input.email)) {
    return {
      success: false,
      error: 'Invalid email format',
    }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback?type=recovery`,
    })

    if (error) {
      console.error('Password reset error:', error)
      // Don't reveal if email exists or not for security
      return {
        success: true,
        data: undefined,
      }
    }

    return {
      success: true,
      data: undefined,
    }
  } catch (error) {
    console.error('Password reset error:', error)
    return {
      success: false,
      error: 'Failed to send password reset email',
    }
  }
}

