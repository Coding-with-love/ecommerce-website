import type { Metadata } from "next"
import { CustomerForm } from "@/components/admin/customer-form"

export const metadata: Metadata = {
  title: "Add Customer | Admin Dashboard",
  description: "Add a new customer to your store",
}

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Add New Customer</h1>
      </div>
      <CustomerForm />
    </div>
  )
}
