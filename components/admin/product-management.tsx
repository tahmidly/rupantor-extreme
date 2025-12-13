"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProductForm } from "./product-form"
import { ProductList } from "./product-list"
import type { Product } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function ProductManagement() {
    const [products, setProducts] = useState<Product[]>([])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProducts = async () => {
        try {
            const res = await fetch("/api/admin/products")

            if (!res.ok) {
                // Silently fail or log, but don't crash. ProductList will check array.
                console.warn("API fetch status:", res.status)
            }

            const data = await res.json()
            // Handle if data is wrapped in an object or if it's the array itself
            const productList = Array.isArray(data) ? data : (data.products || [])
            setProducts(productList)
        } catch (error) {
            console.error("Failed to fetch products:", error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
        setEditingProduct(null)
    }

    const handleSuccess = () => {
        fetchProducts()
        handleCloseForm()
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">পণ্য পরিচালনা</h2>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    নতুন পণ্য যোগ করুন
                </Button>
            </div>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "পণ্য সম্পাদনা করুন" : "নতুন পণ্য যোগ করুন"}</DialogTitle>
                        <DialogDescription>
                            পণ্যের তথ্য লিখুন এবং সংরক্ষণ করুন।
                        </DialogDescription>
                    </DialogHeader>
                    <ProductForm product={editingProduct} onSuccess={handleSuccess} onCancel={handleCloseForm} />
                </DialogContent>
            </Dialog>

            <ProductList products={products} onEdit={handleEdit} onUpdate={fetchProducts} loading={loading} />
        </div>
    )
}
