import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/types"
import { Eye, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.id}`} className="group block h-full">
            <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-muted">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                    </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-x-0 bottom-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 justify-center">
                    <Button size="sm" className="w-full bg-white text-black hover:bg-white/90 shadow-sm backdrop-blur-sm">
                        Quick View
                    </Button>
                </div>

                {/* Badges */}
                {product.stock <= 0 && (
                    <div className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 uppercase tracking-wider font-medium">
                        Sold Out
                    </div>
                )}
            </div>

            <div className="mt-4 space-y-1">
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">৳{Number(product.price).toFixed(2)}</span>
                    <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                        ৳{Math.round(Number(product.price) * 1.2).toFixed(2)}
                    </span>
                </div>
            </div>
        </Link>
    )
}
