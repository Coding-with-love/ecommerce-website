"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AdminSetupPage() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setIsLoading(false)
    }

    getUser()
  }, [])

  const addAsAdmin = async () => {
    if (!user) return

    setIsAdding(true)
    setError("")
    setSuccess(false)

    try {
      // Check if already an admin
      const { data: existingAdmin } = await supabase.from("admins").select("*").eq("user_id", user.id).single()

      if (existingAdmin) {
        setSuccess(true)
        return
      }

      // Add user as admin
      const { error } = await supabase.from("admins").insert({ user_id: user.id })

      if (error) {
        console.error("Error adding admin:", error)
        setError(error.message)
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("An unexpected error occurred")
    } finally {
      setIsAdding(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Admin Setup</CardTitle>
            <CardDescription>You need to be logged in to set up an admin account</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/account/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription>Add yourself as an admin user</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>You have been successfully added as an admin!</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <p className="font-medium">Current User:</p>
              <p>{user.email}</p>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={addAsAdmin} disabled={isAdding || success}>
                {isAdding ? "Adding..." : success ? "Added as Admin" : "Add as Admin"}
              </Button>

              {success && (
                <Button asChild variant="outline">
                  <Link href="/admin">Go to Admin Dashboard</Link>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

