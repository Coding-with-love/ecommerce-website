export type Product = {
  id: string
  name: string
  description: string
  image: string
  category: string
  price: number
  currency: string
}

export type CartItem = {
  product: Product
  quantity: number
}

export type AdminStats = {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  paidOrders: number
  fulfilledOrders: number
  cancelledOrders: number
}

