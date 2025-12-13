import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    const data = await request.json()
    const { name, name_bengali, description, description_bengali, price, category, stock, is_active, image_url } = data

    const result = await sql(
      `UPDATE products 
       SET name = $1, name_bengali = $2, description = $3, description_bengali = $4, 
           price = $5, category = $6, stock = $7, is_active = $8, image_url = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`,
      [name, name_bengali, description, description_bengali, price, category, stock, is_active, image_url, id],
    )

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin()
    const { id } = await params

    await sql("DELETE FROM products WHERE id = $1", [id])
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 })
  }
}
