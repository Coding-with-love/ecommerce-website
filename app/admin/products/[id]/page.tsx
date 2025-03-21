import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductForm } from "@/components/admin/product-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getProductById } from "@/app/actions/product-actions"
import { notFound } from "next/navigation"

export default async function EditProductPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const response = await getProductById(id)

  if (!response.success || !response.data) {
    notFound()
  }

  const product = response.data

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm initialData={product} isEditing />
        </CardContent>
      </Card>
    </div>
  )
}

