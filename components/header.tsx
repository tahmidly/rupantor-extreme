"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "./auth-provider"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Search, ShoppingCart, User, LogOut, Menu, X, Package } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
    const { user, signOut } = useAuth()
    const { cartCount } = useCart()
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
            setIsSearchOpen(false)
        }
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">

                {/* Left: Mobile Menu & Logo */}
                <div className="flex items-center gap-2 lg:gap-8">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden -ml-2">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
                            <div className="flex flex-col h-full bg-background">
                                <div className="p-6 border-b">
                                    <Link href="/" className="flex items-center gap-2">
                                        <Image src="/logo2.jpeg" alt="রূপান্তর" width={160} height={80} className="h-28 w-96 object-contain" />
                                    </Link>
                                </div>
                                <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
                                    <SheetClose asChild>
                                        <Link href="/" className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-md">হোম</Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link href="/shop" className="block px-4 py-3 text-lg font-medium hover:bg-muted rounded-md">সকল পণ্য</Link>
                                    </SheetClose>
                                </nav>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo2.jpeg" alt="রূপান্তর" width={160} height={80} className="h-20 w-auto object-contain" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
                        <Link href="/" className="hover:text-primary transition-colors">হোম</Link>
                        <Link href="/shop" className="hover:text-primary transition-colors">সকল পণ্য</Link>
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Search Trigger */}
                    <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Search className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="top" className="h-[200px] flex flex-col justify-center">
                            <SheetTitle className="sr-only">পণ্য অনুসন্ধান করুন</SheetTitle>
                            <form onSubmit={handleSearch} className="container mx-auto max-w-2xl relative">
                                <input
                                    type="text"
                                    placeholder="হিজাব, আবায়া অনুসন্ধান করুন..."
                                    className="w-full text-3xl font-medium bg-transparent border-b-2 border-primary focus:outline-none pb-2 placeholder:text-muted-foreground/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </form>
                        </SheetContent>
                    </Sheet>

                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* User icon removed as requested */}
                </div>
            </div>
        </header>
    )
}
