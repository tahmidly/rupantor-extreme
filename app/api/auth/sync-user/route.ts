import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByFirebaseUid } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { firebaseUid, email, name } = await request.json()

    if (!firebaseUid || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user exists
    let user = await getUserByFirebaseUid(firebaseUid)

    if (!user) {
      // Create new user
      user = await createUser(firebaseUid, email, name)
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error syncing user:", error)
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 })
  }
}
