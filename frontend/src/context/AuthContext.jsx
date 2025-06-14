import React, { createContext, useState, useEffect } from 'react'
import { getProfile } from '../api/auth'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile()
        setUser(res.data.data)  // Adjust based on your actual API response structure
      } catch (err) {
        setUser(null)
      }
    }
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
