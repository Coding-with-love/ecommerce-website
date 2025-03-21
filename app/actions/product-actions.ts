"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Product schema for validation
const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  image: z.string().url("Image must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  currency: z.string().default("USD"),
  featured: z.boolean().default(false),
  in_stock: z.boolean().default(true),
})

export type ProductFormData = z.infer<typeof productSchema>

// Get all products
export async function getProducts() {
  try {
    const { data, error } = await supabaseAdmin.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return { success: false, error: "Failed to fetch products", data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    console.error("Unexpected error fetching products:", error)
    return { success: false, error: "An unexpected error occurred", data: [] }
  }
}

// Get a single product by ID
export async function getProductById(id: string) {
  try {
    const { data, error } = await supabaseAdmin.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching product:", error)
      return { success: false, error: "Failed to fetch product", data: null }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Unexpected error fetching product:", error)
    return { success: false, error: "An unexpected error occurred", data: null }
  }
}

// Create a new product
export async function createProduct(formData: ProductFormData) {
  try {
    // Validate form data
    const validatedData = productSchema.parse(formData)

    // Remove id if present (will be generated by Supabase)
    const { id, ...productData } = validatedData

    const { data, error } = await supabaseAdmin.from("products").insert(productData).select().single()

    if (error) {
      console.error("Error creating product:", error)
      return { success: false, error: "Failed to create product" }
    }

    revalidatePath("/admin/products")
    revalidatePath("/collection")
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors,
      }
    }

    console.error("Unexpected error creating product:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Update an existing product
export async function updateProduct(id: string, formData: ProductFormData) {
  try {
    // Validate form data
    const validatedData = productSchema.parse(formData)

    // Remove id from the data to update
    const { id: _, ...productData } = validatedData

    const { data, error } = await supabaseAdmin.from("products").update(productData).eq("id", id).select().single()

    if (error) {
      console.error("Error updating product:", error)
      return { success: false, error: "Failed to update product" }
    }

    revalidatePath("/admin/products")
    revalidatePath("/collection")
    revalidatePath(`/admin/products/${id}`)
    return { success: true, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: error.flatten().fieldErrors,
      }
    }

    console.error("Unexpected error updating product:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id)

    if (error) {
      console.error("Error deleting product:", error)
      return { success: false, error: "Failed to delete product" }
    }

    revalidatePath("/admin/products")
    revalidatePath("/collection")
    return { success: true }
  } catch (error) {
    console.error("Unexpected error deleting product:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

