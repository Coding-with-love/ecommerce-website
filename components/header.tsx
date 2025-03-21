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
import Logo from "@/public/logo.png"
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
        <Link href="/" className="flex items-center space-x-2 z-10">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white/80">
            <Image
              src={Logo}
              alt="Modest Threads Logo"
              fill
              className="object-cover"
            />
          </div>
          <span
            className={cn(
              "font-serif text-xl transition-colors",
              scrolled || !isHomePage ? "text-black" : "text-white",
            )}
          >
            Modest Threads
          </span>
        </Link>

        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          <Link
            href="/"
            className={cn(
              "text-sm uppercase tracking-wider font-medium transition-colors hover:text-primary",
              scrolled || !isHomePage ? "text-black" : "text-white",
              pathname === "/" && "text-primary",
            )}
          >
            Home
          </Link>
          <Link
            href="/collection"
            className={cn(
              "text-sm uppercase tracking-wider font-medium transition-colors hover:text-primary",
              scrolled || !isHomePage ? "text-black" : "text-white",
              pathname === "/collection" && "text-primary",
            )}
          >
            Collection
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-sm uppercase tracking-wider font-medium transition-colors hover:text-primary",
              scrolled || !isHomePage ? "text-black" : "text-white",
              pathname === "/about" && "text-primary",
            )}
          >
            About
          </Link>
          <Link
            href="/contact"
            className={cn(
              "text-sm uppercase tracking-wider font-medium transition-colors hover:text-primary",
              scrolled || !isHomePage ? "text-black" : "text-white",
              pathname === "/contact" && "text-primary",
            )}
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">
        <Button
                variant="ghost"
                size="icon"
                className={cn("transition-colors duration-300", scrolled || !isHomePage ? "text-black" : "text-white")}
              >
          <CartButton />
</Button>
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
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Account</Link>
                  </DropdownMenuItem>
                  {isAdminUser && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/account/login">Sign In</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            asChild
            variant={scrolled || !isHomePage ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-none hidden sm:flex transition-all duration-300 ease-in-out",
              scrolled || !isHomePage
                ? "bg-black text-white hover:bg-black/80"
                : "border-white text-white bg-black/40 hover:bg-white hover:text-black",
            )}
          >
            <Link href="/contact">Contact Us</Link>
          </Button>

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
                  className={cn("text-2xl font-serif", pathname === "/" && "text-primary")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/collection"
                  className={cn("text-2xl font-serif", pathname === "/collection" && "text-primary")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={cn("text-2xl font-serif", pathname === "/about" && "text-primary")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={cn("text-2xl font-serif", pathname === "/contact" && "text-primary")}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className={cn("text-2xl font-serif", pathname === "/account" && "text-primary")}
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

