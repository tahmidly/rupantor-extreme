import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

export async function getProducts(searchQuery?: string, category?: string) {
  if (searchQuery && category) {
    const search = `%${searchQuery}%`
    return await sql`
      SELECT * FROM products 
      WHERE is_active = true 
      AND (name ILIKE ${search} OR name_bengali ILIKE ${search} OR description ILIKE ${search})
      AND category = ${category}
      ORDER BY created_at DESC
    `
  } else if (searchQuery) {
    const search = `%${searchQuery}%`
    return await sql`
      SELECT * FROM products 
      WHERE is_active = true 
      AND (name ILIKE ${search} OR name_bengali ILIKE ${search} OR description ILIKE ${search})
      ORDER BY created_at DESC
    `
  } else if (category) {
    return await sql`
      SELECT * FROM products 
      WHERE is_active = true 
      AND category = ${category}
      ORDER BY created_at DESC
    `
  } else {
    return await sql`
      SELECT * FROM products 
      WHERE is_active = true 
      ORDER BY created_at DESC
    `
  }
}

export async function getProductById(id: string) {
  const result = await sql`SELECT * FROM products WHERE id = ${id}`
  return result[0] || null
}

export async function getUserByFirebaseUid(firebaseUid: string) {
  const result = await sql`SELECT * FROM users WHERE firebase_uid = ${firebaseUid}`
  return result[0] || null
}

export async function createUser(firebaseUid: string, email: string, name?: string) {
  const result = await sql`
    INSERT INTO users (firebase_uid, email, name) 
    VALUES (${firebaseUid}, ${email}, ${name || email}) 
    RETURNING *
  `
  return result[0]
}

export async function isUserAdmin(firebaseUid: string): Promise<boolean> {
  const user = await getUserByFirebaseUid(firebaseUid)
  return user?.is_admin || false
}
