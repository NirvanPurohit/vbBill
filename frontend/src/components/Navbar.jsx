// src/components/Navbar.jsx
import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { AuthContext } from '../context/AuthContext'

function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  // Get user and setUser from context
  const { user, setUser } = useContext(AuthContext)

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)  // Clear user in context on logout
      navigate('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow flex justify-between items-center">
      {/* Left side */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-xl font-bold text-white hover:underline">
          Business App
        </Link>

        {/* Masters Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            className="hover:underline focus:outline-none"
          >
            Masters ▾
          </button>
          {isDropdownOpen && (
            <div
              className="absolute bg-white text-black rounded shadow mt-2 w-48 z-50"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                to="/masters/products"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Product Master
              </Link>
              <Link
                to="/masters/customers"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Customer Master
              </Link>
              <Link
                to="/masters/suppliers"
                className="block px-4 py-2 hover:bg-gray-100"
              >
                Supplier Master
              </Link>
            </div>
          )}
        </div>

        <Link to="/daily-transaction" className="hover:underline">
          Daily Transaction
        </Link>
        <Link to="/invoice" className="hover:underline">
          Invoice
        </Link>
        <Link to="/reports" className="hover:underline">
          Reports
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm font-medium text-white">
              Welcome, {user.fullName}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 text-sm"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 text-sm"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
