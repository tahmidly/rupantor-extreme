import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProductById } from "@/lib/db"
import { ArrowLeft, Package } from "lucide-react"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-rose-50/20">
      <Header />

      <main className="container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            পিছনে ফিরুন
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {product.image_url ? (
              <Image
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
                <Package className="h-32 w-32 text-rose-300" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">
                {product.name_bengali || product.name}
              </h1>
              {product.name_bengali && <p className="text-lg text-muted-foreground">{product.name}</p>}
            </div>

            <div className="flex items-center gap-4">
              <p className="text-4xl font-bold text-rose-500">৳{product.price.toFixed(2)}</p>
              {product.stock > 0 ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  স্টকে আছে ({product.stock} টি)
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  স্টক শেষ
                </Badge>
              )}
            </div>

            {product.category && (
              <div>
                <span className="text-sm text-muted-foreground">ক্যাটাগরি: </span>
                <Badge variant="outline">{product.category}</Badge>
              </div>
            )}

            {(product.description_bengali || product.description) && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-3">বিবরণ</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description_bengali || product.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button size="lg" className="flex-1" disabled={product.stock === 0}>
                {product.stock > 0 ? "অর্ডার করুন" : "স্টক শেষ"}
              </Button>
            </div>

            {/* Product Info */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">পণ্যের তথ্য</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">পণ্য আইডি:</dt>
                    <dd className="font-mono text-xs">{product.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">যোগ করা হয়েছে:</dt>
                    <dd>{new Date(product.created_at).toLocaleDateString("bn-BD")}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
