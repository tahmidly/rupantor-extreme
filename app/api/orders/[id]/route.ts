import { NextRequest, NextResponse } from "next/server"
import { getOrderById, deleteOrder } from "@/lib/db"
import { getCurrentUser, requireAdmin } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = await getOrderById(params.id)

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Check permissions - admin or order owner
    try {
      await requireAdmin()
    } catch {
      // Not admin, check if user owns the order
      const user = await getCurrentUser()
      if (!user || order.user_id !== user.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Get order error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require admin authentication (disabled for static auth request)
    // await requireAdmin()
    console.log("Attempting to delete order with ID:", params.id)

    const deletedOrder = await deleteOrder(params.id)
    console.log("Delete result:", deletedOrder ? "Success" : "Failed (null)")

    if (!deletedOrder) {
      return NextResponse.json(
        { error: "Order not found or could not be deleted" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    console.error("Delete order error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
