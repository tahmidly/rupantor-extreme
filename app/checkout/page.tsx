"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Send, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Swal from "sweetalert2"

interface FormData {
    fullName: string
    phone: string
    email: string
    address: string
    city: string
    postalCode: string
    area: string
    notes: string
}

interface FormErrors {
    fullName?: string
    phone?: string
    address?: string
    city?: string
}

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart()
    const { user, loading } = useAuth()
    const router = useRouter()

    /*
    useEffect(() => {
        if (!loading && !user) {
            router.push("/sign-in")
        }
    }, [user, loading, router])
    */

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        area: "",
        notes: "",
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [shippingCost, setShippingCost] = useState(70) // Default: Inside Dhaka

    // Redirect if cart is empty
    if (items.length === 0) {
        return (
            <>
                <Header />
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
                    <div className="bg-muted p-6 rounded-full mb-6">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">আপনার ব্যাগ খালি</h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        চেকআউট করার জন্য প্রথমে পণ্য যোগ করুন।
                    </p>
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/shop">কেনাকাটা শুরু করুন</Link>
                    </Button>
                </div>
            </>
        )
    }

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.fullName.trim()) {
            newErrors.fullName = "নাম আবশ্যক"
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "ফোন নম্বর আবশ্যক"
        } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
            newErrors.phone = "সঠিক ফোন নম্বর দিন"
        }

        if (!formData.address.trim()) {
            newErrors.address = "ঠিকানা আবশ্যক"
        }



        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        try {
            // Create order in database
            const response = await fetch("/api/orders/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customerName: formData.fullName,
                    customerPhone: formData.phone,
                    customerEmail: "", // Removed field
                    deliveryAddress: formData.address,
                    deliveryCity: shippingCost === 70 ? "Dhaka" : "Outside Dhaka",
                    deliveryArea: "", // Removed field
                    postalCode: "", // Removed field
                    orderNotes: "", // Removed field
                    paymentMethod: "cash_on_delivery",
                    shippingCost: shippingCost,
                    items: items.map((item) => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to create order")
            }

            const data = await response.json()

            // Clear cart after successful order
            clearCart()

            // Redirect to order confirmation page with order details
            router.push(`/order-confirmation?orderNumber=${data.order.orderNumber}&total=${data.order.total}`)
        } catch (error) {
            console.error("Order submission error:", error)
            Swal.fire({
                title: "দুঃখিত",
                text: "অর্ডার তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
                icon: "error",
                confirmButtonColor: "#e11d48",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8 lg:py-12">
                {/* Back Button */}
                <Button variant="ghost" asChild className="mb-6 -ml-4">
                    <Link href="/cart">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        ব্যাগে ফিরে যান
                    </Link>
                </Button>

                <h1 className="text-3xl font-serif font-bold mb-8">চেকআউট</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Checkout Form */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Simplified Checkout Form */}
                            <div className="bg-card/50 border rounded-lg p-6 space-y-6">
                                <h2 className="text-xl font-semibold mb-4">ডেলিভারি তথ্য</h2>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName">
                                            আপনার নাম <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="fullName"
                                            type="text"
                                            placeholder="আপনার নাম লিখন"
                                            value={formData.fullName}
                                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                                            className={errors.fullName ? "border-red-500" : ""}
                                        />
                                        {errors.fullName && (
                                            <p className="text-sm text-red-500">{errors.fullName}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            ফোন নম্বর <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="01XXXXXXXXX"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            className={errors.phone ? "border-red-500" : ""}
                                        />
                                        {errors.phone && (
                                            <p className="text-sm text-red-500">{errors.phone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">
                                            সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="address"
                                            placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন (বাসা নং, রোড, এলাকা, জেলা)"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange("address", e.target.value)}
                                            className={`min-h-[100px] ${errors.address ? "border-red-500" : ""}`}
                                        />
                                        {errors.address && (
                                            <p className="text-sm text-red-500">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>ডেলিভারি এলাকা <span className="text-red-500">*</span></Label>
                                        <Select
                                            value={shippingCost.toString()}
                                            onValueChange={(val) => setShippingCost(parseInt(val))}
                                        >
                                            <SelectTrigger className="w-full h-11 border-2">
                                                <SelectValue placeholder="ডেলিভারি এরিয়া সিলেক্ট করুন" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="70">ঢাকার ভিতরে (৳৭০)</SelectItem>
                                                <SelectItem value="120">ঢাকার বাইরে (৳১২০)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button - Mobile */}
                            <div className="lg:hidden">
                                <Button
                                    type="submit"
                                    className="w-full rounded-full h-12 text-lg font-medium"
                                    disabled={isSubmitting}
                                >
                                    অর্ডার কনফার্ম করুন <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary - Sticky on Desktop */}
                    <div className="lg:col-span-5">
                        <div className="rounded-lg border bg-card p-6 shadow-sm lg:sticky lg:top-24 space-y-6">
                            <h2 className="text-xl font-semibold">অর্ডার সামারি</h2>

                            {/* Cart Items */}
                            <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3 pb-4 border-b last:border-b-0">
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                পরিমাণ: {item.quantity}
                                            </p>
                                            <p className="text-sm font-semibold mt-1">
                                                ৳{(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Price Summary */}
                            <div className="space-y-4 text-sm border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">সাবটোটাল</span>
                                    <span className="font-medium">৳{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">শিপিং</span>
                                    <span className="text-primary font-medium">৳{shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between items-end">
                                    <span className="font-semibold text-lg">সর্বমোট</span>
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold">৳{(cartTotal + shippingCost).toFixed(2)}</span>
                                        <span className="text-xs text-muted-foreground">ভ্যাট সহ</span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button - Desktop */}
                            <div className="hidden lg:block">
                                <Button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="w-full rounded-full h-12 text-lg font-medium"
                                    disabled={isSubmitting}
                                >
                                    অর্ডার সম্পন্ন করুন <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </div>

                            <p className="text-xs text-center text-muted-foreground">
                                অর্ডার সম্পন্ন করার পর কনফার্মেশন পেজে যাবেন।
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
