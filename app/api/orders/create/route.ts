import { NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      deliveryCity,
      deliveryArea,
      postalCode,
      orderNotes,
      paymentMethod,
      shippingCost: requestedShippingCost,
      items,
    } = body

    // Validate required fields
    if (!customerName || !customerPhone || !deliveryAddress || !deliveryCity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    )
    const shippingCost = requestedShippingCost !== undefined ? requestedShippingCost : 0
    const total = subtotal + shippingCost

    // Get current user if logged in
    let userId: string | undefined
    try {
      const user = await getCurrentUser()
      if (user) {
        const { getUserByFirebaseUid } = await import("@/lib/db")
        const dbUser = await getUserByFirebaseUid(user.uid)
        userId = dbUser?.id
      }
    } catch {
      // Guest checkout - no user ID
      userId = undefined
    }

    // Create order
    const order = await createOrder({
      userId,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      deliveryCity,
      deliveryArea,
      postalCode,
      orderNotes,
      paymentMethod: paymentMethod || "cash_on_delivery",
      subtotal,
      shippingCost,
      total,
      items: items.map((item: any) => ({
        productId: item.id,
        productName: item.name,
        productImage: item.image,
        price: item.price,
        quantity: item.quantity,
      })),
    })

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        total: order.total,
      },
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
