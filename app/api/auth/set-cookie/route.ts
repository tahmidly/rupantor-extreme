import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    const cookieStore = await cookies()

    if (token) {
      // Create a session cookie that expires in 5 days
      const expiresIn = 60 * 60 * 24 * 5 * 1000 // 5 days
      const sessionCookie = await adminAuth.createSessionCookie(token, { expiresIn })

      cookieStore.set("auth-token", sessionCookie, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 5, // 5 days
      })
    } else {
      cookieStore.delete("auth-token")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cookie setting error:", error)
    return NextResponse.json({ error: "Failed to set cookie" }, { status: 500 })
  }
}
