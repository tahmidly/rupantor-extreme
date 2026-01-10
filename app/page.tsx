import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Star, Truck, ShieldCheck, RefreshCw } from "lucide-react"
import { HeroCarousel } from "@/components/hero-carousel"
import { CategoryCarousel } from "@/components/category-carousel"
import { TestimonialsSection } from "@/components/testimonials-section"
import { SalatKhimarSpotlight } from "@/components/salat-khimar-spotlight"

export default async function HomePage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string }>
}) {
    const params = await searchParams
    const products = await getProducts(params.search, params.category)

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-rose-100">
            <Header />

            <main>
                {/* Hero Section - Full Width, Immersive */}
                <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center bg-stone-100">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="Elegant Hijab Collection"
                            className="w-full h-full object-cover opacity-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" /> {/* Dark Minimalist Gradient Overlay */}
                    </div>

                    <div className="relative z-10 text-center text-white space-y-6 max-w-3xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <span className="uppercase tracking-[0.2em] text-sm font-medium">নতুন কালেকশন ২০২6</span>
                        <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight">শালীনতায় আভিজাত্য</h1>
                        <p className="text-lg md:text-xl font-light text-white/90 max-w-xl mx-auto">
                            আধুনিক নারীদের জন্য আমাদের প্রিমিয়াম হিজাব এবং আবায়া কালেকশন।
                        </p>
                        <div className="pt-4 space-x-4">
                            <Button asChild size="lg" className="rounded-full px-8 bg-white text-black hover:bg-white/90 hover:scale-105 transition-all duration-300">
                                <Link href="/shop">নতুন কালেকশন দেখুন</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-white text-black hover:bg-white hover:text-black hover:scale-105 transition-all duration-300 backdrop-blur-sm">
                                <Link href="/shop">সকল পণ্য</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Banner - Minimal */}
                <section className="py-12 border-b border-border/40 bg-white/50 backdrop-blur-sm">
                    <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border/40 text-muted-foreground">
                        <div className="flex flex-col items-center gap-2 p-4 transition-transform hover:-translate-y-1 duration-300">
                            <Truck className="h-6 w-6 mb-2 text-primary" />
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">ফ্রি শিপিং</h3>
                            <p className="text-xs">২০০০ টাকার বেশি অর্ডারে</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 transition-transform hover:-translate-y-1 duration-300">
                            <ShieldCheck className="h-6 w-6 mb-2 text-primary" />
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">নিরাপদ পেমেন্ট</h3>
                            <p className="text-xs">১০০% নিরাপদ চেকআউট</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 transition-transform hover:-translate-y-1 duration-300">
                            <RefreshCw className="h-6 w-6 mb-2 text-primary" />
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">সহজ রিটার্ন</h3>
                            <p className="text-xs">৭ দিনের সহজ রিটার্ন পলিসি</p>
                        </div>
                    </div>
                </section>

                {/* Category Carousel Section */}
                <CategoryCarousel />

                {/* Featured Products - New Arrivals */}
                <section className="py-24 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="text-primary font-medium tracking-wider uppercase text-sm">নতুন এসেছে</span>
                            <h2 className="text-4xl font-serif mt-3 mb-4">ট্রেন্ডিং কালেকশন</h2>
                            <p className="text-muted-foreground">আমাদের কালেকশনের নতুন সব সংযোজন দেখুন। আধুনিক শালীনতার সাথে মার্জিত ডিজাইন।</p>
                        </div>

                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                                {products.slice(0, 8).map((product: any) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-xl text-muted-foreground">কোনো পণ্য পাওয়া যায়নি।</p>
                            </div>
                        )}

                        <div className="mt-16 text-center">
                            <Button asChild variant="outline" size="lg" className="px-10 rounded-full border-foreground hover:bg-foreground hover:text-background transition-all duration-300 group">
                                <Link href="/shop">
                                    আরও পণ্য দেখুন <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Salat Khimar Spotlight */}
                <SalatKhimarSpotlight />

                {/* Testimonials Section */}
                {/* <TestimonialsSection /> */}

                {/* Call to Action Section */}
                <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h2 className="text-4xl md:text-5xl font-serif mb-6">আপনার স্টাইলকে নতুন রূপ দিন</h2>
                        <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                            আমাদের এক্সক্লুসিভ হিজাব এবং আবায়া কালেকশন এর সাথে নিজেকে সাজান নতুন সাজে।
                            আজই অর্ডার করুন এবং উপভোগ করুন বিশেষ ছাড়।
                        </p>
                        <Button asChild size="lg" variant="secondary" className="px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                            <Link href="/shop">শপ ভিজিট করুন</Link>
                        </Button>
                    </div>
                </section>

                {/* Minimal Footer */}
                <footer className="bg-background border-t py-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-serif font-bold tracking-tight">রূপান্তর</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    শালীনতায় আভিজাত্য। আমরা আপনার জন্য নিয়ে এসেছি হিজাব এবং আবায়ার সেরা কালেকশন।
                                    কোয়ালিটি এবং কমফোর্ট আমাদের অগ্রাধিকার।
                                </p>
                            </div>

                            <div>
                                <h4 className="font-medium mb-6 uppercase text-xs tracking-widest text-foreground/80">শপ</h4>
                                <ul className="space-y-4 text-sm text-muted-foreground">
                                    <li><Link href="/shop" className="hover:text-primary transition-colors block">সকল পণ্য</Link></li>
                                    <li><Link href="/shop?category=Hijab" className="hover:text-primary transition-colors block">হিজাব</Link></li>
                                    <li><Link href="/shop?category=Abayas" className="hover:text-primary transition-colors block">আবায়া</Link></li>
                                    <li><Link href="/shop" className="text-rose-500 hover:text-rose-600 transition-colors font-medium block">সেল ও অফার</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium mb-6 uppercase text-xs tracking-widest text-foreground/80">সাপোর্ট</h4>
                                <ul className="space-y-4 text-sm text-muted-foreground">
                                    <li><Link href="#" className="hover:text-primary transition-colors block">যোগাযোগ করুন</Link></li>
                                    <li><Link href="#" className="hover:text-primary transition-colors block">শিপিং পলিসি</Link></li>
                                    <li><Link href="#" className="hover:text-primary transition-colors block">রিটার্ন এবং এক্সচেঞ্জ</Link></li>
                                    <li><Link href="#" className="hover:text-primary transition-colors block">প্রশ্নাবলী (FAQs)</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-medium mb-6 uppercase text-xs tracking-widest text-foreground/80">নিউজলেটার</h4>
                                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                    আমাদের নতুন কালেকশন এবং অফার সম্পর্কে জানতে সাবস্ক্রাইব করুন। কোনো স্প্যাম নয়।
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="আপনার ইমেইল"
                                        className="bg-muted/50 border border-border px-4 py-2 rounded-l-lg text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                                    />
                                    <Button size="sm" className="rounded-r-lg px-6">সাবস্ক্রাইব</Button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-muted-foreground">
                            <p>স্বত্ব © ২০২৬ রূপান্তর। সর্বস্বত্ব সংরক্ষিত।</p>
                            <div className="flex gap-8">
                                <Link href="#" className="hover:text-foreground transition-colors">গোপনীয়তা নীতি</Link>
                                <Link href="#" className="hover:text-foreground transition-colors">শর্তাবলী</Link>
                                <Link href="#" className="hover:text-foreground transition-colors">কুকি পলিসি</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    )
}
