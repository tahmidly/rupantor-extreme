import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>
}) {
  const params = await searchParams
  const products = await getProducts(params.search, params.category)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-rose-50/20">
      <Header />

      <main className="container py-8">
        {/* Hero Section */}
        <section className="text-center mb-12 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">স্বাগতম হিজাব স্টোরে</h1>
          <p className="text-lg text-muted-foreground mb-6 text-pretty max-w-2xl mx-auto">
            বাংলাদেশের সবচেয়ে বড় এবং বিশ্বস্ত হিজাব কালেকশন। উচ্চ মানের হিজাব, সাশ্রয়ী মূল্যে।
          </p>
        </section>

        {/* Search Results Header */}
        {params.search && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">"{params.search}" এর জন্য অনুসন্ধান ফলাফল</h2>
            <p className="text-muted-foreground">{products.length} টি পণ্য পাওয়া গেছে</p>
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">কোন পণ্য পাওয়া যায়নি</p>
            <Button asChild variant="outline">
              <Link href="/">সব পণ্য দেখুন</Link>
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8 bg-muted/30">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2025 হিজাব স্টোর। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </footer>
    </div>
  )
}
