export type Product = {
  id: string
  name: string
  description: string
  image?: string
  images?: string[]
  category: string
  price: number
  currency: string
  featured?: boolean
  in_stock?: boolean
  stock_status?: "in_stock" | "low_stock" | "out_of_stock"
  created_at?: string
  updated_at?: string
  sku?: string
  material?: string
  care?: string
  details?: string
  attributes?: {
    sizes?: string[]
    colors?: Array<{
      name: string
      value: string
    }>
  }
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

