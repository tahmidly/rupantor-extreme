"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Autoplay, EffectFade } from "swiper/modules"

// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

const images = [
    "/images/h-banner1.webp",
    "/images/h-banner2.webp",
    "/images/h-banner3.webp",
    "/images/h-banner4.webp",
]

export function HeroCarousel() {
    return (
        <section className="bg-muted w-full">
            <div className="container mx-auto px-4 py-4">
                <div className="relative w-full h-[180px] sm:h-[280px] lg:h-[380px] max-h-[400px] overflow-hidden rounded-lg">
                    <Swiper
                        modules={[Pagination, Autoplay, EffectFade]}
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        effect="fade"
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        loop={true}
                        className="w-full h-full"
                    >
                        {images.map((src, index) => (
                            <SwiperSlide key={index} className="relative w-full h-full">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={src}
                                        alt={`Hero Banner ${index + 1}`}
                                        fill
                                        priority={index === 0}
                                        className="object-fill"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            {/* Custom Styles for Swiper Pagination to match theme */}
            <style jsx global>{`
        .swiper-pagination-bullet {
          background-color: #d1d5db !important;
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s;
        }
        .swiper-pagination-bullet-active {
          background-color: #e11d48 !important; /* Rose-600 */
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
        </section>
    )
}
