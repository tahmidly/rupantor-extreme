
"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

const categories = [
    {
        name: "বোরখা",
        slug: "borkha",
        image: "https://images.unsplash.com/photo-1568252542512-985c4541302d?q=80&w=1170&auto=format&fit=crop",
        description: "মার্জিত এবং স্টাইলিশ বোরখা কালেকশন",
    },
    {
        name: "সেমি-লং-খিমার",
        slug: "semi-long-khimar",
        image: "https://images.unsplash.com/photo-1583859062366-26792ba26e85?q=80&w=1074&auto=format&fit=crop",
        description: "আরামদায়ক সেমি লং খিমার",
    },
    {
        name: "লং-খিমার",
        slug: "long-khimar",
        image: "https://images.unsplash.com/photo-1628045622415-32115663737b?q=80&w=1080&auto=format&fit=crop",
        description: "পূর্ণাঙ্গ পর্দার জন্য লং খিমার",
    },
    {
        name: "শর্ট-হিজাব",
        slug: "short-hijab",
        image: "https://images.unsplash.com/photo-1605763240000-7e93b172d754?q=80&w=1000&auto=format&fit=crop",
        description: "প্রতিদিনের ব্যবহারের জন্য হিজাব",
    },
    {
        name: "ব্রা",
        slug: "bra",
        image: "https://images.unsplash.com/photo-1698223637841-7defa0224b17?q=80&w=1000&auto=format&fit=crop",
        description: "উন্নত মানের ইনারওয়্যার",
    },
    {
        name: "পেন্টি",
        slug: "panty",
        image: "https://images.unsplash.com/photo-1596483162391-496525fa4900?q=80&w=1000&auto=format&fit=crop",
        description: "সফট এবং কমফোর্টেবল",
    },
    {
        name: "শিশুদের পণ্য",
        slug: "kids",
        image: "https://images.unsplash.com/photo-1621452773781-0f992ee03591?q=80&w=1000&auto=format&fit=crop",
        description: "ছোট সোনামণিদের জন্য",
    },
]

export function CategoryGrid() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-primary font-medium tracking-wider uppercase text-sm">কালেকশন</span>
                    <h2 className="text-4xl font-serif mt-3 mb-4">জনপ্রিয় ক্যাটাগরি</h2>
                    <p className="text-muted-foreground">
                        আপনার পছন্দের পোশাক খুঁজে পেতে আমাদের ক্যাটাগরিগুলো ঘুরে দেখুন।
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/shop?category=${category.slug}`}
                            className="group relative h-[400px] overflow-hidden rounded-xl block"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />

                            <div className="absolute bottom-0 left-0 p-6 text-white w-full transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                                <h3 className="text-2xl font-serif font-medium mb-1">{category.name}</h3>
                                <p className="text-white/80 text-sm mb-4 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                    {category.description}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-medium border-b border-white/50 pb-0.5 w-fit hover:border-white transition-colors">
                                    এখনই কিনুন <ArrowRight className="h-4 w-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
