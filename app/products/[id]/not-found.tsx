import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-rose-50/20">
      <Header />
      <main className="container py-16">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-4">পণ্য পাওয়া যায়নি</h1>
          <p className="text-muted-foreground mb-6">দুঃখিত, আপনি যে পণ্যটি খুঁজছেন তা পাওয়া যায়নি।</p>
          <Button asChild>
            <Link href="/">হোম পেজে ফিরে যান</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
