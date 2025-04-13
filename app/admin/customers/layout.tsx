import type { ReactNode } from "react"
import AdminSidebar from "@/components/admin/sidebar"

export default function CustomersLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8 pt-16 md:pt-8">{children}</div>
    </div>
  )
}
