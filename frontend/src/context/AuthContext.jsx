import React, { createContext, useState, useEffect, useCallback, useContext } from 'react'
import { getProfile, login as loginApi, logout as logoutApi } from '../api/auth'

export const AuthContext = createContext()

// Add useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const res = await getProfile()
      setUser(res.data.data)
    } catch (err) {
      console.error('Failed to fetch user profile:', err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (credentials) => {
    try {
      const response = await loginApi(credentials)
      if (response.data?.data?.accessToken) {
        // Store token in cookie
        document.cookie = `accessToken=${response.data.data.accessToken}; path=/;`
        await fetchUser() // Fetch user profile after successful login
        return response.data
      }
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutApi()
      // Clear token and user data
      document.cookie = 'accessToken=; Max-Age=0; path=/;'
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const isAuthenticated = !!user && !loading;

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
