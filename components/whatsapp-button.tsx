"use client"

import Link from "next/link"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
    const phoneNumber = "+8801751922148" // WhatsApp number
    const message = "আসসালামু আলাইকুম! আমি আপনার পণ্য সম্পর্কে জানতে চাই।" // Default message

    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`

    return (
        <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            aria-label="WhatsApp এ যোগাযোগ করুন"
        >
            <MessageCircle className="w-7 h-7" />

            {/* Tooltip */}
            <span className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
                WhatsApp এ যোগাযোগ করুন
            </span>

            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
        </Link>
    )
}
