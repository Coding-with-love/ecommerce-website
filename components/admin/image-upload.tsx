"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { uploadProductImage } from "@/app/actions/upload-actions"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0])
    }
  }

  const handleUpload = async (file: File) => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadProductImage(formData)

      if (result.success && result.url) {
        onChange(result.url)
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully.",
        })
      } else {
        toast({
          title: "Upload failed",
          description: result.error || "Failed to upload image",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Upload error",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="image">Product Image</Label>

        {/* URL input */}
        <div className="flex gap-2">
          <Input
            id="image"
            placeholder="Enter image URL or upload"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || isUploading}
            className="flex-1"
          />
          {value && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          )}
        </div>
      </div>

      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-gray-300"
        } ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {isUploading ? (
            <>
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            </>
          ) : (
            <>
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">Drag and drop an image, or click to browse</p>
              <p className="text-xs text-muted-foreground">JPEG, PNG, WebP or GIF. Max 5MB.</p>
            </>
          )}
        </div>
        <Input
          ref={inputRef}
          id="file-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleChange}
          disabled={disabled || isUploading}
          className="hidden"
        />
      </div>

      {/* Image preview */}
      {value && (
        <div className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
          <Image src={value || "/placeholder.svg"} alt="Product preview" fill className="object-cover" />
        </div>
      )}
    </div>
  )
}

