"use client"

import { useState } from "react"
import { SignInForm } from "@/components/sign-in-form"
import { cn } from "@/lib/utils"

export default function SignInPage() {
    const [isSignUp, setIsSignUp] = useState(false)

    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            {/* Form Side */}
            <div className={cn(
                "flex items-center justify-center min-h-screen lg:min-h-0 py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-rose-50/80 to-purple-50/80 lg:bg-none lg:bg-background",
                isSignUp ? "lg:order-last" : ""
            )}>
                <SignInForm isSignUp={isSignUp} onToggleMode={setIsSignUp} />
            </div>

            {/* Image Side */}
            <div className={cn(
                "hidden lg:block relative h-full w-full bg-muted",
                isSignUp ? "lg:order-first" : ""
            )}>
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Login Background"
                        className="h-full w-full object-cover grayscale-[20%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                </div>
                <div className="relative z-20 flex h-full flex-col justify-end p-10 text-white">
                    <blockquote className="space-y-2">
                        <p className="text-lg font-serif italic">
                            "শালীনতাই আভিজাত্যের প্রতীক। আমাদের সাথে আপনার যাত্রা সুন্দর হোক।"
                        </p>
                        <footer className="text-sm font-medium text-white/80">— রূপান্তর টীম</footer>
                    </blockquote>
                </div>
            </div>
        </div>
    )
}
