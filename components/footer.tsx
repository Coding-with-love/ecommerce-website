import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/20">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_6433.JPG-3CK0BdvVr3sRzMpjAwKR4YkDa6aoG8.jpeg"
                  alt="Modest Threads Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-xl">Modest Threads</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Elegance in modesty. Handcrafted abayas and modest fashion for the modern woman.
            </p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com" className="text-white/70 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://facebook.com" className="text-white/70 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" className="text-white/70 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-wider font-medium">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#collection" className="text-white/70 hover:text-white transition-colors">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-white/70 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-wider font-medium">Contact</h3>
            <ul className="space-y-4">
              <li className="text-white/70">WhatsApp: +91 7909149376</li>
              <li className="text-white/70">Email: info@modestthreads.com</li>
              <li className="text-white/70">Instagram: @reselling_abaya_esra</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-wider font-medium">Newsletter</h3>
            <p className="text-white/70">Subscribe to receive updates on new collections and exclusive offers.</p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border border-white/20 px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button type="submit" className="bg-white text-black px-4 py-2 hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} Modest Threads. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

