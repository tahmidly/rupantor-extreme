import { NextRequest, NextResponse } from "next/server"
import { getOrderById, deleteOrder } from "@/lib/db"
import { getCurrentUser, requireAdmin } from "@/lib/auth"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const order = await getOrderById(id)

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
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
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    console.log("Attempting to delete order with ID:", id)

    const deletedOrder = await deleteOrder(id)
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
