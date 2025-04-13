"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2, ArrowUp, ArrowDown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { uploadProductImage } from "@/app/actions/upload-actions"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
  additionalImages?: string[]
  onAdditionalImagesChange?: (urls: string[]) => void
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  additionalImages = [],
  onAdditionalImagesChange,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadTarget, setUploadTarget] = useState<"main" | "additional">("main")
  const [dragActive, setDragActive] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const additionalInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDrag = (e: React.DragEvent, target: "main" | "additional" = "main") => {
    e.preventDefault()
    e.stopPropagation()
    setUploadTarget(target)

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
      await handleUpload(e.dataTransfer.files[0], uploadTarget)
    }
  }

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>, target: "main" | "additional" = "main") => {
    e.preventDefault()

    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0], target)
    }
  }

  const handleUpload = async (file: File, target: "main" | "additional" = "main") => {
    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadProductImage(formData)

      if (result.success && result.url) {
        if (target === "main") {
          onChange(result.url)
        } else if (onAdditionalImagesChange) {
          onAdditionalImagesChange([...additionalImages, result.url])
        }

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

  const handleButtonClick = (target: "main" | "additional" = "main") => {
    if (target === "main") {
      inputRef.current?.click()
    } else {
      additionalInputRef.current?.click()
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  const handleRemoveAdditional = (index: number) => {
    if (onAdditionalImagesChange) {
      const updatedUrls = additionalImages.filter((_, i) => i !== index)
      onAdditionalImagesChange(updatedUrls)
    }
  }

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    if (!onAdditionalImagesChange) return

    if ((direction === "up" && index === 0) || (direction === "down" && index === additionalImages.length - 1)) {
      return
    }

    const updatedUrls = [...additionalImages]
    const newIndex = direction === "up" ? index - 1 : index + 1
    const temp = updatedUrls[index]
    updatedUrls[index] = updatedUrls[newIndex]
    updatedUrls[newIndex] = temp

    onAdditionalImagesChange(updatedUrls)
  }

  const handleSetAsMain = (index: number) => {
    if (!onAdditionalImagesChange) return

    // Set the selected additional image as main and move the current main to additional
    const imageToPromote = additionalImages[index]
    const updatedUrls = additionalImages.filter((_, i) => i !== index)

    // Only add the current main image to additional if it exists
    if (value) {
      updatedUrls.unshift(value)
    }

    onAdditionalImagesChange(updatedUrls)
    onChange(imageToPromote)
  }

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim() || !onAdditionalImagesChange) return

    onAdditionalImagesChange([...additionalImages, newImageUrl])
    setNewImageUrl("")
  }

  // Add a new function to clear all additional images
  const handleClearAllAdditional = () => {
    if (onAdditionalImagesChange) {
      onAdditionalImagesChange([])
    }
  }

  return (
    <div className="space-y-6">
      {/* Main Image Section */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="image">Main Product Image</Label>

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

        {/* Main image upload area */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
            dragActive && uploadTarget === "main" ? "border-primary bg-primary/5" : "border-gray-300"
          } ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragEnter={(e) => handleDrag(e, "main")}
          onDragLeave={handleDrag}
          onDragOver={(e) => handleDrag(e, "main")}
          onDrop={handleDrop}
          onClick={() => handleButtonClick("main")}
        >
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            {isUploading && uploadTarget === "main" ? (
              <>
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading main image...</p>
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
            onChange={(e) => handleChange(e, "main")}
            disabled={disabled || isUploading}
            className="hidden"
          />
        </div>

        {/* Main image preview */}
        {value && (
          <div className="aspect-square relative overflow-hidden rounded-lg border bg-muted">
            <Image src={value || "/placeholder.svg"} alt="Main product image" fill className="object-cover" />
          </div>
        )}
      </div>

      {/* Additional Images Section */}
      {onAdditionalImagesChange && (
        <div className="space-y-4 border-t pt-6">
          <div className="flex justify-between items-center">
            <Label>Additional Product Images</Label>
            {additionalImages.length > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAllAdditional}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>

          {additionalImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {additionalImages.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                    <Image
                      src={url || "/placeholder.svg"}
                      alt={`Product image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-red-500/40 hover:bg-red-500/80 text-white absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      onClick={() => handleRemoveAdditional(index)}
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={() => handleSetAsMain(index)}
                        title="Set as main image"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={() => handleMoveImage(index, "up")}
                        disabled={index === 0}
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white hover:bg-white/20"
                        onClick={() => handleMoveImage(index, "down")}
                        disabled={index === additionalImages.length - 1}
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add additional image by URL */}
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Enter additional image URL"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              disabled={disabled || isUploading}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddImageUrl}
              disabled={disabled || isUploading || !newImageUrl.trim()}
            >
              Add Image
            </Button>
          </div>

          {/* Additional images upload area */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
              dragActive && uploadTarget === "additional" ? "border-primary bg-primary/5" : "border-gray-300"
            } ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onDragEnter={(e) => handleDrag(e, "additional")}
            onDragLeave={handleDrag}
            onDragOver={(e) => handleDrag(e, "additional")}
            onDrop={handleDrop}
            onClick={() => handleButtonClick("additional")}
          >
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              {isUploading && uploadTarget === "additional" ? (
                <>
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading additional image...</p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm font-medium">Drag and drop an additional image, or click to browse</p>
                  <p className="text-xs text-muted-foreground">JPEG, PNG, WebP or GIF. Max 5MB.</p>
                </>
              )}
            </div>
            <Input
              ref={additionalInputRef}
              id="additional-file-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => handleChange(e, "additional")}
              disabled={disabled || isUploading}
              className="hidden"
            />
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Add multiple images to show different views of your product. Hover over images to reorder or set as main
            image.
          </p>
        </div>
      )}
    </div>
  )
}
