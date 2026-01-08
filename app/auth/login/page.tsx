import { LoginForm } from '@/app/components/auth/LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login | Wishlist App',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <LoginForm />
    </div>
  )
}

