import { Metadata } from "next"
import { CustomersList } from "@/components/admin/customers-list"

export const metadata: Metadata = {
  title: "Customers | Admin Dashboard",
  description: "Manage your store customers",
}

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customers</h1>
      </div>
      <CustomersList />
    </div>
  )
}
