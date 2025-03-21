import ProductGallery from "@/components/product-gallery"
import FeaturedCollection from "@/components/featured-collection"
import { getProducts } from "@/app/actions/product-actions"

export default async function CollectionPage() {
  const response = await getProducts()
  const products = response.success ? response.data : []

  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Collection Hero */}
      <section className="relative py-20 md:py-28 bg-olive-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-tight">Our Collection</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Each piece in our collection is meticulously crafted with attention to detail, using premium fabrics and
              exquisite embellishments to create garments that are both modest and fashion-forward.
            </p>
          </div>
        </div>
      </section>

      {/* Collection Gallery */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 md:px-6">
          <ProductGallery initialProducts={products} />
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <FeaturedCollection />
      </section>
    </div>
  )
}

