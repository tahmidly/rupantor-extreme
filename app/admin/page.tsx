import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { Header } from "@/components/header"
import { ProductManagement } from "@/components/admin/product-management"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingBag } from "lucide-react"
import { sql } from "@/lib/db"

export default async function AdminPage() {
  try {
    await requireAdmin()
  } catch {
    redirect("/sign-in")
  }

  // Get stats
  const productCountResult = await sql("SELECT COUNT(*) as count FROM products")
  const activeProductsResult = await sql("SELECT COUNT(*) as count FROM products WHERE is_active = true")

  const productCount = productCountResult[0]?.count || 0
  const activeProducts = activeProductsResult[0]?.count || 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-rose-50/20">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">অ্যাডমিন ড্যাশবোর্ড</h1>
          <p className="text-muted-foreground">পণ্য যোগ করুন এবং পরিচালনা করুন</p>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">মোট পণ্য</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{productCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">সক্রিয় পণ্য</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Product Management */}
        <ProductManagement />
      </main>
    </div>
  )
}
