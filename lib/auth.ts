import { cookies } from "next/headers"
import { adminAuth } from "./firebase-admin"

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    return decodedToken
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  const { isUserAdmin } = await import("./db")
  const isAdmin = await isUserAdmin(user.uid)

  if (!isAdmin) {
    throw new Error("Forbidden: Admin access required")
  }

  return user
}
