"use client"

import { OrderWithItems, OrderStatus } from "@/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Package, ShoppingBag } from "lucide-react"


interface OrderHistoryProps {
    orders: OrderWithItems[]
    onSelectOrder?: (order: OrderWithItems) => void
    selectedOrderId?: string | null
}

const statusColors: Record<OrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    confirmed: "bg-blue-100 text-blue-800 border-blue-300",
    processing: "bg-purple-100 text-purple-800 border-purple-300",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-300",
    delivered: "bg-green-100 text-green-800 border-green-300",
    cancelled: "bg-red-100 text-red-800 border-red-300",
}

const statusLabels: Record<OrderStatus, string> = {
    pending: "পেন্ডিং",
    confirmed: "কনফার্মড",
    processing: "প্রসেসিং",
    shipped: "শিপড",
    delivered: "ডেলিভার হয়েছে",
    cancelled: "বাতিল",
}

export function OrderHistory({ orders, onSelectOrder, selectedOrderId }: OrderHistoryProps) {
    if (orders.length === 0) {
        return (
            <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-muted p-6 rounded-full mb-6">
                    <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">কোনো অর্ডার নেই</h2>
                <p className="text-muted-foreground mb-8 text-lg">
                    আপনি এখনো কোনো অর্ডার করেননি।
                </p>
                <Link
                    href="/shop"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                    কেনাকাটা শুরু করুন
                </Link>
            </div>
        )
    }

    const OrderCard = ({ order }: { order: OrderWithItems }) => (
        <Card className={`p-4 hover:shadow-md transition-all cursor-pointer ${
            selectedOrderId === order.id ? "ring-2 ring-primary border-primary bg-accent/50" : ""
        }`}>
            <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 rounded overflow-hidden bg-muted flex-shrink-0 border">
                    {order.items && order.items[0] && order.items[0].product_image ? (
                        <img
                            src={order.items[0].product_image}
                            alt="Product"
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gray-100 text-xs text-muted-foreground">
                            No Img
                        </div>
                    )}
                    {order.items && order.items.length > 1 && (
                        <div className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded-tl">
                            +{order.items.length - 1} more
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div>
                            <h3 className="font-semibold text-lg">{order.order_number}</h3>
                            <p className="text-sm text-muted-foreground">
                                {formatDate(order.created_at)}
                            </p>
                        </div>
                        <Badge className={`w-fit ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                        </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t mt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Package className="h-4 w-4" />
                            <span>{order.items.length} টি পণ্য</span>
                        </div>
                        <span className="text-lg font-bold">৳{Number(order.total).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </Card>
    )

    return (
        <div className="space-y-6">
            {orders.map((order) => (
                onSelectOrder ? (
                    <div key={order.id} onClick={() => onSelectOrder(order)}>
                        <OrderCard order={order} />
                    </div>
                ) : (
                    <Link key={order.id} href={`/orders/${order.id}`} className="block">
                        <OrderCard order={order} />
                    </Link>
                )
            ))}
        </div>
    )
}
