import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { ProductFilter } from "@/components/product-filter"
import { getProducts } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string }>
}) {
    const params = await searchParams
    // Fetch all products (or filtered by server if supported, for now fetching all to filter on client/server mix)
    // Actually getProducts supports basic filtering, let's use what we have.
    const products = await getProducts(params.search, params.category) as unknown as import("@/types").Product[]

    // We might want to fetch *all* products to generate the distinct category list for the filter
    // ideally getProducts should return aggregation data, but for now let's just fetch all for the filter list if needed
    // or just pass the current products list to the filter to show available categories in current view.
    // Better yet: Pass all products to filter to show full range of options?
    // Let's pass the retrieved products for now.

    // For a robust filter we typically need a separate query for metadata,
    // but let's stick to the current simpler architecture.
    const allProductsForFilter = await getProducts() as unknown as import("@/types").Product[]

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8 border-b pb-4">
                    <div>
                        <h1 className="text-3xl font-serif font-medium">সকল পণ্য</h1>
                        <p className="text-muted-foreground mt-1">
                            {products.length} টি পণ্য পাওয়া গেছে
                        </p>
                    </div>

                    {/* Mobile Filter Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="lg:hidden">
                                <Filter className="h-4 w-4 mr-2" /> ফিল্টার
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left">
                            <div className="mt-8">
                                <ProductFilter products={allProductsForFilter} />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters (Desktop) */}
                    <aside className="hidden lg:block space-y-8 sticky top-24 h-fit">
                        <ProductFilter products={allProductsForFilter} />
                    </aside>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                                {products.map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                                <p className="text-lg text-muted-foreground">আপনার অনুসন্ধান অনুযায়ী কোনো পণ্য পাওয়া যায়নি।</p>
                                <Button asChild variant="link" className="mt-2">
                                    <Link href="/shop">সব ফিল্টার মুছুন</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
