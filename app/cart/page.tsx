"use client"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag } from "lucide-react"

export default function CartPage() {
    const { items, updateQuantity, removeItem, cartTotal, clearCart } = useCart()
    const router = useRouter()

    const handleCheckout = () => {
        router.push("/checkout")
    }

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
                        আপনার ব্যাগে বর্তমানে কোনো পণ্য নেই। আমাদের কালেকশন ঘুরে দেখুন।
                    </p>
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/shop">কেনাকাটা শুরু করুন</Link>
                    </Button>
                </div>
            </>
        )
    }

    return (
        <>
            <Header />
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <h1 className="text-3xl font-serif font-bold mb-8">আপনার ব্যাগ ({items.length})</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8 space-y-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                            >
                                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col justify-between">
                                    <div className="flex justify-between gap-4">
                                        <div>
                                            <h3 className="font-medium line-clamp-2">
                                                <Link href={`/products/${item.id}`} className="hover:underline">
                                                    {item.name}
                                                </Link>
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                ৳{item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-red-500"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">মুছুন</span>
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 border rounded-md bg-background">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                disabled={item.quantity <= 1}
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="ml-auto font-semibold">
                                            ৳{(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button variant="outline" className="text-muted-foreground hover:text-red-500" onClick={clearCart}>
                            ব্যাগ খালি করুন
                        </Button>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="rounded-lg border bg-card p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-semibold mb-6">অর্ডার সামারি</h2>

                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">সাবটোটাল</span>
                                    <span className="font-medium">৳{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">শিপিং</span>
                                    <span className="text-green-600 font-medium">ফ্রি</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between items-end">
                                    <span className="font-semibold text-lg">সর্বমোট</span>
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold">৳{cartTotal.toFixed(2)}</span>
                                        <span className="text-xs text-muted-foreground">ভ্যাট সহ</span>
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full mt-8 rounded-full h-12 text-lg font-medium" onClick={handleCheckout}>
                                চেকআউট করুন <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>

                            <p className="text-xs text-center text-muted-foreground mt-4">
                                চেকআউট করে আপনার অর্ডার সম্পন্ন করুন।
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
