"use client"

import { useState, useEffect } from "react"
import { OrderWithItems } from "@/types"
import { OrderList } from "./order-list"
import { OrderDetails } from "./order-details"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw } from "lucide-react"
import Swal from "sweetalert2"

export function OrderManagement() {
    const [orders, setOrders] = useState<OrderWithItems[]>([])
    const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [error, setError] = useState<string | null>(null)

    const fetchOrders = async () => {
        setLoading(true)
        setError(null)
        try {
            const url = statusFilter === "all"
                ? "/api/orders"
                : `/api/orders?status=${statusFilter}`

            const response = await fetch(url)
            const data = await response.json()

            if (data.success) {
                setOrders(data.orders)
            } else {
                setError(data.error || "Failed to fetch orders")
                setOrders([])
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error)
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        fetchOrders()
    }, [statusFilter])

    const [isUpdating, setIsUpdating] = useState(false)

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setIsUpdating(true)
        try {
            const response = await fetch(`/api/orders/${orderId}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                // Update selected order immediately for UI responsiveness
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(prev => prev ? ({ ...prev, status: newStatus as any }) : null)
                }

                // Refresh orders list in background
                await fetchOrders()
            }
        } catch (error) {
            console.error("Failed to update order status:", error)
        } finally {
            setIsUpdating(false)
        }
    }

    const [isDeleting, setIsDeleting] = useState(false)

    const handleOrderDelete = async (orderId: string) => {
        setIsDeleting(true)
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: "DELETE",
            })

            if (response.ok) {
                Swal.fire({
                    title: "সফল!",
                    text: "অর্ডারটি ডিলিট করা হয়েছে",
                    icon: "success",
                    confirmButtonColor: "#e11d48",
                    timer: 2000,
                    timerProgressBar: true
                })
                // Refresh orders
                await fetchOrders()
                // Deselect order
                setSelectedOrder(null)
            } else {
                Swal.fire({
                    title: "ব্যর্থ",
                    text: "অর্ডার ডিলিট করা সম্ভব হয়নি",
                    icon: "error",
                    confirmButtonColor: "#e11d48",
                })
            }
        } catch (error) {
            console.error("Failed to delete order:", error)
            Swal.fire({
                title: "ব্যর্থ",
                text: "অর্ডার ডিলিট করার সময় একটি সমস্যা হয়েছে",
                icon: "error",
                confirmButtonColor: "#e11d48",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const filteredOrders = orders.filter(order => {
        if (!searchQuery) return true

        const query = searchQuery.toLowerCase()
        return (
            order.order_number.toLowerCase().includes(query) ||
            order.customer_name.toLowerCase().includes(query) ||
            order.customer_phone.includes(query)
        )
    })

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* ... (search and select inputs) ... */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="অর্ডার নম্বর, নাম বা ফোন দিয়ে খুঁজুন..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="স্ট্যাটাস ফিল্টার" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">সব অর্ডার</SelectItem>
                        <SelectItem value="pending">পেন্ডিং</SelectItem>
                        <SelectItem value="confirmed">কনফার্মড</SelectItem>
                        <SelectItem value="processing">প্রসেসিং</SelectItem>
                        <SelectItem value="shipped">শিপড</SelectItem>
                        <SelectItem value="delivered">ডেলিভার হয়েছে</SelectItem>
                        <SelectItem value="cancelled">বাতিল</SelectItem>
                    </SelectContent>
                </Select>

                <Button variant="outline" size="icon" onClick={fetchOrders}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">
                    <p className="font-semibold">Error loading orders:</p>
                    <p>{error}</p>
                </div>
            )}

            {/* Order List and Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                    <OrderList
                        orders={filteredOrders}
                        loading={loading}
                        onSelectOrder={setSelectedOrder}
                        selectedOrderId={selectedOrder?.id}
                    />
                </div>

                <div className="lg:col-span-5">
                    {selectedOrder ? (
                        <OrderDetails
                            order={selectedOrder}
                            onStatusUpdate={handleStatusUpdate}
                            onDelete={handleOrderDelete}
                            isUpdating={isUpdating}
                            isDeleting={isDeleting}
                        />
                    ) : (
                        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
                            একটি অর্ডার নির্বাচন করুন বিস্তারিত দেখতে
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
