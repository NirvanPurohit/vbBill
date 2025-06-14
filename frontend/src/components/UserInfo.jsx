import React, { useEffect, useState } from 'react'
import { getProfile } from '../api/auth'

function UserInfo() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getProfile()
        console.log('UserInfo response:', response)
        setUser(response.data.data) // Assuming backend sends { data: userObject }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError('Please login to see your details')
        } else {
          setError('Failed to load user info')
        }
        console.error('UserInfo error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) return <p className="text-center mt-8">Loading user details...</p>
  if (error) return <p className="text-center mt-8 text-red-600">{error}</p>
  if (!user) return null

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Your Details</h2>
      <ul className="text-gray-700 space-y-2">
        <li><strong>Username:</strong> {user.username}</li>
        <li><strong>Full Name:</strong> {user.fullName}</li>
        <li><strong>Email:</strong> {user.email}</li>
        <li><strong>Mobile:</strong> {user.mobile}</li>
        <li><strong>Address:</strong> {user.address}</li>
        <li><strong>Pin Code:</strong> {user.pinCode}</li>
        <li><strong>Company Name:</strong> {user.companyName}</li>
        <li><strong>Company GST:</strong> {user.companyGst}</li>
      </ul>
    </div>
  )
}

export default UserInfo
