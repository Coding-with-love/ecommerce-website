"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { CartButton } from "@/components/cart-button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase"
import { isAdmin } from "@/lib/admin"
import Logo from "@/public/HEADER.png"
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)

      // Check if user is admin
      if (session?.user) {
        const adminCheck = await isAdmin()
        setIsAdminUser(adminCheck)
      }

      // Set up listener for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user || null)

        // Check admin status when auth state changes
        if (session?.user) {
          const adminCheck = await isAdmin()
          setIsAdminUser(adminCheck)
        } else {
          setIsAdminUser(false)
        }
      })

      return () => {
        authListener?.subscription.unsubscribe()
      }
    }

    getUser()
  }, [])

  // Determine if we're on the homepage
  const isHomePage = pathname === "/"

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHomePage ? "bg-white/95 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container flex items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center z-10">
          <div className="relative h-12 w-36">
            {scrolled || !isHomePage ? (
              <Image
                src={Logo}
                alt="Modest Threads Logo"
                fill
                className="object-contain rounded-xl"
              />
            ) : (
              <div className="relative h-full w-full flex items-center">
                <span className="font-serif text-xl text-white">Modest Threads</span>
              </div>
            )}
          </div>
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          <Link
            href="/"
            className={cn(
              "text-sm uppercase tracking-wider font-medium transition-colors hover:text-grey",
              scrolled || !isHomePage ? "text-black" : "text-white",
              pathname === "/" && "text-white font-semibold",
            )}
          >
            Home
          </Link>
          <Link
            href="/collection"
            className={cn(
              "text-sm uppercase tracking-wider font-medium transition-colors hover:text-primary",
              scrolled || !isHomePage ? "text-black" : "text-white",
              pathname === "/collection" && "text-white font-semibold",
            )}
          >
            Collection
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-sm uppercase tracking-wider font-medium transition-colors hover:text-primary",
              scrolled || !isHomePage ? "text-black" : "text-white",
              pathname === "/about" && "text-white font-semibold",
            )}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={cn(
              "text-sm uppercase tracking-wider font-medium transition-colors hover:text-primary",
              scrolled || !isHomePage ? "text-black" : "text-white",
              pathname === "/contact" && "text-white font-semibold",
            )}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
        <div className={cn("transition-colors duration-300", scrolled || !isHomePage ? "text-black" : "text-white")}>
            <CartButton />
          </div>

          {/* Account dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("transition-colors duration-300", scrolled || !isHomePage ? "text-black" : "text-white")}
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white border border-gray-200 shadow-lg z-50 rounded-md !opacity-100"
              style={{ backgroundColor: "white" }}
              sideOffset={12}
              forceMount
            >
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/account"
                      className="text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 font-medium px-4 py-2.5 cursor-pointer"
                    >
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  {isAdminUser && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 font-medium px-4 py-2.5 cursor-pointer"
                      >
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 font-medium px-4 py-2.5 cursor-pointer"
                  >
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/account/login"
                      className="text-gray-800 hover:bg-gray-100 focus:bg-gray-100 focus:text-gray-900 font-medium px-4 py-2.5 cursor-pointer"
                    >
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden transition-colors duration-300",
              scrolled || !isHomePage ? "text-black" : "text-white",
            )}
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image
                  src={Logo}
                  alt="Modest Threads Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-lg">Modest Threads</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="mt-16 px-4 sm:px-6">
            <ul className="flex flex-col gap-8">
              <li>
                <Link
                  href="/"
                  className={cn("text-2xl font-serif", pathname === "/" ? "text-white font-medium" : "text-primary")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/collection"
                  className={cn(
                    "text-2xl font-serif",
                    pathname === "/collection" ? "text-white font-medium" : "text-gray-800",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={cn(
                    "text-2xl font-serif",
                    pathname === "/about" ? "text-white font-medium" : "text-gray-800",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={cn(
                    "text-2xl font-serif",
                    pathname === "/contact" ? "text-white font-medium" : "text-gray-800",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className={cn(
                    "text-2xl font-serif",
                    pathname === "/account" ? "text-white font-medium" : "text-gray-800",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
              </li>
            </ul>
            <div className="mt-16">
              <Button asChild className="w-full rounded-none">
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact Us
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

