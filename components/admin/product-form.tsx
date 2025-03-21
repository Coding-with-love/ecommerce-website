"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { createProduct, updateProduct, type ProductFormData } from "@/app/actions/product-actions"
import { Loader2 } from "lucide-react"
import { ImageUpload } from "./image-upload"

type ProductFormProps = {
  initialData?: ProductFormData
  isEditing?: boolean
}

export function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "",
      currency: "USD",
      featured: false,
      in_stock: true,
    },
  )
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value === "" ? 0 : Number.parseFloat(value) }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }))

    // Clear error when image is changed
    if (errors.image) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.image
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      let result

      if (isEditing && initialData?.id) {
        result = await updateProduct(initialData.id, formData)
      } else {
        result = await createProduct(formData)
      }

      if (result.success) {
        toast({
          title: isEditing ? "Product updated" : "Product created",
          description: isEditing
            ? "Your product has been updated successfully."
            : "Your product has been created successfully.",
        })
        router.push("/admin/products")
      } else {
        if (result.fieldErrors) {
          setErrors(result.fieldErrors)
        }

        toast({
          title: "Error",
          description: result.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={5}
              disabled={isSubmitting}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description[0]}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleNumberChange}
                placeholder="0.00"
                disabled={isSubmitting}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                placeholder="USD"
                disabled={isSubmitting}
              />
              {errors.currency && <p className="text-sm text-red-500">{errors.currency[0]}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter product category"
              disabled={isSubmitting}
            />
            {errors.category && <p className="text-sm text-red-500">{errors.category[0]}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="featured">Featured Product</Label>
              <p className="text-sm text-muted-foreground">Featured products appear on the homepage</p>
            </div>
            <Switch
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="in_stock">In Stock</Label>
              <p className="text-sm text-muted-foreground">Products out of stock cannot be purchased</p>
            </div>
            <Switch
              id="in_stock"
              checked={formData.in_stock}
              onCheckedChange={(checked) => handleSwitchChange("in_stock", checked)}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="space-y-6">
          <ImageUpload value={formData.image} onChange={handleImageChange} disabled={isSubmitting} />
          {errors.image && <p className="text-sm text-red-500">{errors.image[0]}</p>}
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}

