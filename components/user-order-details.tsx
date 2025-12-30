"use client"

import { OrderWithItems, OrderStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import { User, Phone, Mail, MapPin, Package, CreditCard } from "lucide-react"
import { OrderStatusTimeline } from "@/components/order-status-timeline"

interface UserOrderDetailsProps {
    order: OrderWithItems
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

export function UserOrderDetails({ order }: UserOrderDetailsProps) {
    return (
        <div className="rounded-lg py-7 border bg-card sticky top-24 h-fit">
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl">{order.order_number}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {formatDate(order.created_at)}
                        </p>
                    </div>
                    <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                    </Badge>
                </div>

                <div className="mt-6">
                    <OrderStatusTimeline status={order.status} />
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <Separator />

                {/* Customer Info */}
                <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        গ্রাহক তথ্য
                    </h3>
                    <div className="space-y-2 text-sm">
                        <p className="flex items-start gap-2">
                            <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <span>{order.customer_name}</span>
                        </p>
                        <p className="flex items-start gap-2">
                            <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                            <span>{order.customer_phone}</span>
                        </p>
                        {order.customer_email && (
                            <p className="flex items-start gap-2">
                                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <span>{order.customer_email}</span>
                            </p>
                        )}
                    </div>
                </div>

                <Separator />

                {/* Delivery Address */}
                <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        ডেলিভারি ঠিকানা
                    </h3>
                    <div className="text-sm space-y-1">
                        <p>{order.delivery_address}</p>
                        <p>
                            {order.delivery_city}
                            {order.delivery_area && `, ${order.delivery_area}`}
                        </p>
                        {order.postal_code && <p>পোস্টাল কোড: {order.postal_code}</p>}
                    </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        পণ্য তালিকা
                    </h3>
                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                                    {item.product_image && (
                                        <Image
                                            src={item.product_image}
                                            alt={item.product_name}
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-2">{item.product_name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        ৳{Number(item.price).toFixed(2)} × {item.quantity}
                                    </p>
                                    <p className="text-sm font-semibold mt-1">
                                        ৳{Number(item.subtotal).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Payment Info */}
                <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        পেমেন্ট তথ্য
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">সাবটোটাল</span>
                            <span>৳{Number(order.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">শিপিং</span>
                            <span className="text-green-600">
                                {Number(order.shipping_cost) === 0 ? "ফ্রি" : `৳${Number(order.shipping_cost).toFixed(2)}`}
                            </span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-base">
                            <span>মোট</span>
                            <span>৳{Number(order.total).toFixed(2)}</span>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                            <p className="text-xs text-muted-foreground">
                                পেমেন্ট পদ্ধতি: <span className="font-medium">ক্যাশ অন ডেলিভারি</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Order Notes */}
                {order.order_notes && (
                    <>
                        <Separator />
                        <div>
                            <h3 className="font-semibold mb-2">বিশেষ নির্দেশনা</h3>
                            <p className="text-sm text-muted-foreground">{order.order_notes}</p>
                        </div>
                    </>
                )}
            </CardContent>
        </div>
    )
}
