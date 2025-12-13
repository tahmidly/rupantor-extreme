"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { ShoppingCart } from "lucide-react"

interface AddToCartButtonProps {
    product: {
        id: string
        name: string
        price: number
        image_url: string
    }
    className?: string
    size?: "default" | "sm" | "lg" | "icon"
    showIcon?: boolean
    text?: string
    disabled?: boolean
}

export function AddToCartButton({
    product,
    className,
    size = "default",
    showIcon = false,
    text = "Add to Cart",
    disabled = false,
}: AddToCartButtonProps) {
    const { addItem } = useCart()

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault() // Prevent navigation if inside a Link
        e.stopPropagation()
        addItem({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image_url || "/placeholder.jpg",
        })
    }

    return (
        <Button
            size={size}
            className={className}
            onClick={handleAddToCart}
            disabled={disabled}
        >
            {showIcon && <ShoppingCart className="mr-2 h-4 w-4" />}
            {text}
        </Button>
    )
}
