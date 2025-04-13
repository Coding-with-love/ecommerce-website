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
import { Loader2, Plus, X } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

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
      images: [],
      category: "",
      currency: "USD",
      featured: false,
      in_stock: true,
      stock_status: "in_stock",
      sku: "",
      material: "",
      care: "",
      details: "",
      attributes: {
        sizes: [],
        colors: [],
      },
    },
  )
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  // For managing sizes
  const [newSize, setNewSize] = useState("")

  // For managing colors
  const [newColorName, setNewColorName] = useState("")
  const [newColorValue, setNewColorValue] = useState("#000000")

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

  const handleAdditionalImagesChange = (urls: string[]) => {
    setFormData((prev) => ({ ...prev, images: urls }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle adding a new size
  const handleAddSize = () => {
    if (!newSize.trim()) return

    setFormData((prev) => {
      const currentSizes = prev.attributes?.sizes || []
      return {
        ...prev,
        attributes: {
          ...prev.attributes,
          sizes: [...currentSizes, newSize.trim()],
        },
      }
    })

    setNewSize("")
  }

  // Handle removing a size
  const handleRemoveSize = (sizeToRemove: string) => {
    setFormData((prev) => {
      const currentSizes = prev.attributes?.sizes || []
      return {
        ...prev,
        attributes: {
          ...prev.attributes,
          sizes: currentSizes.filter((size) => size !== sizeToRemove),
        },
      }
    })
  }

  // Handle adding a new color
  const handleAddColor = () => {
    if (!newColorName.trim()) return

    setFormData((prev) => {
      const currentColors = prev.attributes?.colors || []
      return {
        ...prev,
        attributes: {
          ...prev.attributes,
          colors: [...currentColors, { name: newColorName.trim(), value: newColorValue }],
        },
      }
    })

    setNewColorName("")
    setNewColorValue("#000000")
  }

  // Handle removing a color
  const handleRemoveColor = (colorName: string) => {
    setFormData((prev) => {
      const currentColors = prev.attributes?.colors || []
      return {
        ...prev,
        attributes: {
          ...prev.attributes,
          colors: currentColors.filter((color) => color.name !== colorName),
        },
      }
    })
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
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="attributes">Attributes & Variants</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
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

              <div className="space-y-2">
                <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku || ""}
                  onChange={handleChange}
                  placeholder="Enter product SKU"
                  disabled={isSubmitting}
                />
                {errors.sku && <p className="text-sm text-red-500">{errors.sku[0]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock_status">Stock Status</Label>
                <Select
                  value={formData.stock_status || "in_stock"}
                  onValueChange={(value) => handleSelectChange("stock_status", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stock status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
                {errors.stock_status && <p className="text-sm text-red-500">{errors.stock_status[0]}</p>}
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
            </div>

            <div className="space-y-6">
              <ImageUpload
                value={formData.image}
                onChange={handleImageChange}
                disabled={isSubmitting}
                additionalImages={formData.images}
                onAdditionalImagesChange={handleAdditionalImagesChange}
              />
              {errors.image && <p className="text-sm text-red-500">{errors.image[0]}</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="details">Additional Details</Label>
                <Textarea
                  id="details"
                  name="details"
                  value={formData.details || ""}
                  onChange={handleChange}
                  placeholder="Enter additional product details or specifications"
                  rows={5}
                  disabled={isSubmitting}
                />
                {errors.details && <p className="text-sm text-red-500">{errors.details[0]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Input
                  id="material"
                  name="material"
                  value={formData.material || ""}
                  onChange={handleChange}
                  placeholder="Enter product material (e.g., Cotton, Silk, etc.)"
                  disabled={isSubmitting}
                />
                {errors.material && <p className="text-sm text-red-500">{errors.material[0]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="care">Care Instructions</Label>
                <Textarea
                  id="care"
                  name="care"
                  value={formData.care || ""}
                  onChange={handleChange}
                  placeholder="Enter care instructions (e.g., Hand wash, Dry clean only, etc.)"
                  rows={3}
                  disabled={isSubmitting}
                />
                {errors.care && <p className="text-sm text-red-500">{errors.care[0]}</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attributes" className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-8">
              {/* Sizes */}
              <div className="space-y-4">
                <Label>Available Sizes</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.attributes?.sizes?.map((size) => (
                    <div key={size} className="flex items-center bg-olive-50 px-3 py-1 rounded-full">
                      <span className="mr-2">{size}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 rounded-full"
                        onClick={() => handleRemoveSize(size)}
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {size}</span>
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add a size (e.g., S, M, L, XL)"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSize}
                    disabled={isSubmitting || !newSize.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Size
                  </Button>
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-4">
                <Label>Available Colors</Label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.attributes?.colors?.map((color) => (
                    <div key={color.name} className="flex items-center bg-olive-50 px-3 py-1 rounded-full">
                      <div className="h-4 w-4 rounded-full mr-2" style={{ backgroundColor: color.value }}></div>
                      <span className="mr-2">{color.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 rounded-full"
                        onClick={() => handleRemoveColor(color.name)}
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {color.name}</span>
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Color name (e.g., Navy Blue)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1"
                  />
                  <Input
                    type="color"
                    value={newColorValue}
                    onChange={(e) => setNewColorValue(e.target.value)}
                    disabled={isSubmitting}
                    className="w-20"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddColor}
                    disabled={isSubmitting || !newColorName.trim()}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Color
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
