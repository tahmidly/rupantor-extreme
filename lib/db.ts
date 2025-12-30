import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export async function getProducts(searchQuery?: string, category?: string) {
  if (searchQuery && category) {
    const search = `%${searchQuery}%`
    return await sql`
      SELECT * FROM products
      WHERE is_active = true
      AND (name ILIKE ${search} OR name_bengali ILIKE ${search} OR description ILIKE ${search})
      AND category = ${category}
      ORDER BY created_at DESC
    `
  } else if (searchQuery) {
    const search = `%${searchQuery}%`
    return await sql`
      SELECT * FROM products
      WHERE is_active = true
      AND (name ILIKE ${search} OR name_bengali ILIKE ${search} OR description ILIKE ${search})
      ORDER BY created_at DESC
    `
  } else if (category) {
    return await sql`
      SELECT * FROM products
      WHERE is_active = true
      AND category = ${category}
      ORDER BY created_at DESC
    `
  } else {
    return await sql`
      SELECT * FROM products
      WHERE is_active = true
      ORDER BY created_at DESC
    `
  }
}

export async function getProductById(id: string) {
  const result = await sql`SELECT * FROM products WHERE id = ${id}`
  return result[0] || null
}

export async function getUserByFirebaseUid(firebaseUid: string) {
  const result = await sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUid}`
  return result[0] || null
}

export async function createUser(firebaseUid: string, email: string, name?: string) {
  const result = await sql`
    INSERT INTO users (firebase_uid, email, name)
    VALUES (${firebaseUid}, ${email}, ${name || email})
    RETURNING *
  `
  return result[0]
}

export async function isUserAdmin(firebaseUid: string): Promise<boolean> {
  const user = await getUserByFirebaseUid(firebaseUid)
  return user?.is_admin || false
}

// Order Management Functions

export async function createOrder(orderData: {
  userId?: string
  customerName: string
  customerPhone: string
  customerEmail?: string
  deliveryAddress: string
  deliveryCity: string
  deliveryArea?: string
  postalCode?: string
  orderNotes?: string
  paymentMethod: string
  subtotal: number
  shippingCost: number
  total: number
  items: Array<{
    productId: string
    productName: string
    productImage: string
    price: number
    quantity: number
  }>
}) {
  // Generate unique order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  // Insert order
  const orderResult = await sql`
    INSERT INTO orders (
      user_id, order_number, customer_name, customer_phone, customer_email,
      delivery_address, delivery_city, delivery_area, postal_code, order_notes,
      payment_method, subtotal, shipping_cost, total
    ) VALUES (
      ${orderData.userId || null}, ${orderNumber}, ${orderData.customerName},
      ${orderData.customerPhone}, ${orderData.customerEmail || null},
      ${orderData.deliveryAddress}, ${orderData.deliveryCity},
      ${orderData.deliveryArea || null}, ${orderData.postalCode || null},
      ${orderData.orderNotes || null}, ${orderData.paymentMethod},
      ${orderData.subtotal}, ${orderData.shippingCost}, ${orderData.total}
    )
    RETURNING *
  `

  const order = orderResult[0]

  // Insert order items
  for (const item of orderData.items) {
    await sql`
      INSERT INTO order_items (
        order_id, product_id, product_name, product_image, price, quantity, subtotal
      ) VALUES (
        ${order.id}, ${item.productId}, ${item.productName},
        ${item.productImage}, ${item.price}, ${item.quantity},
        ${item.price * item.quantity}
      )
    `
  }

  return order
}

export async function getOrders(filters?: {
  status?: string
  limit?: number
  offset?: number
}) {
  const { status, limit = 50, offset = 0 } = filters || {}

  if (status) {
    return await sql`
      SELECT o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'product_name', oi.product_name,
            'product_image', oi.product_image,
            'price', oi.price,
            'quantity', oi.quantity,
            'subtotal', oi.subtotal
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.status = ${status}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
  }

  return await sql`
    SELECT o.*,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'product_name', oi.product_name,
          'product_image', oi.product_image,
          'price', oi.price,
          'quantity', oi.quantity,
          'subtotal', oi.subtotal
        )
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
}

export async function getOrderById(id: string) {
  const result = await sql`
    SELECT o.*,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'product_name', oi.product_name,
          'product_image', oi.product_image,
          'price', oi.price,
          'quantity', oi.quantity,
          'subtotal', oi.subtotal
        )
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.id = ${id}
    GROUP BY o.id
  `
  return result[0] || null
}

export async function getUserOrders(userId: string) {
  return await sql`
    SELECT o.*,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'product_name', oi.product_name,
          'product_image', oi.product_image,
          'price', oi.price,
          'quantity', oi.quantity,
          'subtotal', oi.subtotal
        )
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    WHERE o.user_id = ${userId}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `
}

export async function updateOrderStatus(id: string, status: string) {
  const result = await sql`
    UPDATE orders
    SET status = ${status}
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] || null
}

export async function getOrderStats() {
  const totalOrders = await sql`SELECT COUNT(*) as count FROM orders`
  const pendingOrders = await sql`SELECT COUNT(*) as count FROM orders WHERE status = 'pending'`
  const confirmedOrders = await sql`SELECT COUNT(*) as count FROM orders WHERE status = 'confirmed'`
  const processingOrders = await sql`SELECT COUNT(*) as count FROM orders WHERE status = 'processing'`
  const shippedOrders = await sql`SELECT COUNT(*) as count FROM orders WHERE status = 'shipped'`
  const deliveredOrders = await sql`SELECT COUNT(*) as count FROM orders WHERE status = 'delivered'`

  return {
    total: totalOrders[0]?.count || 0,
    pending: pendingOrders[0]?.count || 0,
    confirmed: confirmedOrders[0]?.count || 0,
    processing: processingOrders[0]?.count || 0,
    shipped: shippedOrders[0]?.count || 0,
    delivered: deliveredOrders[0]?.count || 0,
  }
}

export async function deleteOrder(id: string) {
  // First delete order items (though cascade might handle this, explicit is safer if unknown)
  await sql`DELETE FROM order_items WHERE order_id = ${id}`
  // Then delete the order
  const result = await sql`
    DELETE FROM orders
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] || null
}
