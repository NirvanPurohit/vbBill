import React from 'react'
import { useAuth } from '../context/AuthContext'

function UserInfo() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.fullName}!</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="font-semibold">Full Name:</label>
          <p>{user.fullName}</p>
        </div>
        <div className="mb-4">
          <label className="font-semibold">Email:</label>
          <p>{user.email}</p>
        </div>
        {/* Add any other user details you want to display */}
      </div>
    </div>
  )
}

export default UserInfo
