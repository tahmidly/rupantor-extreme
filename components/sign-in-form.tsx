"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdLogin } from "react-icons/md"
import { FcGoogle } from "react-icons/fc"

interface SignInFormProps {
    isSignUp: boolean
    onToggleMode: (isSignUp: boolean) => void
}

export function SignInForm({ isSignUp, onToggleMode }: SignInFormProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { signIn, signUp, signInWithGoogle } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            if (isSignUp) {
                await signUp(email, password)
            } else {
                await signIn(email, password)
            }
            router.push("/")
        } catch (err: any) {
            setError(err.message || "Authentication failed")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true)
            await signInWithGoogle()
            router.push("/")
        } catch (err: any) {
            setError(err.message || "Google authentication failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto border-none shadow-2xl bg-white/50 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-serif font-bold text-primary">
                    {isSignUp ? "একাউন্ট খুলুন" : "স্বাগতম"}
                </CardTitle>
                <CardDescription className="text-base">
                    {isSignUp ? "আপনার তথ্য দিয়ে রেজিস্ট্রেশন করুন" : "আপনার একাউন্টে লগইন করুন"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email">ইমেইল</Label>
                        <div className="relative">
                            <MdEmail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                className="pl-10 h-10 bg-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">পাসওয়ার্ড</Label>
                        <div className="relative">
                            <MdLock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 pr-10 h-10 bg-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? (
                                    <MdVisibilityOff className="h-5 w-5" />
                                ) : (
                                    <MdVisibility className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500 font-medium text-center bg-red-50 p-2 rounded">{error}</p>}

                    <Button type="submit" className="w-full h-10 text-base font-medium" disabled={loading}>
                        {loading ? (
                            "অপেক্ষা করুন..."
                        ) : (
                            <span className="flex items-center gap-2">
                                {isSignUp ? "নিবন্ধন করুন" : "লগইন করুন"} <MdLogin className="h-4 w-4" />
                            </span>
                        )}
                    </Button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-muted-foreground/20" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground font-medium bg-white/50">অথবা</span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full h-10 bg-white hover:bg-gray-50 border-gray-200"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <FcGoogle className="mr-2 h-5 w-5" />
                        Google দিয়ে {isSignUp ? "নিবন্ধন" : "লগইন"} করুন
                    </Button>

                    <p className="text-center text-sm text-muted-foreground mt-6">
                        {isSignUp ? "ইতিমধ্যে অ্যাকাউন্ট আছে?" : "কোনো অ্যাকাউন্ট নেই?"}{" "}
                        <button
                            type="button"
                            onClick={() => onToggleMode(!isSignUp)}
                            className="text-primary hover:underline font-medium transition-colors"
                        >
                            {isSignUp ? "লগইন করুন" : "রেজিস্ট্রেশন করুন"}
                        </button>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
