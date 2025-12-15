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
