"use client"

import { useState } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Thumbs, FreeMode } from "swiper/modules"
import type { Swiper as SwiperType } from "swiper"

// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/thumbs"
import "swiper/css/free-mode"

interface ProductGalleryProps {
    images: string[]
    productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null)

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square w-full bg-muted flex items-center justify-center rounded-lg">
                <p className="text-muted-foreground">No images available</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Main Slider */}
            <Swiper
                style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                } as React.CSSProperties}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="aspect-square md:aspect-[4/5] w-full rounded-lg overflow-hidden bg-muted group"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index} className="relative w-full h-full">
                        <Image
                            src={image}
                            alt={`${productName} - Image ${index + 1}`}
                            fill
                            className="object-contain"
                            priority={index === 0}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnails */}
            {images.length > 1 && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="thumbnail-swiper h-24 w-full"
                >
                    {images.map((image, index) => (
                        <SwiperSlide key={index} className="cursor-pointer rounded-md overflow-hidden border-2 border-transparent transition-colors opacity-60 [.swiper-slide-thumb-active&]:opacity-100 [.swiper-slide-thumb-active&]:border-primary">
                            <div className="relative w-full h-full">
                                <Image
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="100px"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    )
}
