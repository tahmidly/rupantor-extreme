"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/types"
import { Loader2 } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

const CATEGORIES = [
    { id: "borkha", label: "বোরখা" },
    { id: "semi-long-khimar", label: "সেমি লং খিমার" },
    { id: "long-khimar", label: "লং খিমার" },
    { id: "short-hijab", label: "শর্ট হিজাব" },
    { id: "bra", label: "ব্রা" },
    { id: "panty", label: "পেন্টি" },
    { id: "kids", label: "শিশুদের পণ্য" },
]

interface ProductFormProps {
    product?: Product | null
    onSuccess: () => void
    onCancel: () => void
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: product?.name || "",
        name_bengali: product?.name_bengali || "",
        description: product?.description || "",
        description_bengali: product?.description_bengali || "",
        price: product?.price || "",
        category: product?.category || "",
        stock: product?.stock || "",
        is_active: product?.is_active ?? true,
        image_url: product?.image_url || "",
    })
    const [uploading, setUploading] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "hijab-store"

        console.log("Debugging Cloudinary Upload:")
        console.log("Cloud Name:", cloudName)
        console.log("Upload Preset:", uploadPreset)

        if (!cloudName) {
            alert("Cloudinary Cloud Name is missing in .env")
            setUploading(false)
            return
        }

        try {
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                },
            )
            const data = await res.json()
            setFormData((prev) => ({ ...prev, image_url: data.secure_url }))
        } catch (error) {
            console.error("Image upload failed:", error)
            alert("ছবি আপলোড ব্যর্থ হয়েছে")
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products"
            const method = product ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                onSuccess()
            } else {
                alert("পণ্য সংরক্ষণ ব্যর্থ হয়েছে")
            }
        } catch (error) {
            console.error("Failed to save product:", error)
            alert("পণ্য সংরক্ষণ ব্যর্থ হয়েছে")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">পণ্যের নাম (English) *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name_bengali">পণ্যের নাম (বাংলা)</Label>
                    <Input
                        id="name_bengali"
                        value={formData.name_bengali}
                        onChange={(e) => setFormData({ ...formData, name_bengali: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">বিবরণ (English)</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description_bengali">বিবরণ (বাংলা)</Label>
                <Textarea
                    id="description_bengali"
                    value={formData.description_bengali}
                    onChange={(e) => setFormData({ ...formData, description_bengali: e.target.value })}
                    rows={3}
                />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">মূল্য (৳) *</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="stock">স্টক *</Label>
                    <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="category">ক্যাটাগরি</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                        </SelectTrigger>
                        <SelectContent>
                            {CATEGORIES.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">পণ্যের ছবি</Label>
                <div className="flex gap-2">
                    <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                    {uploading && <Loader2 className="h-5 w-5 animate-spin" />}
                </div>
                {formData.image_url && (
                    <img
                        src={formData.image_url || "/placeholder.svg"}
                        alt="Preview"
                        className="mt-2 h-32 w-32 object-cover rounded"
                    />
                )}
            </div>

            <div className="flex items-center gap-2">
                <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">সক্রিয়</Label>
            </div>

            <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={loading || uploading} className="flex-1">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : product ? "আপডেট করুন" : "যোগ করুন"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    বাতিল করুন
                </Button>
            </div>
        </form>
    )
}
