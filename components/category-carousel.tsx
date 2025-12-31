
"use client"

import Link from "next/link"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation } from "swiper/modules"
import { ArrowRight } from "lucide-react"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"

const categories = [
    {
        name: "বোরখা",
        slug: "borkha",
        image: "https://static-01.daraz.com.bd/p/c5d1f52514a6a526b5ae48b807104cc9.jpg",
        description: "মার্জিত এবং স্টাইলিশ বোরখা",
    },
    {
        name: "সেমি-লং-খিমার",
        slug: "semi-long-khimar",
        image: "https://layaanabd.com/wp-content/uploads/2025/02/Semi-Long-Khimar-for-instant-ready-outdoor-going.-S.L1.png",
        description: "আরামদায়ক সেমি লং খিমার",
    },
    {
        name: "লং-খিমার",
        slug: "long-khimar",
        image: "https://tawfikmart.com/frd-data/img/product/2025/02/_107_frd_1739813924.jpg",
        description: "পূর্ণাঙ্গ পর্দার জন্য",
    },
    {
        name: "শর্ট-হিজাব",
        slug: "short-hijab",
        image: "https://m.media-amazon.com/images/I/41aguPgewtL._AC_SY1000_.jpg",
        description: "প্রতিদিনের ব্যবহারের জন্য",
    },
    {
        name: "ব্রা",
        slug: "bra",
        image: "https://static-01.daraz.com.bd/p/7b154d6da21a1dc5bc84bc1887292089.jpg",
        description: "উন্নত মানের ইনারওয়্যার",
    },
    {
        name: "পেন্টি",
        slug: "panty",
        image: "https://static-01.daraz.com.bd/p/b0b47d6d4c13ff5386b3b3baf6d2235e.jpg",
        description: "সফট এবং কমফোর্টেবল",
    },
    {
        name: "শিশুদের পণ্য",
        slug: "kids",
        image: "https://images.meesho.com/images/products/402301582/w3v2a_512.webp?width=512",
        description: "ছোট সোনামণিদের জন্য",
    },
]

export function CategoryCarousel() {
    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <span className="text-primary font-medium tracking-wider uppercase text-sm">কালেকশন</span>
                        <h2 className="text-3xl font-serif mt-1">জনপ্রিয় ক্যাটাগরি</h2>
                    </div>
                    <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1 group">
                        সব দেখুন <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative">
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={16}
                        slidesPerView={2}
                        navigation={true}
                        autoplay={{
                            delay: 4000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                            },
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                        }}
                        className="w-full pb-12"
                    >
                        {categories.map((category) => (
                            <SwiperSlide key={category.slug} className="h-auto px-1">
                                <Link
                                    href={`/shop?category=${category.slug}`}
                                    className="group relative h-[420px] overflow-hidden rounded-xl block w-full shadow-sm hover:shadow-lg transition-all duration-300"
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
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Custom Navigation Styles */}
                    <style jsx global>{`
                        .swiper-button-next,
                        .swiper-button-prev {
                            background-color: white;
                            width: 44px;
                            height: 44px;
                            border-radius: 50%;
                            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                            color: #111;
                            transition: all 0.3s;
                            opacity: 0.7;
                        }
                        .relative:hover .swiper-button-next,
                        .relative:hover .swiper-button-prev {
                            opacity: 1;
                        }
                        .swiper-button-next:hover,
                        .swiper-button-prev:hover {
                            background-color: var(--primary);
                            color: white;
                            transform: scale(1.1);
                        }
                        .swiper-button-next:after,
                        .swiper-button-prev:after {
                            font-size: 18px;
                            font-weight: bold;
                        }
                        .swiper-wrapper {
                            align-items: stretch;
                        }
                        .swiper-slide {
                            height: auto;
                            display: flex;
                        }
                    `}</style>
                </div>
            </div>
        </section>
    )
}
