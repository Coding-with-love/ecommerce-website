import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, Star } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { getProductById, getRelatedProducts } from "@/app/actions/product-actions"
import { formatCurrency } from "@/lib/utils"
import AddToCartButton from "@/components/add-to-cart-button"
import { HeartButton } from "@/components/heart-button"
import ProductGallery from "@/components/product-gallery"
import ProductImageGallery from "@/components/product-image-gallery"
import Header from "@/components/header"
import Footer from "@/components/footer"


export const dynamic = "force-dynamic" // Ensure the page is always up-to-date

export async function generateMetadata({ params }: { params: { id: string } }) {
  const response = await getProductById(params.id)
  const product = response.success ? response.data : null

  if (!product) {
    return {
      title: "Product Not Found | Modest Threads",
      description: "The requested product could not be found.",
    }
  }

  return {
    title: `${product.name} | Modest Threads`,
    description: product.description,
    openGraph: {
      images: [{ url: product.image || "/placeholder.svg" }],
    },
  }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  // Fetch product data
  const response = await getProductById(params.id)

  if (!response.success || !response.data) {
    notFound()
  }

  const product = response.data

  // Fetch related products
  const relatedResponse = await getRelatedProducts(params.id, product.category)
  const relatedProducts = relatedResponse.success ? relatedResponse.data : []

  // Generate dummy reviews for display purposes
  const reviews = [
    {
      id: "1",
      name: "Sarah M.",
      rating: 5,
      date: "2 months ago",
      comment:
        "Beautiful fabric and excellent craftsmanship. The fit is perfect and very comfortable for all-day wear.",
    },
    {
      id: "2",
      name: "Aisha K.",
      rating: 4,
      date: "3 weeks ago",
      comment: "Lovely design and the material is high quality. Shipping was fast and the packaging was beautiful.",
    },
    {
      id: "3",
      name: "Fatima J.",
      rating: 5,
      date: "1 month ago",
      comment:
        "This is my third purchase from Modest Threads and I'm never disappointed. The attention to detail is amazing.",
    },
  ]

  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  return (
    <div className="flex flex-col min-h-screen">
      {/* Include the Header component */}
      <Header />

      {/* Main content */}
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-olive-50 py-4 border-b border-olive-100">
          <div className="container px-4 md:px-6">
            <div className="flex items-center text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/collection" className="hover:text-foreground transition-colors">
                Collection
              </Link>
              <span className="mx-2">/</span>
              <Link
                href={`/collection?category=${encodeURIComponent(product.category || "")}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category || "Products"}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium truncate">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
              {/* Product Images */}
              <div className="relative">
                <div className="sticky top-24">
                  <ProductImageGallery product={product} />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <Link
                    href="/collection"
                    className="inline-flex items-center text-sm text-olive-700 hover:text-olive-900 mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Collection
                  </Link>

                  {/* Category Badge */}
                  {product.category && (
                    <div className="mb-3">
                      <Badge variant="outline" className="bg-olive-50 text-olive-800 hover:bg-olive-100">
                        {product.category}
                      </Badge>
                    </div>
                  )}

                  <h1 className="text-3xl md:text-4xl font-serif mb-4">{product.name}</h1>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-medium">
                      {formatCurrency(product.price, product.currency || "USD")}
                    </div>
                    <div className="text-sm">
                      {product.stock_status === "in_stock" ? (
                        <span className="text-green-600 flex items-center">
                          <Check className="h-4 w-4 mr-1" /> In Stock
                        </span>
                      ) : product.stock_status === "low_stock" ? (
                        <span className="text-amber-600">Low Stock</span>
                      ) : (
                        <span className="text-red-600">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  {/* Reviews summary */}
                  <div className="flex items-center mt-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(averageRating)
                              ? "text-amber-400 fill-amber-400"
                              : i < averageRating
                                ? "text-amber-400 fill-amber-400 opacity-50"
                                : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {averageRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Product Description */}
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Description</h2>
                  <div className="text-muted-foreground space-y-4">
                    <p>{product.description}</p>
                    {product.details && <p>{product.details}</p>}
                  </div>
                </div>

                {/* Product Attributes */}
                {product.attributes && (
                  <div className="space-y-6">
                    {/* Size Selection */}
                    {product.attributes.sizes && product.attributes.sizes.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-3">Size</h3>
                        <div className="flex flex-wrap gap-3">
                          {product.attributes.sizes.map((size) => (
                            <button
                              key={size}
                              className="px-4 py-2 border border-olive-200 rounded-md hover:border-olive-800 hover:bg-olive-50 focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2"
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Selection */}
                    {product.attributes.colors && product.attributes.colors.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-3">Color</h3>
                        <div className="flex flex-wrap gap-3">
                          {product.attributes.colors.map((color) => (
                            <button
                              key={color.name}
                              className="w-10 h-10 rounded-full border-2 border-white shadow hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-olive-500 focus:ring-offset-2"
                              style={{ backgroundColor: color.value }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                {/* Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <AddToCartButton product={product} />
                    </div>
                    <HeartButton product={product} className="h-12 w-12" />
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-olive-50 p-4 rounded-lg text-sm">
                    <p className="font-medium mb-2">Free shipping on orders over $100</p>
                    <p className="text-muted-foreground">Estimated delivery: 3-5 business days</p>
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h3 className="font-medium mb-1">Material</h3>
                      <p className="text-muted-foreground">{product.material || "Premium fabric"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Care</h3>
                      <p className="text-muted-foreground">{product.care || "Hand wash or dry clean"}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">SKU</h3>
                      <p className="text-muted-foreground">{product.sku || product.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Category</h3>
                      <p className="text-muted-foreground">{product.category || "Modest Fashion"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-16 bg-olive-50">
            <div className="container px-4 md:px-6">
              <h2 className="text-2xl md:text-3xl font-serif mb-8">You May Also Like</h2>
              <ProductGallery initialProducts={relatedProducts.slice(0, 4)} />
            </div>
          </section>
        )}
      </main>

      {/* Include the Footer component */}
      <Footer />
    </div>
  )
}
