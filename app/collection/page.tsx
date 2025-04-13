import ProductGallery from "@/components/product-gallery"
import FeaturedCollection from "@/components/featured-collection"
import { getProducts } from "@/app/actions/product-actions"

export default async function CollectionPage() {
  const response = await getProducts()
  const products = response.success ? response.data : []

  return (
    <div className="flex flex-col min-h-screen">
      {/* Collection Hero */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-olive-50 to-white pt-32">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-tight leading-tight text-olive-900">
              Our Collection
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Each piece in our collection is meticulously crafted with attention to detail, using premium fabrics and
              exquisite embellishments to create garments that are both modest and fashion-forward.
            </p>
          </div>
        </div>

        {/* Add decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"></div>
        <div className="absolute -bottom-10 left-1/4 w-32 h-32 bg-olive-100/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-olive-200/30 rounded-full blur-3xl"></div>
      </section>

      {/* Collection Gallery - update spacing */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container px-4 md:px-6">
          <ProductGallery initialProducts={products} />
        </div>
      </section>

      {/* Featured Collection - update background */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-olive-50/50">
        <FeaturedCollection />
      </section>
    </div>
  )
}
