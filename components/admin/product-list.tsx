"use client"

import type { Product } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Loader2 } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProductListProps {
  products: Product[]
  onEdit: (product: Product) => void
  onUpdate: () => void
  loading: boolean
}

export function ProductList({ products, onEdit, onUpdate, loading }: ProductListProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে এই পণ্যটি মুছে ফেলতে চান?")) return

    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        onUpdate()
      } else {
        alert("পণ্য মুছে ফেলা ব্যর্থ হয়েছে")
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      alert("পণ্য মুছে ফেলা ব্যর্থ হয়েছে")
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">কোন পণ্য পাওয়া যায়নি</CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="relative h-24 w-24 rounded overflow-hidden bg-muted flex-shrink-0">
                {product.image_url ? (
                  <Image
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100">
                    <span className="text-2xl">🧕</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{product.name_bengali || product.name}</h3>
                    {product.name_bengali && <p className="text-sm text-muted-foreground truncate">{product.name}</p>}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleting === product.id}
                    >
                      {deleting === product.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="font-bold text-rose-500">৳{product.price.toFixed(2)}</span>
                  <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>স্টক: {product.stock}</Badge>
                  {product.category && <Badge variant="outline">{product.category}</Badge>}
                  {!product.is_active && (
                    <Badge variant="destructive" className="bg-gray-500">
                      নিষ্ক্রিয়
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
