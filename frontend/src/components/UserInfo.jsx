import React, { useEffect, useState, useContext } from 'react'
import { getProfile } from '../api/auth'
import { AuthContext } from '../context/AuthContext'

function UserInfo() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, setUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getProfile()
        console.log('UserInfo response:', response)
        setUser(response.data.data)
        setError(null)
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
  }, [setUser])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!user) {
    return <div className="p-4">Please login to see your details</div>
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">User Information</h2>
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-4">
          <label className="font-semibold">Full Name:</label>
          <p>{user.fullName}</p>
        </div>
        <div className="mb-4">
          <label className="font-semibold">Email:</label>
          <p>{user.email}</p>
        </div>
        {/* Add any other user fields you want to display */}
      </div>
    </div>
  )
}

export default UserInfo
