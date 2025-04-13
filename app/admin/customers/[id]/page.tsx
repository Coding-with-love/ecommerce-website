import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CustomerForm } from "@/components/admin/customer-form"
import { getCustomerById } from "@/app/actions/admin-actions"
import { EnvironmentError } from "@/components/admin/environment-error"

export const metadata: Metadata = {
  title: "Edit Customer | Admin Dashboard",
  description: "Edit customer information",
}

export default async function EditCustomerPage({ params }: { params: { id: string } }) {
  // Check if environment variables are set
  const hasEnvVars = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!hasEnvVars) {
    return <EnvironmentError />
  }

  // Get customer data
  const response = await getCustomerById(params.id)

  if (!response.success || !response.data) {
    notFound()
  }

  const customer = response.data

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Customer</h1>
      </div>
      <CustomerForm initialData={customer} isEditing />
    </div>
  )
}
