import type React from "react"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 md:block hidden">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar */}
      <div className="md:hidden">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

