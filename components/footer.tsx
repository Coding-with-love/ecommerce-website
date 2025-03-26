import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Twitter } from "lucide-react"
import Logo from "@/public/logo.png"
export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-24 overflow-hidden bg-white rounded-md">
                <Image
                  src={Logo}
                  alt="Modest Threads Logo"
                  fill
                  className="object-fill"
                  priority
                />
              </div>
              <span className="font-serif text-xl">Modest Threads</span>
            </div>
            <p className="text-white/70 leading-relaxed">
              Elegance in modesty. Handcrafted abayas and modest fashion for the modern woman.
            </p>
            <div className="flex space-x-4">
              <Link href="https://instagram.com/modesthreads.co" className="text-white/70 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
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
                <Link href="/collection" className="text-white/70 hover:text-white transition-colors">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-wider font-medium">Contact</h3>
            <ul className="space-y-4">
              <li className="text-white/70">Email: modesthreads.co@gmail.com</li>
              <li className="text-white/70">Instagram: @modesthreads.co</li>
            </ul>
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

