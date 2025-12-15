import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData()
        const file = data.get("file")

        if (!file) {
            return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 })
        }

        const apiKey = process.env.IMGBB_API_KEY
        if (!apiKey) {
             return NextResponse.json({ success: false, message: "IMGBB_API_KEY is missing" }, { status: 500 })
        }

        const formData = new FormData()
        formData.append("image", file)

        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: "POST",
            body: formData,
        })

        const json = await res.json()

        if (!json.success) {
            throw new Error(json.error?.message || "ImgBB upload failed")
        }

        return NextResponse.json({ success: true, url: json.data.url })
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            { success: false, message: "Upload failed: " + (error instanceof Error ? error.message : "Unknown error") },
            { status: 500 }
        )
    }
}
