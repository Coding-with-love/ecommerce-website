"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createCustomer, updateCustomer } from "@/app/actions/admin-actions"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CustomerFormProps {
  initialData?: any
  isEditing?: boolean
}

export function CustomerForm({ initialData, isEditing = false }: CustomerFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    notes: initialData?.notes || "",
    shipping_address: {
      name: initialData?.shipping_address?.name || "",
      address: {
        line1: initialData?.shipping_address?.address?.line1 || "",
        line2: initialData?.shipping_address?.address?.line2 || "",
        city: initialData?.shipping_address?.address?.city || "",
        state: initialData?.shipping_address?.address?.state || "",
        postal_code: initialData?.shipping_address?.address?.postal_code || "",
        country: initialData?.shipping_address?.address?.country || "",
      },
    },
    billing_address: {
      name: initialData?.billing_address?.name || "",
      address: {
        line1: initialData?.billing_address?.address?.line1 || "",
        line2: initialData?.billing_address?.address?.line2 || "",
        city: initialData?.billing_address?.address?.city || "",
        state: initialData?.billing_address?.address?.state || "",
        postal_code: initialData?.billing_address?.address?.postal_code || "",
        country: initialData?.billing_address?.address?.country || "",
      },
    },
    same_as_shipping: !initialData?.billing_address || false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name.startsWith("shipping_")) {
      const field = name.replace("shipping_", "")
      setFormData((prev) => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address,
          [field]: value,
        },
      }))
    } else if (name.startsWith("shipping_address_")) {
      const field = name.replace("shipping_address_", "")
      setFormData((prev) => ({
        ...prev,
        shipping_address: {
          ...prev.shipping_address,
          address: {
            ...prev.shipping_address.address,
            [field]: value,
          },
        },
      }))
    } else if (name.startsWith("billing_")) {
      const field = name.replace("billing_", "")
      setFormData((prev) => ({
        ...prev,
        billing_address: {
          ...prev.billing_address,
          [field]: value,
        },
      }))
    } else if (name.startsWith("billing_address_")) {
      const field = name.replace("billing_address_", "")
      setFormData((prev) => ({
        ...prev,
        billing_address: {
          ...prev.billing_address,
          address: {
            ...prev.billing_address.address,
            [field]: value,
          },
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSameAsShipping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    setFormData((prev) => ({
      ...prev,
      same_as_shipping: checked,
      billing_address: checked
        ? prev.shipping_address
        : {
            name: "",
            address: {
              line1: "",
              line2: "",
              city: "",
              state: "",
              postal_code: "",
              country: "",
            },
          },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare data for submission
      const customerData = {
        ...formData,
        billing_address: formData.same_as_shipping ? formData.shipping_address : formData.billing_address,
      }

      let result

      if (isEditing && initialData?.id) {
        result = await updateCustomer(initialData.id, customerData)
      } else {
        result = await createCustomer(customerData)
      }

      if (result.success) {
        toast({
          title: isEditing ? "Customer updated" : "Customer created",
          description: isEditing
            ? "Customer has been updated successfully."
            : "Customer has been created successfully.",
        })
        router.push("/admin/customers")
      } else {
        toast({
          title: "Error",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Customer Information</CardTitle>
          <CardDescription>Enter the basic information about the customer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@example.com"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes about this customer"
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
          <CardDescription>Enter the shipping address for this customer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shipping_name">Full Name</Label>
            <Input
              id="shipping_name"
              name="shipping_name"
              value={formData.shipping_address.name}
              onChange={handleChange}
              placeholder="Enter recipient name"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping_address_line1">Address Line 1</Label>
            <Input
              id="shipping_address_line1"
              name="shipping_address_line1"
              value={formData.shipping_address.address.line1}
              onChange={handleChange}
              placeholder="Street address, P.O. box"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping_address_line2">Address Line 2 (Optional)</Label>
            <Input
              id="shipping_address_line2"
              name="shipping_address_line2"
              value={formData.shipping_address.address.line2}
              onChange={handleChange}
              placeholder="Apartment, suite, unit, building, floor, etc."
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipping_address_city">City</Label>
              <Input
                id="shipping_address_city"
                name="shipping_address_city"
                value={formData.shipping_address.address.city}
                onChange={handleChange}
                placeholder="Enter city"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_address_state">State / Province</Label>
              <Input
                id="shipping_address_state"
                name="shipping_address_state"
                value={formData.shipping_address.address.state}
                onChange={handleChange}
                placeholder="Enter state or province"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shipping_address_postal_code">Postal Code</Label>
              <Input
                id="shipping_address_postal_code"
                name="shipping_address_postal_code"
                value={formData.shipping_address.address.postal_code}
                onChange={handleChange}
                placeholder="Enter postal code"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shipping_address_country">Country</Label>
              <Input
                id="shipping_address_country"
                name="shipping_address_country"
                value={formData.shipping_address.address.country}
                onChange={handleChange}
                placeholder="Enter country"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
          <CardDescription>Enter the billing address for this customer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="checkbox"
              id="same_as_shipping"
              checked={formData.same_as_shipping}
              onChange={handleSameAsShipping}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="same_as_shipping" className="text-sm font-normal">
              Same as shipping address
            </Label>
          </div>

          {!formData.same_as_shipping && (
            <>
              <div className="space-y-2">
                <Label htmlFor="billing_name">Full Name</Label>
                <Input
                  id="billing_name"
                  name="billing_name"
                  value={formData.billing_address.name}
                  onChange={handleChange}
                  placeholder="Enter billing name"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing_address_line1">Address Line 1</Label>
                <Input
                  id="billing_address_line1"
                  name="billing_address_line1"
                  value={formData.billing_address.address.line1}
                  onChange={handleChange}
                  placeholder="Street address, P.O. box"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billing_address_line2">Address Line 2 (Optional)</Label>
                <Input
                  id="billing_address_line2"
                  name="billing_address_line2"
                  value={formData.billing_address.address.line2}
                  onChange={handleChange}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billing_address_city">City</Label>
                  <Input
                    id="billing_address_city"
                    name="billing_address_city"
                    value={formData.billing_address.address.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing_address_state">State / Province</Label>
                  <Input
                    id="billing_address_state"
                    name="billing_address_state"
                    value={formData.billing_address.address.state}
                    onChange={handleChange}
                    placeholder="Enter state or province"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billing_address_postal_code">Postal Code</Label>
                  <Input
                    id="billing_address_postal_code"
                    name="billing_address_postal_code"
                    value={formData.billing_address.address.postal_code}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billing_address_country">Country</Label>
                  <Input
                    id="billing_address_country"
                    name="billing_address_country"
                    value={formData.billing_address.address.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/customers")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Customer" : "Create Customer"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
