import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, getProfile } from '../api/auth'
import { AuthContext } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // get setUser function from AuthContext to update global user state
  const { setUser } = useContext(AuthContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('') // Clear previous errors

    try {
      await login({ email, password })  // Assume this sets cookies (access & refresh token)
      
      // Fetch the profile after login to get user data
      const res = await getProfile()
      setUser(res.data.data)  // Update user in context

      navigate('/')  // redirect to home after successful login
    } catch (error) {
      console.error('Login failed:', error)
      if (error.response && error.response.status === 401) {
        setError('Invalid email or password')
      } else {
        setError('Login failed. Please try again later.')
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to your account
        </h2>

        <span className="block text-sm text-gray-600 text-center mb-4">
          Enter your credentials below
        </span>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Register here
            </a>
          </p>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors mt-2"
          >
            Home
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
