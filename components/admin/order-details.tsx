"use client"

import { OrderWithItems, OrderStatus } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import { User, Phone, Mail, MapPin, Package, CreditCard, Trash2, MessageCircle, Loader2 } from "lucide-react"
import Swal from "sweetalert2"

interface OrderDetailsProps {
    order: OrderWithItems
    onStatusUpdate: (orderId: string, newStatus: string) => void
    onDelete: (orderId: string) => void
    isUpdating?: boolean
    isDeleting?: boolean
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

export function OrderDetails({
    order,
    onStatusUpdate,
    onDelete,
    isUpdating = false,
    isDeleting = false
}: OrderDetailsProps) {
    return (
        <div className="rounded-lg py-7 border bg-card sticky top-24">
            <CardHeader>
                <div className="flex items-start justify-between">
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
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Status Update */}
                {/* Order Status Section */}
                <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        স্ট্যাটাস আপডেট করুন
                    </label>
                    <Select
                        key={`status-${order.id}-${order.status}`}
                        defaultValue={order.status}
                        onValueChange={(value) => onStatusUpdate(order.id, value)}
                        disabled={isUpdating || isDeleting}
                    >
                        <SelectTrigger className="w-full bg-background border-2 focus:ring-primary h-11">
                            <SelectValue placeholder="সিলেক্ট করুন" />
                        </SelectTrigger>
                        <SelectContent className="z-[100]">
                            <SelectItem value="pending">⏳ পেন্ডিং</SelectItem>
                            <SelectItem value="confirmed">✅ কনফার্মড</SelectItem>
                            <SelectItem value="processing">⚙️ প্রসেসিং</SelectItem>
                            <SelectItem value="shipped">🚚 শিপড</SelectItem>
                            <SelectItem value="delivered">🎉 ডেলিভার হয়েছে</SelectItem>
                            <SelectItem value="cancelled">❌ বাতিল</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button
                    variant="outline"
                    className="w-full border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
                    disabled={isUpdating || isDeleting}
                    onClick={() => {
                        let message = ""
                        switch (order.status) {
                            case "pending":
                                message = `আসসালামু আলাইকুম ${order.customer_name}, আপনার অর্ডার #${order.order_number} টি আমাদের সিস্টেমে পেন্ডিং আছে। আমরা শীঘ্রই এটি কনফার্ম করবো।`
                                break
                            case "confirmed":
                                message = `আসসালামু আলাইকুম ${order.customer_name}, আপনার অর্ডার #${order.order_number} টি কনফার্ম করা হয়েছে। আমরা শীঘ্রই এটি পাঠানোর ব্যবস্থা করছি।`
                                break
                            case "processing":
                                message = `আসসালামু আলাইকুম ${order.customer_name}, আপনার অর্ডার #${order.order_number} টি প্রসেসিং করা হচ্ছে।`
                                break
                            case "shipped":
                                message = `আসসালামু আলাইকুম ${order.customer_name}, সুখবর! আপনার অর্ডার #${order.order_number} টি শিপ করা হয়েছে। শীঘ্রই আপনি এটি ডেলিভারি পাবেন।`
                                break
                            case "delivered":
                                message = `আসসালামু আলাইকুম ${order.customer_name}, আপনার অর্ডার #${order.order_number} টি সফলভাবে ডেলিভার হয়েছে। আমাদের সাথে থাকার জন্য ধন্যবাদ।`
                                break
                            case "cancelled":
                                message = `দুঃখিত ${order.customer_name}, আপনার অর্ডার #${order.order_number} টি বাতিল করা হয়েছে। বিস্তারিত জানতে আমাদের সাথে যোগাযোগ করুন।`
                                break
                            default:
                                message = `আসসালামু আলাইকুম ${order.customer_name}, আপনার অর্ডার #${order.order_number} সম্পর্কে আপডেট।`
                        }

                        // Format phone number (ensure +88 prefix)
                        let phone = order.customer_phone.trim()
                        if (phone.startsWith("0")) {
                            phone = "+88" + phone
                        } else if (!phone.startsWith("+")) {
                            phone = "+880" + phone
                        }

                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
                    }}
                >
                    {isUpdating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <MessageCircle className="mr-2 h-4 w-4" />
                    )}
                    WhatsApp-এ মেসেজ পাঠান
                </Button>

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

                <Separator />

                <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={isDeleting || isUpdating}
                    onClick={async () => {
                        const result = await Swal.fire({
                            title: "আপনি কি নিশ্চিত?",
                            text: "এই অর্ডারটি চিরতরে ডিলিট করা হবে!",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#e11d48",
                            cancelButtonColor: "#64748b",
                            confirmButtonText: "হ্যাঁ, ডিলিট করুন",
                            cancelButtonText: "বাতিল"
                        })

                        if (result.isConfirmed) {
                            onDelete(order.id)
                        }
                    }}
                >
                    {isDeleting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    অর্ডার ডিলিট করুন
                </Button>
            </CardContent>
        </div>
    )
}
