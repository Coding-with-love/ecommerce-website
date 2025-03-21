"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  Users,
  Settings,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export default function AdminSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()

  // Check if the current path is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Load collapsed state from localStorage on client side
  useEffect(() => {
    const savedState = localStorage.getItem("adminSidebarCollapsed")
    if (savedState) {
      setIsCollapsed(savedState === "true")
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("adminSidebarCollapsed", String(newState))

    // Dispatch custom event for other components to react
    window.dispatchEvent(
      new CustomEvent("sidebarStateChange", {
        detail: { isCollapsed: newState },
      }),
    )
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-white border-r border-gray-200 h-screen",
          "fixed md:sticky top-0 left-0 z-40 transition-all duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className={cn("p-6 border-b flex items-center justify-between", isCollapsed && "p-4")}>
          {!isCollapsed && <h1 className="text-xl font-bold">Admin</h1>}
          <Button variant="ghost" size="icon" onClick={toggleCollapsed} className="hidden md:flex ml-auto">
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            <li>
              <Link
                href="/admin"
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100",
                  isActive("/admin") &&
                    !isActive("/admin/orders") &&
                    !isActive("/admin/customers") &&
                    !isActive("/admin/products") &&
                    !isActive("/admin/settings") &&
                    "bg-gray-100 font-medium",
                  isCollapsed && "justify-center px-2",
                )}
                onClick={closeMobileMenu}
              >
                <LayoutDashboard size={18} />
                {!isCollapsed && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100",
                  isActive("/admin/orders") && "bg-gray-100 font-medium",
                  isCollapsed && "justify-center px-2",
                )}
                onClick={closeMobileMenu}
              >
                <Package size={18} />
                {!isCollapsed && <span>Orders</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100",
                  isActive("/admin/products") && "bg-gray-100 font-medium",
                  isCollapsed && "justify-center px-2",
                )}
                onClick={closeMobileMenu}
              >
                <ShoppingBag size={18} />
                {!isCollapsed && <span>Products</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/customers"
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100",
                  isActive("/admin/customers") && "bg-gray-100 font-medium",
                  isCollapsed && "justify-center px-2",
                )}
                onClick={closeMobileMenu}
              >
                <Users size={18} />
                {!isCollapsed && <span>Customers</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100",
                  isActive("/admin/settings") && "bg-gray-100 font-medium",
                  isCollapsed && "justify-center px-2",
                )}
                onClick={closeMobileMenu}
              >
                <Settings size={18} />
                {!isCollapsed && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>

        <div className={cn("p-4 border-t", isCollapsed && "flex justify-center")}>
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-4 py-2 w-full rounded-md hover:bg-gray-100",
              isCollapsed && "justify-center px-2",
            )}
          >
            <Home size={18} />
            {!isCollapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </div>

      {/* Collapse toggle button for mobile (shown when sidebar is open) */}
      {isMobileMenuOpen && (
        <Button variant="outline" size="sm" onClick={toggleCollapsed} className="fixed bottom-4 left-4 z-50 md:hidden">
          {isCollapsed ? "Expand" : "Collapse"}
        </Button>
      )}
    </>
  )
}

