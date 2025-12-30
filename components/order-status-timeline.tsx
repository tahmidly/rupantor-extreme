"use client"

import { OrderStatus } from "@/types"
import { CheckCircle2, Circle, Clock, Package, Truck, XCircle } from "lucide-react"

interface OrderStatusTimelineProps {
    status: OrderStatus
}

const statusSteps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: "pending", label: "অর্ডার প্লেসড", icon: Clock },
    { status: "confirmed", label: "কনফার্মড", icon: CheckCircle2 },
    { status: "processing", label: "প্রসেসিং", icon: Package },
    { status: "shipped", label: "শিপড", icon: Truck },
    { status: "delivered", label: "ডেলিভার হয়েছে", icon: CheckCircle2 },
]

const statusOrder: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered"]

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
    // Handle cancelled status separately
    if (status === "cancelled") {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-full">
                    <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-red-900">অর্ডার বাতিল হয়েছে</h3>
                    <p className="text-sm text-red-700">এই অর্ডারটি বাতিল করা হয়েছে।</p>
                </div>
            </div>
        )
    }

    const currentStepIndex = statusOrder.indexOf(status)

    return (
        <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold mb-6">অর্ডার স্ট্যাটাস</h3>

            <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
                <div
                    className="absolute left-4 top-0 w-0.5 bg-primary transition-all duration-500"
                    style={{
                        height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                    }}
                />

                {/* Steps */}
                <div className="space-y-8 relative">
                    {statusSteps.map((step, index) => {
                        const Icon = step.icon
                        const isCompleted = index <= currentStepIndex
                        const isCurrent = index === currentStepIndex

                        return (
                            <div key={step.status} className="flex items-start gap-4">
                                <div
                                    className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isCompleted
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : "bg-background border-muted-foreground/30 text-muted-foreground"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Icon className="h-4 w-4" />
                                    ) : (
                                        <Circle className="h-4 w-4" />
                                    )}
                                </div>
                                <div className="flex-1 pt-0.5">
                                    <p
                                        className={`font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"
                                            }`}
                                    >
                                        {step.label}
                                    </p>
                                    {isCurrent && (
                                        <p className="text-sm text-primary mt-1">বর্তমান স্ট্যাটাস</p>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
