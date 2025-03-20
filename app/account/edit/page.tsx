"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function EditProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "",
    phone: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function getProfile() {
      setIsLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/account/login")
        return
      }

      // Get user profile
      const { data: customer, error } = await supabase.from("customers").select("*").eq("id", session.user.id).single()

      if (error || !customer) {
        console.error("Error fetching profile:", error)
        setError("Failed to load your profile. Please try again.")
        setIsLoading(false)
        return
      }

      setUser(customer)
      setFormData({
        name: customer.name || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        postal_code: customer.postal_code || "",
        country: customer.country || "",
        phone: customer.phone || "",
      })
      setIsLoading(false)
    }

    getProfile()
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess(false)

    try {
      const { error } = await supabase
        .from("customers")
        .update({
          name: formData.name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          phone: formData.phone,
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating profile:", error)
        setError("Failed to update your profile. Please try again.")
        return
      }

      setSuccess(true)

      // Update local user state
      setUser({
        ...user,
        ...formData,
      })

      // Redirect back to account page after a short delay
      setTimeout(() => {
        router.push("/account")
      }, 2000)
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen pt-20">
        <div className="container px-4 py-16 md:px-6">
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen pt-20">
      <div className="container px-4 py-16 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-serif">Edit Profile</h1>
            <Button asChild variant="outline" size="sm">
              <Link href="/account">Back to Account</Link>
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Your profile has been updated successfully! Redirecting...</AlertDescription>
            </Alert>
          )}

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your account details and shipping information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Shipping Address</h3>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" name="city" value={formData.city} onChange={handleChange} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input id="state" name="state" value={formData.state} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" name="country" value={formData.country} onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/account")}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}

