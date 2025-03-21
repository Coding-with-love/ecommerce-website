"use server"

import { supabaseAdmin } from "@/lib/supabase-admin"
import { v4 as uuidv4 } from "uuid"

export async function uploadProductImage(formData: FormData) {
  try {
    const file = formData.get("file") as File

    if (!file) {
      return { success: false, error: "No file provided" }
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.",
      }
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: "File too large. Maximum size is 5MB.",
      }
    }

    // Generate a unique filename with timestamp and original extension
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, "-")
    const extension = originalName.split(".").pop()
    const filename = `product-${timestamp}-${uuidv4()}.${extension}`

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage.from("products").upload(filename, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Supabase storage upload error:", error)
      return {
        success: false,
        error: "Failed to upload image. Please try again.",
      }
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from("products").getPublicUrl(data.path)

    // Return the URL of the uploaded image
    return {
      success: true,
      url: publicUrl,
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return {
      success: false,
      error: "Failed to upload image. Please try again.",
    }
  }
}

