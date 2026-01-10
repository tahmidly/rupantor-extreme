"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, ShoppingBag } from "lucide-react"
import Swal from "sweetalert2"

interface QuickOrderButtonProps {
    product: {
        id: string
        name: string
        price: number
        image_url: string
    }
    className?: string
    size?: "default" | "sm" | "lg" | "icon"
    showIcon?: boolean
    text?: string
    disabled?: boolean
}

export function QuickOrderButton({
    product,
    className,
    size = "default",
    showIcon = false,
    text = "অর্ডার করুন",
    disabled = false,
}: QuickOrderButtonProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        shippingCost: 70, // Default: Inside Dhaka
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/orders/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    deliveryAddress: formData.address,
                    deliveryCity: formData.shippingCost === 70 ? "Dhaka" : "Outside Dhaka",
                    customerEmail: "", // Optional
                    shippingCost: formData.shippingCost,
                    items: [
                        {
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image_url,
                            quantity: 1,
                        },
                    ],
                    paymentMethod: "cash_on_delivery",
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong")
            }

            Swal.fire({
                title: "সফল!",
                text: "অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!",
                icon: "success",
                confirmButtonColor: "#e11d48",
                timer: 3000,
                timerProgressBar: true
            })
            setOpen(false)
            setFormData({ name: "", phone: "", address: "", shippingCost: 70 })

            // Redirect to confirmation page
            router.push(`/order-confirmation?orderNumber=${data.order.orderNumber}&total=${data.order.total}`)
        } catch (error) {
            console.error(error)
            Swal.fire({
                title: "দুঃখিত",
                text: "অর্ডার করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।",
                icon: "error",
                confirmButtonColor: "#e11d48",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleOpenChange = (newOpen: boolean) => {
        if (disabled) return
        setOpen(newOpen)
    }

    // Handle click to prevent navigation if inside a link
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!disabled) {
            setOpen(true)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    size={size}
                    className={className}
                    onClick={handleClick}
                    disabled={disabled}
                >
                    {showIcon && <ShoppingBag className="mr-2 h-4 w-4" />}
                    {text}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>অর্ডার কনফার্ম করুন</DialogTitle>
                    <DialogDescription>
                        আপনার নাম, ফোন নম্বর এবং ঠিকানা দিন। আমরা শীঘ্রই কল করে কনফার্ম করবো।
                    </DialogDescription>
                </DialogHeader>

                {/* Product Summary */}
                <div className="flex items-center gap-4 py-4 border-b">
                    {product.image_url && (
                        <div className="relative h-16 w-12 rounded overflow-hidden">
                            <img src={product.image_url} alt={product.name} className="object-cover h-full w-full" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                        <div className="flex justify-between items-end mt-1">
                            <p className="text-sm font-semibold">৳{product.price}</p>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase">ডেলিভারি চার্জ</p>
                                <p className="text-xs font-medium">৳{formData.shippingCost}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">আপনার নাম</Label>
                        <Input
                            id="name"
                            placeholder="আপনার নাম লিখুন"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone">ফোন নম্বর</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>ডেলিভারি এরিয়া</Label>
                        <Select
                            value={formData.shippingCost.toString()}
                            onValueChange={(val) => setFormData({ ...formData, shippingCost: parseInt(val) })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="ডেলিভারি এরিয়া সিলেক্ট করুন" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="70">ঢাকার ভিতরে (৳৭০)</SelectItem>
                                <SelectItem value="120">ঢাকার বাইরে (৳১২০)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="address">ঠিকানা</Label>
                        <Textarea
                            id="address"
                            placeholder="আপনার পূর্ণ ঠিকানা লিখুন"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            required
                        />
                    </div>

                    <div className="bg-muted/50 p-3 rounded-md flex justify-between items-center mt-2">
                        <span className="text-sm font-medium">সর্বমোট মূল্য:</span>
                        <span className="text-lg font-bold text-primary">৳{product.price + formData.shippingCost}</span>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full h-12 text-lg">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    অর্ডার প্রসেস হচ্ছে...
                                </>
                            ) : (
                                "অর্ডার কনফার্ম করুন"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
