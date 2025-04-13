import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

export default function CustomerNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-muted p-4 rounded-full mb-4">
        <Users className="h-12 w-12 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Customer Not Found</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        The customer you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/admin/customers">Back to Customers</Link>
      </Button>
    </div>
  )
}
