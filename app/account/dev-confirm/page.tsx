"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { confirmUserEmailAction } from "@/app/actions/auth-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

// WARNING: This page is for development purposes only
// It allows bypassing email confirmation, which should never be done in production

export default function DevConfirmPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const result = await confirmUserEmailAction(email)

      if (!result.success) {
        setError(result.error || "Failed to confirm email")
        return
      }

      setSuccess(true)
    } catch (err) {
      setError("An unexpected error occurred")
      console.error("Confirmation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen pt-20">
      <div className="container px-4 py-16 md:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif mb-2">Development Email Confirmation</h1>
            <p className="text-muted-foreground">
              This page is for development purposes only. It allows bypassing email confirmation.
            </p>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md">
              <p className="font-medium">Warning: Development Use Only</p>
              <p className="text-sm mt-1">
                This page should never be deployed to production as it bypasses security measures.
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-medium mb-2">Email Confirmed</h2>
              <p className="text-muted-foreground mb-6">The user's email has been confirmed. They can now sign in.</p>
              <Button asChild>
                <Link href="/account/login">Go to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter the user's email address"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Confirming..." : "Confirm Email"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

