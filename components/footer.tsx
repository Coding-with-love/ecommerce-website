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
                  Our Collection
                </Link>
              </li>
              <li>
                <Link href="/collection?category=abayas" className="text-white/70 hover:text-white transition-colors">
                  Abayas
                </Link>
              </li>
              <li>
                <Link href="/collection?category=hijabs" className="text-white/70 hover:text-white transition-colors">
                  Hijabs
                </Link>
              </li>
              <li>
                <Link href="/collection?category=dresses" className="text-white/70 hover:text-white transition-colors">
                  Dresses
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
                <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} Modest Threads. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Payment Method Icons */}
            <div className="flex items-center space-x-3">
              {/* Visa */}
              <svg className="h-8" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.0332 15.0494H15.5454L17.7848 0.950623H21.2726L19.0332 15.0494Z" fill="white" />
                <path
                  d="M32.1 1.3776C31.3046 1.0824 30.0578 0.760742 28.5303 0.760742C25.0425 0.760742 22.5879 2.5968 22.5879 5.2968C22.5879 7.3328 24.3306 8.4752 25.6726 9.1752C27.0146 9.8752 27.4516 10.3328 27.4516 10.9376C27.4516 11.8704 26.2998 12.2896 25.2306 12.2896C23.7031 12.2896 22.8698 12.0512 21.6228 11.5552L21.1479 11.3552L20.6729 14.4272C21.6228 14.8272 23.3655 15.1776 25.1849 15.1776C28.9294 15.1776 31.3461 13.3608 31.3461 10.4608C31.3461 8.8608 30.4749 7.6224 28.5303 6.6512C27.3213 5.9896 26.6211 5.5512 26.6211 4.9272C26.6211 4.3608 27.2835 3.7944 28.6255 3.7944C29.7393 3.7944 30.5347 4.0136 31.1592 4.2328L31.5009 4.3944L31.9759 1.5776L32.1 1.3776Z"
                  fill="white"
                />
                <path
                  d="M37.0365 9.9368C37.3782 9.0424 38.4541 5.9896 38.4541 5.9896C38.4541 5.9896 38.6541 5.4744 38.7782 5.1792L38.9782 5.9128C38.9782 5.9128 39.6405 9.1368 39.8026 9.9368H37.0365ZM41.9468 0.950623H39.1807C38.3474 0.950623 37.7229 1.1888 37.3812 2.0832L31.9761 15.0496H35.8706C35.8706 15.0496 36.4951 13.3664 36.6192 13.0328C37.0365 13.0328 40.5243 13.0328 41.0751 13.0328C41.1992 13.4712 41.5409 15.0496 41.5409 15.0496H45.0287L41.9468 0.950623Z"
                  fill="white"
                />
                <path
                  d="M13.3059 0.950623L9.65747 10.5272L9.28166 8.8824C8.59954 6.7512 6.45492 4.4128 4.06219 3.1744L7.36801 15.0304H11.2625L16.9191 0.950623H13.3059Z"
                  fill="white"
                />
                <path
                  d="M6.16699 0.950623H0.5L0.375 1.2648C4.93552 2.3688 8.01929 5.2968 9.28169 8.8824L7.96382 2.1024C7.71967 1.1888 7.05967 0.988223 6.16699 0.950623Z"
                  fill="#F79410"
                />
              </svg>

              {/* Mastercard */}
              <svg className="h-8" viewBox="0 0 48 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4142 29.5H30.5858V3.5H17.4142V29.5Z" fill="#FF5F00" />
                <path
                  d="M18.2954 16.5C18.2954 11.2 20.7954 6.5 24.5954 3.5C22.0954 1.5 18.7954 0.5 15.4954 0.5C7.19535 0.5 0.595352 7.7 0.595352 16.5C0.595352 25.3 7.19535 32.5 15.4954 32.5C18.7954 32.5 22.0954 31.5 24.5954 29.5C20.7954 26.5 18.2954 21.8 18.2954 16.5Z"
                  fill="#EB001B"
                />
                <path
                  d="M47.4954 16.5C47.4954 25.3 40.8954 32.5 32.5954 32.5C29.2954 32.5 25.9954 31.5 23.4954 29.5C27.2954 26.5 29.7954 21.8 29.7954 16.5C29.7954 11.2 27.2954 6.5 23.4954 3.5C25.9954 1.5 29.2954 0.5 32.5954 0.5C40.8954 0.5 47.4954 7.7 47.4954 16.5Z"
                  fill="#F79E1B"
                />
              </svg>

              {/* PayPal */}
              <svg className="h-6" viewBox="0 0 101 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M36.5 7.3H31.7C31.4 7.3 31.1 7.5 31 7.8L28.6 19.7C28.6 19.9 28.7 20 28.9 20H31.2C31.5 20 31.8 19.8 31.9 19.5L32.5 16.4C32.6 16.1 32.9 15.9 33.2 15.9H34.8C37.8 15.9 39.5 14.5 40 11.7C40.2 10.5 40 9.5 39.4 8.8C38.7 7.9 37.8 7.3 36.5 7.3ZM37 11.9C36.7 13.5 35.5 13.5 34.3 13.5H33.6L34.2 10.4C34.2 10.2 34.4 10.1 34.6 10.1H34.9C35.7 10.1 36.5 10.1 36.9 10.6C37.1 10.9 37.1 11.3 37 11.9Z"
                  fill="white"
                />
                <path
                  d="M51.3 11.8H49C48.8 11.8 48.6 11.9 48.6 12.1L48.5 12.6L48.4 12.4C47.9 11.7 46.9 11.5 45.9 11.5C43.7 11.5 41.8 13.1 41.4 15.4C41.2 16.5 41.5 17.6 42.1 18.3C42.7 19 43.6 19.3 44.6 19.3C46.3 19.3 47.3 18.2 47.3 18.2L47.2 18.7C47.2 18.9 47.3 19 47.5 19H49.6C49.9 19 50.2 18.8 50.3 18.5L51.6 12.1C51.6 12 51.5 11.8 51.3 11.8ZM48.2 15.5C48 16.6 47.1 17.4 46 17.4C45.4 17.4 44.9 17.2 44.7 16.9C44.5 16.6 44.4 16.1 44.5 15.6C44.7 14.5 45.6 13.7 46.7 13.7C47.3 13.7 47.7 13.9 48 14.2C48.2 14.6 48.3 15 48.2 15.5Z"
                  fill="white"
                />
                <path
                  d="M65.2 11.8H62.9C62.7 11.8 62.5 11.9 62.4 12L59.5 16.2L58.2 12.2C58.1 11.9 57.9 11.8 57.6 11.8H55.4C55.2 11.8 55 12 55.1 12.2L57.6 18.9L55.3 22.1C55.2 22.3 55.3 22.5 55.5 22.5H57.8C58 22.5 58.2 22.4 58.3 22.3L65.4 12.2C65.5 12 65.4 11.8 65.2 11.8Z"
                  fill="white"
                />
                <path
                  d="M74.1 7.3H69.3C69 7.3 68.7 7.5 68.6 7.8L66.2 19.7C66.2 19.9 66.3 20 66.5 20H68.9C69.1 20 69.3 19.9 69.3 19.7L69.9 16.4C70 16.1 70.3 15.9 70.6 15.9H72.2C75.2 15.9 76.9 14.5 77.4 11.7C77.6 10.5 77.4 9.5 76.8 8.8C76.2 7.9 75.3 7.3 74.1 7.3ZM74.5 11.9C74.2 13.5 73 13.5 71.8 13.5H71.1L71.7 10.4C71.7 10.2 71.9 10.1 72.1 10.1H72.4C73.2 10.1 74 10.1 74.4 10.6C74.6 10.9 74.6 11.3 74.5 11.9Z"
                  fill="white"
                />
                <path
                  d="M88.8 11.8H86.5C86.3 11.8 86.1 11.9 86.1 12.1L86 12.6L85.9 12.4C85.4 11.7 84.4 11.5 83.4 11.5C81.2 11.5 79.3 13.1 78.9 15.4C78.7 16.5 79 17.6 79.6 18.3C80.2 19 81.1 19.3 82.1 19.3C83.8 19.3 84.8 18.2 84.8 18.2L84.7 18.7C84.7 18.9 84.8 19 85 19H87.1C87.4 19 87.7 18.8 87.8 18.5L89.1 12.1C89.1 12 89 11.8 88.8 11.8ZM85.7 15.5C85.5 16.6 84.6 17.4 83.5 17.4C82.9 17.4 82.4 17.2 82.2 16.9C82 16.6 81.9 16.1 82 15.6C82.2 14.5 83.1 13.7 84.2 13.7C84.8 13.7 85.2 13.9 85.5 14.2C85.7 14.6 85.8 15 85.7 15.5Z"
                  fill="white"
                />
                <path
                  d="M92.5 8.1L90 19.7C90 19.9 90.1 20 90.3 20H92.3C92.6 20 92.9 19.8 93 19.5L95.4 7.6C95.4 7.4 95.3 7.3 95.1 7.3H92.8C92.6 7.3 92.5 7.4 92.5 8.1Z"
                  fill="white"
                />
                <path
                  d="M12.4 3.1H6.2C5.9 3.1 5.6 3.3 5.5 3.6L3 16.3C3 16.5 3.1 16.6 3.3 16.6H6.3C6.6 16.6 6.9 16.4 7 16.1L7.6 12.7C7.7 12.4 8 12.2 8.3 12.2H10C13.2 12.2 15 10.7 15.5 7.7C15.7 6.4 15.5 5.3 14.9 4.6C14.1 3.7 13.4 3.1 12.4 3.1Z"
                  fill="#009EE3"
                />
                <path
                  d="M12.4 3.1H6.2C5.9 3.1 5.6 3.3 5.5 3.6L3 16.3C3 16.5 3.1 16.6 3.3 16.6H6.3C6.6 16.6 6.9 16.4 7 16.1L7.6 12.7C7.7 12.4 8 12.2 8.3 12.2H10C13.2 12.2 15 10.7 15.5 7.7C15.7 6.4 15.5 5.3 14.9 4.6C14.1 3.7 13.4 3.1 12.4 3.1Z"
                  fill="#009EE3"
                />
                <path
                  d="M12.9 7.9C12.6 9.6 11.3 9.6 10.1 9.6H9.3L9.9 6.3C10 6.1 10.1 6 10.3 6H10.7C11.5 6 12.3 6 12.8 6.5C13 6.8 13 7.3 12.9 7.9Z"
                  fill="white"
                />
                <path
                  d="M25.2 7.8H21.9C21.7 7.8 21.6 7.9 21.5 8.1L19 20.8C19 21 19.1 21.1 19.3 21.1H20.9C21.1 21.1 21.3 21 21.3 20.8L21.9 17.4C22 17.1 22.3 16.9 22.6 16.9H24.3C27.5 16.9 29.3 15.4 29.8 12.4C30 11.1 29.8 10 29.2 9.3C28.4 8.3 27 7.8 25.2 7.8Z"
                  fill="#009EE3"
                />
                <path
                  d="M25.7 12.6C25.4 14.3 24.1 14.3 22.9 14.3H22.1L22.7 11C22.8 10.8 22.9 10.7 23.1 10.7H23.5C24.3 10.7 25.1 10.7 25.6 11.2C25.8 11.5 25.8 12 25.7 12.6Z"
                  fill="white"
                />
              </svg>

              {/* Apple Pay */}
              <svg className="h-6" viewBox="0 0 43 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.2 3.6C6.8 4.1 6.1 4.5 5.5 4.4C5.4 3.8 5.7 3.1 6 2.7C6.4 2.2 7.1 1.8 7.7 1.8C7.7 2.4 7.5 3.1 7.2 3.6ZM7.7 4.6C6.7 4.5 5.9 5.1 5.4 5.1C4.9 5.1 4.2 4.6 3.4 4.6C2.4 4.6 1.4 5.3 0.9 6.3C-0.1 8.3 0.6 11.3 1.6 12.9C2.1 13.7 2.6 14.6 3.4 14.6C4.1 14.6 4.4 14.1 5.2 14.1C6 14.1 6.3 14.6 7 14.6C7.7 14.6 8.2 13.8 8.7 13C9.3 12.1 9.5 11.2 9.5 11.1C9.5 11.1 8.1 10.6 8.1 9C8.1 7.6 9.2 7 9.3 6.9C8.6 5.9 7.6 5.8 7.2 5.8C6.7 4.6 7.7 4.6 7.7 4.6ZM13.7 2.2V14.5H15.6V10.1H18.5C21.1 10.1 23 8.3 23 6.1C23 3.9 21.2 2.1 18.6 2.1H13.7V2.2ZM15.6 3.8H18C19.7 3.8 21 4.7 21 6.2C21 7.7 19.8 8.6 18 8.6H15.6V3.8ZM26.3 14.6C27.5 14.6 28.6 14 29.2 13H29.3V14.5H31V7.5C31 5.5 29.5 4.1 27.1 4.1C24.9 4.1 23.3 5.5 23.2 7.3H24.9C25 6.4 25.8 5.7 27 5.7C28.4 5.7 29.2 6.4 29.2 7.7V8.6L26.6 8.8C24.2 9 22.9 10 22.9 11.7C22.9 13.5 24.3 14.6 26.3 14.6ZM26.8 13C25.6 13 24.7 12.4 24.7 11.5C24.7 10.6 25.5 10 27.1 9.9L29.2 9.7V10.6C29.2 12 28.1 13 26.8 13ZM33.7 18C35.5 18 36.4 17.3 37.2 15.2L41 4.3H39.1L36.4 12.7H36.3L33.6 4.3H31.6L35.2 14.8L35 15.4C34.6 16.5 34 16.9 33 16.9C32.8 16.9 32.5 16.9 32.3 16.9V18C32.5 18 33.1 18 33.7 18Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
