"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Check if already logged in and is admin
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Check if user is an admin
        const isAdminUser = session.user?.user_metadata?.role === "admin"

        if (isAdminUser) {
          router.push("/admin")
          return
        }

        // Check the database
        const { data: adminData } = await supabase.from("admins").select("*").eq("user_id", session.user.id).single()

        if (adminData) {
          router.push("/admin")
        }
      }
    }

    checkSession()
  }, [router])

  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      // Check if user is an admin
      const isAdminUser = data.user?.user_metadata?.role === "admin"

      if (!isAdminUser) {
        // Check the database
        const { data: adminData } = await supabase.from("admins").select("*").eq("user_id", data.user.id).single()

        if (!adminData) {
          setError("You do not have permission to access the admin area")
          await supabase.auth.signOut()
          return
        }
      }

      // Redirect to admin dashboard
      router.push("/admin")
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Sign in to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              Return to Store
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

