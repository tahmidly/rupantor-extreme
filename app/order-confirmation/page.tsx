"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, MessageCircle } from "lucide-react"
import Link from "next/link"

function OrderConfirmationContent() {
    const searchParams = useSearchParams()
    const orderNumber = searchParams.get("orderNumber")
    const total = searchParams.get("total")

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-rose-50/20">
            <Header />

            <main className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-12">
                <div className="w-full max-w-2xl px-4 ">
                    {/* Success Message */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">অর্ডার সফল হয়েছে!</h1>
                        <p className="text-muted-foreground text-lg">
                            আপনার অর্ডার সফলভাবে প্লেস করা হয়েছে।
                        </p>
                    </div>

                    {/* Order Details Card */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                অর্ডার বিবরণ
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {orderNumber && (
                                <div className="flex justify-between items-center py-3 border-b">
                                    <span className="text-muted-foreground">অর্ডার নম্বর</span>
                                    <span className="font-semibold text-lg">{orderNumber}</span>
                                </div>
                            )}
                            {total && (
                                <div className="flex justify-between items-center py-3 border-b">
                                    <span className="text-muted-foreground">মোট মূল্য</span>
                                    <span className="font-semibold text-lg">৳{parseFloat(total).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center py-3">
                                <span className="text-muted-foreground">পেমেন্ট পদ্ধতি</span>
                                <span className="font-medium">ক্যাশ অন ডেলিভারি</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Information Card */}
                    <Card className="mb-6 bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <h3 className="font-semibold mb-2">পরবর্তী কি হবে?</h3>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li>• আমরা শীঘ্রই আপনার অর্ডার কনফার্ম করব</li>
                                <li>• আপনার ফোন নম্বরে যোগাযোগ করা হবে</li>
                                <li>• পণ্য ডেলিভারির সময় পেমেন্ট করবেন</li>
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button asChild className="flex-1 rounded-full h-12">
                            <Link href="/shop">আরো কেনাকাটা করুন</Link>
                        </Button>
                        <Button
                            className="flex-1 rounded-full h-12 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                                const message = `আমি অর্ডার করেছি। অর্ডার নম্বর: ${orderNumber}। দয়া করে কনফার্ম করুন।`
                                window.open(`https://wa.me/+8801751922148?text=${encodeURIComponent(message)}`, '_blank')
                            }}
                        >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            WhatsApp-এ কনফার্ম করুন
                        </Button>
                    </div>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        আপনার অর্ডার নম্বরটি সংরক্ষণ করুন: <span className="font-semibold text-foreground">{orderNumber}</span>
                    </p>
                </div>
            </main>
        </div>
    )
}

export default function OrderConfirmationPage() {
    return (
        <Suspense>
            <OrderConfirmationContent />
        </Suspense>
    )
}
