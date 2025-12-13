import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Bengali, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"

const notoSansBengali = Noto_Sans_Bengali({
    subsets: ["bengali", "latin"],
    variable: "--font-bengali",
})
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "রূপান্তর | Rupantor Hijab Store",
    description: "বাংলাদেশের সেরা হিজাব কালেকশন - Quality hijabs for Bangladeshi women",
    generator: "v0.app",
    icons: {
        icon: [
            {
                url: "/icon-light-32x32.png",
                media: "(prefers-color-scheme: light)",
            },
            {
                url: "/icon-dark-32x32.png",
                media: "(prefers-color-scheme: dark)",
            },
            {
                url: "/icon.svg",
                type: "image/svg+xml",
            },
        ],
        apple: "/apple-icon.png",
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="bn">
            <body className={`${notoSansBengali.variable} font-sans antialiased`}>
                <AuthProvider>{children}</AuthProvider>
                <Analytics />
            </body>
        </html>
    )
}
