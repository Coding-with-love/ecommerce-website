import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-6 md:col-span-2">
            <div className="flex items-center space-x-3">
              <span className="font-serif text-2xl">MODEST ELEGANCE</span>
            </div>
            <p className="text-white/70 leading-relaxed max-w-md">
              Timeless modest fashion for the modern woman. Our handcrafted abayas and hijabs blend traditional elegance
              with contemporary design.
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
            <h3 className="text-sm uppercase tracking-wider font-medium">Shop</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/collection" className="text-white/70 hover:text-white transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/abayas" className="text-white/70 hover:text-white transition-colors">
                  Abayas
                </Link>
              </li>
              <li>
                <Link href="/hijabs" className="text-white/70 hover:text-white transition-colors">
                  Hijabs
                </Link>
              </li>
              <li>
                <Link href="/new-arrivals" className="text-white/70 hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/best-sellers" className="text-white/70 hover:text-white transition-colors">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-wider font-medium">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-white/70 hover:text-white transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} Modest Elegance. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img src="/placeholder.svg?height=24&width=38" alt="Visa" className="h-6" />
            <img src="/placeholder.svg?height=24&width=38" alt="Mastercard" className="h-6" />
            <img src="/placeholder.svg?height=24&width=38" alt="PayPal" className="h-6" />
            <img src="/placeholder.svg?height=24&width=38" alt="Apple Pay" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  )
}

