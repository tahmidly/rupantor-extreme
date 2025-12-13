import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square relative bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
              <span className="text-4xl">🧕</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-rose-500 transition-colors line-clamp-1">
            {product.name_bengali || product.name}
          </h3>
          {product.name_bengali && <p className="text-sm text-muted-foreground line-clamp-1">{product.name}</p>}
          <p className="text-xl font-bold text-rose-500 mt-2">৳{product.price.toFixed(2)}</p>
        </Link>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full" variant={product.stock > 0 ? "default" : "secondary"}>
          <Link href={`/products/${product.id}`}>{product.stock > 0 ? "বিস্তারিত দেখুন" : "স্টক শেষ"}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
