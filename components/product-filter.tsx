"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import type { Product } from "@/types"

interface ProductFilterProps {
    products: Product[]
}

const CATEGORY_MAP: Record<string, string> = {
    "borkha": "বোরখা",
    "semi-long-khimar": "সেমি লং খিমার",
    "long-khimar": "লং খিমার",
    "short-hijab": "শর্ট হিজাব",
    "bra": "ব্রা",
    "panty": "পেন্টি",
    "kids": "শিশুদের পণ্য",
    "hijab-set": "হিজাব সেট",
    "abaya": "আবায়া",
}

export function ProductFilter({ products }: ProductFilterProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Extract unique categories from products
    const uniqueCategories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[]

    const [priceRange, setPriceRange] = useState([0, 5000])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])

    useEffect(() => {
        // Sync local state with URL params on mount
        const categoryParam = searchParams.get("category")
        if (categoryParam) {
            setSelectedCategories([categoryParam])
        }
    }, [searchParams])

    const handleCategoryChange = (category: string, checked: boolean) => {
        const newCategories = checked
            ? [...selectedCategories, category]
            : selectedCategories.filter((c) => c !== category)

        setSelectedCategories(newCategories)
        updateUrl(newCategories, priceRange)
    }

    const handlePriceChange = (value: number[]) => {
        setPriceRange(value)
    }

    const applyPriceFilter = () => {
        updateUrl(selectedCategories, priceRange)
    }

    const updateUrl = (categories: string[], price: number[]) => {
        const params = new URLSearchParams()
        if (categories.length > 0) {
            // Simple logic: just take the last one for now as our DB usually filters by single category,
            // or we could support multi-select if the DB/API supported it.
            // For now let's just picking one or comma separating if supported.
            // Based on existing logic, it expects a single category string.
            params.set("category", categories[0])
        }
        // We haven't implemented price filtering in DB yet, but let's put it in URL
        // params.set("minPrice", price[0].toString())
        // params.set("maxPrice", price[1].toString())

        router.push(`/shop?${params.toString()}`)
    }

    const clearFilters = () => {
        setSelectedCategories([])
        setPriceRange([0, 5000])
        router.push("/shop")
    }

    return (
        <div className="space-y-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                <div className="space-y-3">
                    {uniqueCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                                id={category}
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                            />
                            <Label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize cursor-pointer">
                                {CATEGORY_MAP[category] || category}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                <div className="space-y-4">
                    <Slider
                        defaultValue={[0, 5000]}
                        max={5000}
                        step={50}
                        value={priceRange}
                        onValueChange={handlePriceChange}
                        className="my-6"
                    />
                    <div className="flex items-center justify-between text-sm">
                        <span>৳{priceRange[0]}</span>
                        <span>৳{priceRange[1]}</span>
                    </div>
                    {/* <Button size="sm" onClick={applyPriceFilter} className="w-full">Apply Price</Button> */}
                </div>
            </div>

            <Button variant="outline" className="w-full" onClick={clearFilters}>
                Clear Filters
            </Button>
        </div>
    )
}
