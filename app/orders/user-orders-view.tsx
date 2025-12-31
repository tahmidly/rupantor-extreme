"use client"

import { useState } from "react"
import { OrderWithItems } from "@/types"
import { OrderHistory } from "@/components/order-history"
import { UserOrderDetails } from "@/components/user-order-details"
import { Header } from "@/components/header"

interface UserOrdersViewProps {
    orders: OrderWithItems[]
}

export function UserOrdersView({ orders }: UserOrdersViewProps) {
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(
        orders.length > 0 ? orders[0] : null
    )

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-rose-50/20">
            <Header />

            <main className="container mx-auto py-8 px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">আমার অর্ডার</h1>
                    <p className="text-muted-foreground">আপনার সকল অর্ডার দেখুন এবং ট্র্যাক করুন</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Order List - Takes 1 column */}
                    <div className="md:col-span-1">
                        <OrderHistory
                            orders={orders}
                            onSelectOrder={setSelectedOrder}
                            selectedOrderId={selectedOrder?.id}
                        />
                    </div>

                    {/* Order Details - Takes 2 columns */}
                    <div className="md:col-span-2">
                        {selectedOrder ? (
                            <UserOrderDetails order={selectedOrder} />
                        ) : (
                            <div className="h-full min-h-[400px] flex items-center justify-center rounded-lg border bg-card text-muted-foreground">
                                <p>বিস্তারিত দেখতে একটি অর্ডার নির্বাচন করুন</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
