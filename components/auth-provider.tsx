"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
    type User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, name?: string) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signIn: async () => { },
    signUp: async () => { },
    signInWithGoogle: async () => { },
    signOut: async () => { },
})

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user)
            setLoading(false)

            // Set auth token cookie
            if (user) {
                try {
                    // Force refresh token to ensure it's fresh enough for creating a session cookie
                    const token = await user.getIdToken(true)
                    const res = await fetch("/api/auth/set-cookie", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token }),
                    })
                    if (!res.ok) {
                        console.error("Failed to set session cookie:", await res.text())
                    }
                } catch (error) {
                    console.error("Error setting session cookie:", error)
                }

                // Sync user to database
                await fetch("/api/auth/sync-user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        firebaseUid: user.uid,
                        email: user.email,
                        name: user.displayName,
                    }),
                })
            } else {
                // Clear cookie on sign out
                await fetch("/api/auth/set-cookie", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: null }),
                })
            }
        })

        return () => unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password)
    }

    const signUp = async (email: string, password: string, name?: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        // The sync happens automatically in onAuthStateChanged
    }

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
    }

    const signOut = async () => {
        await firebaseSignOut(auth)
    }

    return <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>{children}</AuthContext.Provider>
}
