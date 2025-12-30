export interface Product {
  id: string
  name: string
  name_bengali?: string
  description?: string
  description_bengali?: string
  price: number
  original_price?: number
  image_url?: string
  category?: string
  stock: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface User {
  id: string
  firebase_uid: string
  email: string
  name?: string
  is_admin: boolean
  created_at: Date
  updated_at: Date
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  user_id?: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  delivery_address: string
  delivery_city: string
  delivery_area?: string
  postal_code?: string
  order_notes?: string
  payment_method: string
  status: OrderStatus
  subtotal: number
  shipping_cost: number
  total: number
  created_at: Date
  updated_at: Date
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  product_image: string
  price: number
  quantity: number
  subtotal: number
  created_at: Date
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
}
