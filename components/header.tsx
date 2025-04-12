"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, User, ShoppingBag, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-context"
import { supabase } from "@/lib/supabase"
import { isAdmin } from "@/lib/admin"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [isAdminUser, setIsAdminUser] = useState(false)
  const pathname = usePathname()
  const { items, removeFromCart, totalItems, subtotal, updateQuantity } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
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

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  return (
    <>
      {/* Main Header */}
      <header
  className={cn(
    "fixed top-0 left-0 w-full z-50 transition-all duration-300",
    scrolled ? "bg-white text-olive-900 shadow-md py-4" : "bg-transparent text-white py-6"
  )}
>

        <div className="container flex items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center z-10">
            <div className="relative h-12 w-36">
              <span className="font-serif text-xl text-white drop-shadow-md">MODEST ELEGANCE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-8">
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
                  className="text-white drop-shadow-sm transition-colors duration-300"
                >
                  <User className="h-5 w-5" />
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
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white drop-shadow-sm transition-colors duration-300 relative"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-olive-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                  <span className="sr-only">Cart</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  {items.length > 0 ? (
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex items-center gap-4 py-4 border-b">
                          <div className="relative w-20 h-20 bg-muted">
                            {item.product.image && (
                              <img
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.product.name}</h4>
                            <div className="flex items-center mt-1">
                              <button
                                className="w-6 h-6 flex items-center justify-center border border-gray-300"
                                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <button
                                className="w-6 h-6 flex items-center justify-center border border-gray-300"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(item.product.price * item.quantity)}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-muted-foreground mt-1"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between py-2">
                          <span>Subtotal</span>
                          <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span>Shipping</span>
                          <span>Calculated at checkout</span>
                        </div>
                        <div className="flex justify-between py-2 font-medium">
                          <span>Total</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <Button className="w-full mt-6 rounded-none bg-olive-900 hover:bg-olive-800">Checkout</Button>
                        <Button variant="outline" className="w-full mt-2 rounded-none">
                          View Cart
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">Your cart is empty</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Looks like you haven't added anything to your cart yet.
                      </p>
                      <Button asChild className="mt-8 rounded-none bg-olive-900 hover:bg-olive-800">
                        <Link href="/collection">Continue Shopping</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white drop-shadow-sm transition-colors duration-300"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <span className="font-serif text-lg">MODEST ELEGANCE</span>
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
                  href="/abayas"
                  className={cn(
                    "text-xl font-serif",
                    pathname === "/abayas" ? "text-olive-800 font-medium" : "text-gray-800",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Abayas
                </Link>
              </li>
              <li>
                <Link
                  href="/hijabs"
                  className={cn(
                    "text-xl font-serif",
                    pathname === "/hijabs" ? "text-olive-800 font-medium" : "text-gray-800",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hijabs
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
            <div className="mt-12 space-y-4">
              <Button asChild className="w-full">
                <Link href="/collection" onClick={() => setMobileMenuOpen(false)}>
                  Shop Now
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                  My Account
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

