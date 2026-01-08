import { RegisterForm } from '@/app/components/auth/RegisterForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Register | Wishlist App',
  description: 'Create a new account',
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
      <RegisterForm />
    </div>
  )
}

