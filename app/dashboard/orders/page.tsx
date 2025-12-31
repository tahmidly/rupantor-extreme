"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { OrderManagement } from "@/components/admin/order-management"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle, Truck, Lock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

export default function DashboardOrdersPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        processing: 0,
        confirmed: 0,
        delivered: 0,
    })
    const router = useRouter()

    useEffect(() => {
        const session = localStorage.getItem("admin_session")
        if (session !== "true") {
            router.push("/dashboard")
        } else {
            setIsLoggedIn(true)
            fetchStats()
        }
    }, [router])

    const fetchStats = async () => {
        try {
            // Fetch order stats from API
            const response = await fetch("/api/orders")
            if (response.ok) {
                const data = await response.json()
                if (data.success && data.orders) {
                    const orders = data.orders
                    setStats({
                        total: orders.length,
                        pending: orders.filter((o: any) => o.status === "pending").length,
                        processing: orders.filter((o: any) => o.status === "processing").length,
                        confirmed: orders.filter((o: any) => o.status === "confirmed").length,
                        delivered: orders.filter((o: any) => o.status === "delivered").length,
                    })
                }
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("admin_session")
        router.push("/dashboard")
    }



    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>অ্যাক্সেস ডিনাইড</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground mb-4">
                            এই পেজ দেখতে আপনাকে লগইন করতে হবে।
                        </p>
                        <Button onClick={() => router.push("/dashboard")}>
                            লগইন পেজে যান
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-rose-50/20">
            <Header />

            <main className="container mx-auto py-8 px-4">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">অর্ডার ম্যানেজমেন্ট</h1>
                        <p className="text-muted-foreground">সকল অর্ডার দেখুন এবং পরিচালনা করুন</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={handleLogout}
                    >
                        লগআউট
                    </Button>
                </div>

                {/* Order Stats */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">মোট অর্ডার</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">পেন্ডিং</CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pending}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">প্রসেসিং</CardTitle>
                            <Truck className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.processing + stats.confirmed}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">ডেলিভার হয়েছে</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.delivered}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Management */}
                <OrderManagement />
            </main>
        </div>
    )
}
