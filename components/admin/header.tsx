"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export default function AdminHeader() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Load collapsed state from localStorage on client side
  useEffect(() => {
    const savedState = localStorage.getItem("adminSidebarCollapsed")
    if (savedState) {
      setIsCollapsed(savedState === "true")
    }

    // Listen for changes to the collapsed state
    const handleStorageChange = () => {
      const currentState = localStorage.getItem("adminSidebarCollapsed")
      setIsCollapsed(currentState === "true")
    }

    window.addEventListener("storage", handleStorageChange)

    // Custom event for direct communication
    const handleCustomEvent = (e: CustomEvent) => {
      setIsCollapsed(e.detail.isCollapsed)
    }

    window.addEventListener("sidebarStateChange" as any, handleCustomEvent)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("sidebarStateChange" as any, handleCustomEvent)
    }
  }, [])

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Admin Panel</h2>

      <div className="flex items-center gap-4">
        <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
          View Store
        </Link>
      </div>
    </header>
  )
}

