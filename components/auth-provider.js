"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/user")
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, setUser, loading, checkAuth }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
