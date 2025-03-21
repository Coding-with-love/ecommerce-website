import Link from "next/link"
import Image from "next/image"
import { getProducts } from "@/app/actions/product-actions"
import { formatCurrency } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"
import { DeleteProductButton } from "@/components/admin/delete-product-button"

export const dynamic = "force-dynamic" // Ensure the page is not cached

export default async function AdminProductsPage() {
  const response = await getProducts()
  const products = response.success ? response.data : []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">Add your first product to start selling.</p>
              <Button asChild>
                <Link href="/admin/products/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Image</th>
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-right py-3 px-4 font-medium">Price</th>
                    <th className="text-center py-3 px-4 font-medium">Featured</th>
                    <th className="text-center py-3 px-4 font-medium">In Stock</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-md">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium">{product.name}</div>
                      </td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(product.price, product.currency)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={product.featured ? "text-green-600" : "text-gray-400"}>
                          {product.featured ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={product.in_stock ? "text-green-600" : "text-red-600"}>
                          {product.in_stock ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/admin/products/${product.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <DeleteProductButton id={product.id} name={product.name} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

