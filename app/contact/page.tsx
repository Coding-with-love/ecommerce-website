import ContactSection from "@/components/contact-section"

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      {/* Contact Hero */}
      <section className="relative py-20 md:py-28 bg-olive-50">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif mb-6 tracking-tight">Contact Us</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We'd love to hear from you. Whether you have questions about our collection, custom orders, or anything
              else, our team is here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 md:py-24 bg-white">
        <ContactSection />
      </section>
    </div>
  )
}

