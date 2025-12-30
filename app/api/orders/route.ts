import { NextRequest, NextResponse } from "next/server"
import { getOrders } from "@/lib/db"
import { requireAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    // await requireAdmin()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || undefined
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const orders = await getOrders({ status, limit, offset })

    return NextResponse.json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error("Get orders error:", error)

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      {
        error: "Failed to fetch orders",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
