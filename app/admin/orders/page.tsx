import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { Header } from "@/components/header"
import { OrderManagement } from "@/components/admin/order-management"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle, Truck } from "lucide-react"
import { getOrderStats } from "@/lib/db"

export default async function AdminOrdersPage() {
    try {
        await requireAdmin()
    } catch {
        redirect("/sign-in")
    }

    // Get order statistics
    const stats = await getOrderStats()

    return (
        <div className="min-h-screen  bg-gradient-to-b  from-background to-rose-50/20">
            <Header />

            <main className="container py-8 px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">অর্ডার ম্যানেজমেন্ট</h1>
                    <p className="text-muted-foreground">সকল অর্ডার দেখুন এবং পরিচালনা করুন</p>
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
