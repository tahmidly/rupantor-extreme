import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getUserOrders } from "@/lib/db"
import { UserOrdersView } from "./user-orders-view"
import { OrderWithItems } from "@/types"

export default async function UserOrdersPage() {
    let user
    try {
        user = await getCurrentUser()
    } catch {
        redirect("/sign-in")
    }

    if (!user) {
        redirect("/sign-in")
    }

    // Get user's orders
    const { getUserByFirebaseUid } = await import("@/lib/db")
    const dbUser = await getUserByFirebaseUid(user.uid)

    if (!dbUser) {
        redirect("/sign-in")
    }

    const orders = await getUserOrders(dbUser.id) as any as OrderWithItems[]

    return <UserOrdersView orders={orders} />
}
