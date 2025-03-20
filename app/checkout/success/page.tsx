import { Suspense } from "react"
import { getCheckoutSession } from "@/app/actions/stripe-actions"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ClearCartOnSuccess } from "./clear-cart"

// Define the props type for the component
type SuccessContentProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

async function SuccessContent({ searchParams }: SuccessContentProps) {
  // Get the session ID as string
  const sessionId = typeof searchParams.session_id === "string" ? searchParams.session_id : undefined

  if (!sessionId) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-2">Invalid session</h2>
        <p className="text-muted-foreground mb-6">No session information found.</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    )
  }

  const { session, orderDetails, error } = await getCheckoutSession(sessionId)

  if (error || !session) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-serif mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">We couldn't retrieve your order information.</p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    )
  }

  // Extract order information for display
  const { order, customer } = orderDetails || {}
  const orderNumber = order?.id ? order.id.slice(-8).toUpperCase() : session.payment_intent?.id?.slice(-8).toUpperCase()
  const orderDate = order?.created_at
    ? new Date(order.created_at).toLocaleDateString()
    : new Date(session.created * 1000).toLocaleDateString()
  const customerEmail = customer?.email || session.customer_details?.email
  const totalAmount = order?.total || session.amount_total / 100

  return (
    <div className="text-center">
      {/* Client component to clear the cart */}
      <ClearCartOnSuccess sessionId={sessionId} />

      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-3xl font-serif mb-2">Thank you for your order!</h2>
      <p className="text-muted-foreground mb-2">Your order has been confirmed.</p>
      <p className="text-muted-foreground mb-6">We've sent a confirmation email to {customerEmail}.</p>

      <div className="max-w-md mx-auto bg-gray-50 p-6 mb-8 text-left">
        <h3 className="font-medium mb-4">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Order number:</span>
            <span className="font-medium">{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{orderDate}</span>
          </div>
          <div className="flex justify-between">
            <span>Total:</span>
            <span className="font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: session.currency,
              }).format(totalAmount)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/collection">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}

export default function SuccessPage({ searchParams }: SuccessContentProps) {
  return (
    <div className="flex flex-col min-h-screen pt-20">
      <div className="container px-4 py-16 md:px-6 flex flex-col items-center justify-center">
        <Suspense fallback={<div>Loading order information...</div>}>
          <SuccessContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

