"use server"

import { stripe } from "@/lib/stripe"
import {
  findOrCreateCustomer,
  createOrder,
  addOrderItems,
  updateOrderAfterPayment,
  getOrderBySessionId,
} from "@/lib/database"

type CheckoutItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

type CustomerInfo = {
  name: string
  email: string
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

// Default placeholder image that's guaranteed to work with Stripe
const DEFAULT_IMAGE = "https://placehold.co/400x600/png"

export async function createCheckoutSession({
  items,
  customerInfo,
}: {
  items: CheckoutItem[]
  customerInfo: CustomerInfo
}) {
  if (!items.length) {
    return { error: "No items in cart" }
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    // Step 1: Save customer information to Supabase
    const customer = await findOrCreateCustomer({
      name: customerInfo.name,
      email: customerInfo.email,
      address: customerInfo.address,
      city: customerInfo.city,
      state: customerInfo.state,
      postalCode: customerInfo.postalCode,
      country: customerInfo.country,
    })

    if (!customer) {
      throw new Error("Failed to create or find customer")
    }

    // Step 2: Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"], // Add countries you ship to
      },
      line_items: items.map((item) => {
        // Always use the default image that works with Stripe
        const imageUrl = DEFAULT_IMAGE

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              // Only include images if we have a valid URL
              ...(imageUrl ? { images: [imageUrl] } : {}),
            },
            unit_amount: Math.round(item.price * 100), // Stripe expects amount in cents
          },
          quantity: item.quantity,
        }
      }),
      mode: "payment",
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout`,
      metadata: {
        customerId: customer.id,
      },
      customer_email: customer.email, // Pre-fill customer email
    })

    // Step 3: Create initial order in our database
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await createOrder({
      customerId: customer.id,
      stripeSessionId: session.id,
      total: subtotal,
      currency: "usd",
      status: "pending",
    })

    if (order) {
      // Step 4: Add order items to the order
      await addOrderItems({
        orderId: order.id,
        items: items.map((item) => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      })
    }

    return { url: session.url }
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return { error: "Failed to create checkout session" }
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    // Get the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent", "customer"],
    })

    // Get our order information from the database
    const { order, items, customer } = await getOrderBySessionId(sessionId)

    // If the order exists but hasn't been updated with payment info yet, update it
    if (order && order.status === "pending" && session.payment_status === "paid") {
      await updateOrderAfterPayment({
        stripeSessionId: sessionId,
        paymentIntentId: session.payment_intent?.id,
        shippingAddress: session.shipping_details,
        billingAddress: session.customer_details,
        status: "paid",
      })
    }

    return {
      session,
      orderDetails: {
        order,
        items,
        customer,
      },
    }
  } catch (error) {
    console.error("Error retrieving checkout session:", error)
    return { error: "Failed to retrieve checkout session" }
  }
}

