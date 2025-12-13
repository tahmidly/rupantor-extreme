import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    await requireAdmin()

    const products = await sql("SELECT * FROM products ORDER BY created_at DESC")
    return NextResponse.json(products)
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const data = await request.json()
    const { name, name_bengali, description, description_bengali, price, category, stock, is_active, image_url } = data

    const result = await sql(
      `INSERT INTO products (name, name_bengali, description, description_bengali, price, category, stock, is_active, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [name, name_bengali, description, description_bengali, price, category, stock, is_active, image_url],
    )

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 })
  }
}
