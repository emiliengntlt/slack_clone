'use client'

import { useUser, SignIn, SignedIn, SignedOut, useClerk, ClerkProvider } from "@clerk/nextjs"
import Dashboard from './components/Dashboard'

export function Home() {
  const { user } = useUser()
  const { signOut } = useClerk()

  const handleLogout = () => {
    signOut()
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <SignedIn>
        {user && <Dashboard user={user} onLogout={handleLogout} />}
      </SignedIn>
      <SignedOut>
        <SignIn routing="hash" />
      </SignedOut>
    </main>
  )
}

export default function App() {
  return (
    <ClerkProvider>
      <Home />
    </ClerkProvider>
  )
}