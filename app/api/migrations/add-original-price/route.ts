import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2)`
    return NextResponse.json({ success: true, message: "Migration successful: Added original_price column" })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
