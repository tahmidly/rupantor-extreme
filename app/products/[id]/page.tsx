import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getProductById } from "@/lib/db"
import { ArrowLeft, Package, Truck, ShieldCheck, Heart, Share2 } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { QuickOrderButton } from "@/components/quick-order-button"
import { ProductGallery } from "@/components/product-gallery"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = await getProductById(id)

    if (!product) {
        notFound()
    }

    const allImages = [
        product.image_url,
        ...(product.additional_images || [])
    ].filter(Boolean) as string[]

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb / Back Navigation */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors group">
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Shop
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Product Image Gallery (Left) */}
                    <div className="lg:col-span-7">
                        <ProductGallery images={allImages} productName={product.name} />
                    </div>

                    {/* Product Details (Right) */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 h-fit space-y-8">
                        {/* Header Info */}
                        <div className="space-y-4">
                            {product.category && (
                                <p className="text-sm font-medium tracking-widest uppercase text-muted-foreground">
                                    {product.category}
                                </p>
                            )}
                            <h1 className="text-4xl font-serif font-medium leading-tight">
                                {product.name}
                            </h1>
                            {product.name_bengali && (
                                <p className="text-xl text-muted-foreground font-light">{product.name_bengali}</p>
                            )}

                            <div className="flex items-baseline gap-4 pt-2">
                                <span className="text-3xl font-bold">৳{Number(product.price).toFixed(2)}</span>
                                {product.original_price && Number(product.original_price) > Number(product.price) && (
                                    <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/50">
                                        ৳{Number(product.original_price).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Stock Status */}
                        <div>
                            {product.stock > 0 ? (
                                <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                                    <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                                    In Stock ({product.stock} available)
                                </div>
                            ) : (
                                <div className="inline-flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
                                    <div className="h-2 w-2 rounded-full bg-red-600" />
                                    Out of Stock
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="prose prose-stone text-muted-foreground">
                            <p className="leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                            {product.description_bengali && (
                                <p className="leading-relaxed whitespace-pre-line mt-4 pt-4 border-t border-dashed">
                                    {product.description_bengali}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-4 pt-4">
                            <QuickOrderButton
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    image_url: product.image_url || "",
                                }}
                                size="lg"
                                className="w-full h-14 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                                disabled={product.stock === 0}
                                text={product.stock > 0 ? "অর্ডার করুন" : "স্টক আউট"}
                                showIcon={true}
                            />

                            <AddToCartButton
                                product={{
                                    id: product.id,
                                    name: product.name,
                                    price: Number(product.price),
                                    image_url: product.image_url || "",
                                }}
                                size="lg"
                                className="w-full h-14 text-lg rounded-full border-2 border-primary text-primary bg-transparent hover:bg-primary/5 shadow-none"
                                disabled={product.stock === 0}
                                text={product.stock > 0 ? "কার্টে যোগ করুন" : "স্টক শেষ"} // "Add to Cart" : "Out of Stock"
                                showIcon={true}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" size="lg" className="w-full rounded-full">
                                    <Heart className="h-4 w-4 mr-2" /> Wishlist
                                </Button>
                                <Button variant="outline" size="lg" className="w-full rounded-full">
                                    <Share2 className="h-4 w-4 mr-2" /> Share
                                </Button>
                            </div>
                        </div>


                    </div>
                </div>
            </main>
        </div>
    )
}
