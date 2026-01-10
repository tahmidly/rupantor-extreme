"use client"

import type React from "react"
import imageCompression from "browser-image-compression"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Product } from "@/types"
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import Swal from "sweetalert2"

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
        description: product?.description || "",
        price: product?.price || "",
        original_price: product?.original_price || "",
        category: product?.category || "",
        stock: product?.stock || "",
        is_active: product?.is_active ?? true,
        image_url: product?.image_url || "",
        additional_images: product?.additional_images || [],
    })
    const [uploadingIndex, setUploadingIndex] = useState<number | "main" | null>(null)
    const [loading, setLoading] = useState(false)


    const handleImageUpload = async (file: File, type: "main" | number) => {
        setUploadingIndex(type)
        try {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
            }
            const compressedFile = await imageCompression(file, options)

            const formData = new FormData()
            formData.append("file", compressedFile)

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!res.ok) throw new Error(`Upload failed: ${res.status}`)

            const data = await res.json()

            if (type === "main") {
                setFormData((prev) => ({ ...prev, image_url: data.url }))
            } else if (type === prevAdditionalCount) {
                // Uploading to the "new" slot
                setFormData((prev) => ({
                    ...prev,
                    additional_images: [...prev.additional_images, data.url]
                }))
            } else {
                setFormData((prev) => {
                    const newImages = [...prev.additional_images]
                    newImages[type] = data.url
                    return { ...prev, additional_images: newImages }
                })
            }
        } catch (error) {
            console.error(error)
            Swal.fire({
                title: "ব্যর্থ",
                text: "ছবি আপলোড ব্যর্থ হয়েছে",
                icon: "error",
                confirmButtonColor: "#e11d48",
            })
        } finally {
            setUploadingIndex(null)
        }
    }

    const prevAdditionalCount = formData.additional_images.length;

    const removeImage = (type: "main" | number) => {
        if (type === "main") {
            setFormData((prev) => ({ ...prev, image_url: "" }))
        } else {
            setFormData((prev) => ({
                ...prev,
                additional_images: prev.additional_images.filter((_, i) => i !== type),
            }))
        }
    }

    const triggerFileInput = (id: string) => {
        document.getElementById(id)?.click()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.category) {
            Swal.fire({
                title: "তথ্য অসম্পূর্ণ",
                text: "অনুগ্রহ করে একটি ক্যাটাগরি নির্বাচন করুন",
                icon: "warning",
                confirmButtonColor: "#e11d48",
            })
            return
        }

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
                Swal.fire({
                    title: "সফল!",
                    text: product ? "পণ্যটি আপডেট করা হয়েছে" : "নতুন পণ্যটি যোগ করা হয়েছে",
                    icon: "success",
                    confirmButtonColor: "#e11d48",
                    timer: 3000,
                    timerProgressBar: true,
                })
                onSuccess()
            } else {
                Swal.fire({
                    title: "ব্যর্থ",
                    text: "পণ্য সংরক্ষণ ব্যর্থ হয়েছে",
                    icon: "error",
                    confirmButtonColor: "#e11d48",
                })
            }
        } catch (error) {
            console.error("Failed to save product:", error)
            Swal.fire({
                title: "ব্যর্থ",
                text: "পণ্য সংরক্ষণ ব্যর্থ হয়েছে",
                icon: "error",
                confirmButtonColor: "#e11d48",
            })
        } finally {
            setLoading(false)
        }
    }

    const isUploading = uploadingIndex !== null

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">পণ্যের নাম *</Label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">বিবরণ (ঐচ্ছিক)</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">বিক্রয় মূল্য (৳) *</Label>
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
                    <Label htmlFor="original_price">মূল মূল্য (৳) (ঐচ্ছিক)</Label>
                    <Input
                        id="original_price"
                        type="number"
                        step="0.01"
                        value={formData.original_price}
                        onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                        placeholder="ছাড়ের আগের দাম"
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
                    <Label htmlFor="category">ক্যাটাগরি *</Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                        <SelectTrigger className={!formData.category ? "border-red-500" : ""}>
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

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-sm font-semibold">পণ্যের ছবিসমূহ</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {/* Main Image Slot */}
                        <div className="relative aspect-square group">
                            <input
                                type="file"
                                id="main-image-input"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleImageUpload(file, "main")
                                }}
                            />
                            {formData.image_url ? (
                                <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-all">
                                    <img
                                        src={formData.image_url}
                                        alt="Main"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                            onClick={() => triggerFileInput("main-image-input")}
                                        >
                                            <ImagePlus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                            onClick={() => removeImage("main")}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Mobile Actions */}
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1.5 flex md:hidden items-center justify-center gap-6">
                                        <button
                                            type="button"
                                            onClick={() => triggerFileInput("main-image-input")}
                                            className="text-white active:scale-95 transition-transform"
                                        >
                                            <ImagePlus className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeImage("main")}
                                            className="text-white active:scale-95 transition-transform"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="absolute top-2 left-2 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                                        Main
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => triggerFileInput("main-image-input")}
                                    className="w-full h-full border-2 border-dashed border-muted-foreground/20 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-muted/50 hover:border-primary/50 transition-all text-muted-foreground"
                                >
                                    {uploadingIndex === "main" ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    ) : (
                                        <>
                                            <Plus className="h-6 w-6" />
                                            <span className="text-[10px] font-medium">প্রধান ছবি</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Additional Images */}
                        {formData.additional_images.map((url, index) => (
                            <div key={index} className="relative aspect-square group">
                                <input
                                    type="file"
                                    id={`extra-image-${index}`}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) handleImageUpload(file, index)
                                    }}
                                />
                                <div className="relative w-full h-full rounded-lg overflow-hidden border-2 border-muted group-hover:border-primary/50 transition-all">
                                    <img
                                        src={url}
                                        alt={`Extra ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                            onClick={() => triggerFileInput(`extra-image-${index}`)}
                                        >
                                            <ImagePlus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="h-8 w-8 rounded-full"
                                            onClick={() => removeImage(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Mobile Actions */}
                                    <div className="absolute bottom-0 inset-x-0 bg-black/60 py-1.5 flex md:hidden items-center justify-center gap-6">
                                        <button
                                            type="button"
                                            onClick={() => triggerFileInput(`extra-image-${index}`)}
                                            className="text-white active:scale-95 transition-transform"
                                        >
                                            <ImagePlus className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="text-white active:scale-95 transition-transform"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {uploadingIndex === index && (
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Plus Box (Add New Image) */}
                        <div className="relative aspect-square">
                            <input
                                type="file"
                                id="new-image-input"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleImageUpload(file, formData.additional_images.length)
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => triggerFileInput("new-image-input")}
                                disabled={isUploading}
                                className="w-full h-full bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 transition-all group"
                            >
                                {uploadingIndex === formData.additional_images.length ? (
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                ) : (
                                    <>
                                        <Plus className="h-8 w-8 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                        <span className="text-[10px] text-gray-500 font-medium">অতিরিক্ত ছবি</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
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
                <Button type="submit" disabled={loading || isUploading} className="flex-1">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : product ? "আপডেট করুন" : "যোগ করুন"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    বাতিল করুন
                </Button>
            </div>
        </form>
    )
}
