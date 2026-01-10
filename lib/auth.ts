import { cookies } from "next/headers"
import { adminAuth } from "./firebase-admin"

export async function getCurrentUser() {
  // Bypass Firebase for now
  return null

  /*
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  console.log("Checking auth token:", token ? "Token present" : "No token")

  if (!token) {
    return null
  }

  try {
    // Verify the session cookie
    const decodedToken = await adminAuth.verifySessionCookie(token, true)
    console.log("Token verified successfully, UID:", decodedToken.uid)
    return decodedToken
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
  */
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized")
  }
  return user
}

export async function requireAdmin() {
  throw new Error("Forbidden: Admin access disabled (Firebase removed)")

  /*
  const user = await requireAuth()
  const { isUserAdmin } = await import("./db")
  const isAdmin = await isUserAdmin(user.uid)

  if (!isAdmin) {
    throw new Error("Forbidden: Admin access required")
  }

  return user
  */
}
