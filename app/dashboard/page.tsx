"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { ProductManagement } from "@/components/admin/product-management"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, ShoppingBag, Lock } from "lucide-react"

export default function DashboardPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        const session = localStorage.getItem("admin_session")
        if (session === "true") {
            setIsLoggedIn(true)
        }
    }, [])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (username === "admin" && password === "admin123") {
            localStorage.setItem("admin_session", "true")
            setIsLoggedIn(true)
            setError("")
        } else {
            setError("ভুল ইউজারনেম বা পাসওয়ার্ড (Invalid username or password)")
        }
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>অ্যাডমিন লগইন</CardTitle>
                        <CardDescription>ড্যাশবোর্ড এক্সেস করতে লগইন করুন</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">ইউজারনেম</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">পাসওয়ার্ড</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
                            <Button type="submit" className="w-full">লগইন করুন</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto py-8 px-4">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-gray-800">অ্যাডমিন ড্যাশবোর্ড</h1>
                        <p className="text-muted-foreground">স্বাগতম, অ্যাডমিন</p>
                    </div>
                    <Button variant="outline" onClick={() => {
                        localStorage.removeItem("admin_session")
                        setIsLoggedIn(false)
                    }}>লগআউট</Button>
                </div>

                {/* Quick Stats (Static for now in client component) */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">পণ্য ব্যবস্থাপনা</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">ম্যানেজ করুন</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">অর্ডার</CardTitle>
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">শীঘ্রই আসছে...</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Product Management Component */}
                <ProductManagement />
            </main>
        </div>
    )
}
