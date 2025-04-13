"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, User, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { supabase } from "@/lib/supabase"
import { isAdmin } from "@/lib/admin"
import { formatCurrency } from "@/lib/utils"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const pathname = usePathname()
  const { items, removeFromCart, totalItems, subtotal, updateQuantity } = useCart()
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Check if we're on the homepage
  const isHomePage = pathname === "/"

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    // Set initial scroll state
    setScrolled(window.scrollY > 10)

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  // Determine header background and text colors
  const headerStyle = isHomePage && !scrolled ? "bg-transparent text-white" : "bg-olive-900 text-white"

  return (
    <>
      {/* Main Header */}
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          headerStyle,
          scrolled ? "py-2 shadow-md" : "py-3",
        )}
      >
        <div className="container flex items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10">
            <div className="relative flex items-center justify-center h-10">
              <span className="font-serif text-xl text-white drop-shadow-md whitespace-nowrap">MODEST THREADS</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm uppercase tracking-wider font-medium transition-colors text-white hover:text-white/80 drop-shadow-sm",
                pathname === "/" && "font-semibold",
              )}
            >
              Home
            </Link>
            <Link
              href="/collection"
              className={cn(
                "text-sm uppercase tracking-wider font-medium transition-colors text-white hover:text-white/80 drop-shadow-sm",
                pathname === "/collection" && "font-semibold",
              )}
            >
              Collection
            </Link>
            <Link
              href="/about"
              className={cn(
                "text-sm uppercase tracking-wider font-medium transition-colors text-white hover:text-white/80 drop-shadow-sm",
                pathname === "/about" && "font-semibold",
              )}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={cn(
                "text-sm uppercase tracking-wider font-medium transition-colors text-white hover:text-white/80 drop-shadow-sm",
                pathname === "/contact" && "font-semibold",
              )}
            >
              Contact
            </Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white drop-shadow-sm transition-colors duration-300 h-8 w-8 p-1.5"
                >
                  <User className="h-4 w-4" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="cursor-pointer">
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer">
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist" className="cursor-pointer">
                        Wishlist
                      </Link>
                    </DropdownMenuItem>
                    {isAdminUser && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/account/login" className="cursor-pointer">
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/register" className="cursor-pointer">
                        Create Account
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white drop-shadow-sm transition-colors duration-300 relative h-8 w-8 p-1.5"
                >
                  <ShoppingBag className="h-4 w-4" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-olive-900 text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                      {totalItems}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col">
                <SheetHeader>
                  <SheetTitle>Your Cart ({totalItems} items)</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-auto py-4">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg mb-1">Your cart is empty</h3>
                      <p className="text-muted-foreground mb-4">
                        Looks like you haven't added anything to your cart yet.
                      </p>
                      <Button asChild onClick={() => setIsCartOpen(false)}>
                        <Link href="/collection">Browse Collection</Link>
                      </Button>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {items.map((item) => (
                        <li key={item.product.id} className="flex gap-4 py-4 border-b">
                          <div className="relative h-20 w-16 flex-shrink-0 overflow-hidden">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{item.product.name}</h4>
                              <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-sm text-muted-foreground hover:text-foreground"
                              >
                                Remove
                              </button>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.product.category}</p>
                            <div className="flex justify-between items-center mt-auto">
                              <div className="flex items-center border">
                                <button
                                  className="px-2 py-1 border-r"
                                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="px-3 py-1">{item.quantity}</span>
                                <button
                                  className="px-2 py-1 border-l"
                                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <span className="font-medium">
                                {formatCurrency(item.product.price * item.quantity, item.product.currency || "USD")}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal, "USD")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Shipping and taxes calculated at checkout</p>
                    <Button asChild className="w-full" onClick={() => setIsCartOpen(false)}>
                      <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white drop-shadow-sm transition-colors duration-300 h-8 w-8"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - keep the rest of the mobile menu code the same */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <span className="font-serif text-lg flex items-center whitespace-nowrap">MODEST THREADS</span>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          <nav className="mt-8 px-4 sm:px-6">
            <ul className="flex flex-col gap-6">
              <li>
                <Link
                  href="/"
                  className={cn(
                    "text-xl font-serif",
                    pathname === "/" ? "text-olive-800 font-medium" : "text-gray-800",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/collection"
                  className={cn(
                    "text-xl font-serif",
                    pathname === "/collection" ? "text-olive-800 font-medium" : "text-gray-800",
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
                    "text-xl font-serif",
                    pathname === "/about" ? "text-olive-800 font-medium" : "text-gray-800",
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
                    "text-xl font-serif",
                    pathname === "/contact" ? "text-olive-800 font-medium" : "text-gray-800",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  )
}
