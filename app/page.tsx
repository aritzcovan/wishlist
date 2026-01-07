import { redirect } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Gift } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  // Otherwise, show landing page
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Gift className="h-6 w-6" />
            <span className="text-xl font-bold">Wishlist App</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
            Create and Share Your
            <span className="block text-primary">Perfect Wishlist</span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            Organize your wishes for birthdays, holidays, and special occasions.
            Share with friends and family so they know exactly what you want.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Create Your First Wishlist
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="border-t bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">Easy to Use</h3>
              <p className="text-sm text-muted-foreground">
                Create wishlists in seconds and organize items by occasion
              </p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">Share Anywhere</h3>
              <p className="text-sm text-muted-foreground">
                Send your wishlist via email to friends and family
              </p>
            </div>
            <div className="text-center">
              <h3 className="mb-2 text-lg font-semibold">Organized</h3>
              <p className="text-sm text-muted-foreground">
                Categorize items by event with preset or custom categories
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
