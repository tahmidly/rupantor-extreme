    "use client"

import { OrderWithItems, OrderStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface OrderListProps {
    orders: OrderWithItems[]
    loading: boolean
    onSelectOrder: (order: OrderWithItems) => void
    selectedOrderId?: string
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

export function OrderList({ orders, loading, onSelectOrder, selectedOrderId }: OrderListProps) {
    if (loading) {
        return (
            <div className="rounded-lg border bg-card p-8 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (orders.length === 0) {
        return (
            <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
                কোনো অর্ডার পাওয়া যায়নি
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {orders.map((order) => (
                <button
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className={`w-full text-left rounded-lg border bg-card p-4 transition-all hover:shadow-md ${selectedOrderId === order.id ? "ring-2 ring-primary" : ""
                        }`}
                >
                    <div className="flex items-start gap-4 mb-3">
                         <div className="relative h-16 w-16 rounded overflow-hidden bg-muted flex-shrink-0 border">
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
                                <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1 rounded-tl">
                                    +{order.items.length - 1}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold">{order.order_number}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-1">{order.customer_name}</p>
                                </div>
                                <Badge className={`whitespace-nowrap ${statusColors[order.status]}`}>
                                    {statusLabels[order.status]}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            {formatDate(order.created_at)}
                        </span>
                        <span className="font-semibold">৳{Number(order.total).toFixed(2)}</span>
                    </div>
                </button>
            ))}
        </div>
    )
}
