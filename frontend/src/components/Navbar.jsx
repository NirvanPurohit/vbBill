import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { AuthContext } from '../context/AuthContext'

function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const { user, setUser } = useContext(AuthContext)

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
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

        {/* Masters Dropdown with nested Item Master */}
        <div className="relative" onMouseLeave={() => setDropdownOpen(false)}>
          <button
            onMouseEnter={() => setDropdownOpen(true)}
            className="hover:underline focus:outline-none"
          >
            Masters ▾
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-white text-black rounded shadow mt-2 w-48 z-50">
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

              {/* Item Master with nested submenu */}
              <div className="relative group">
                <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                  Item Master ▸
                </button>
                <div className="absolute left-full top-0 bg-white text-black rounded shadow w-40 hidden group-hover:block z-50">
                  <Link
                    to="/masters/item/items"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    View
                  </Link>
                  <Link
                    to="/masters/item/newitem"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Add New
                  </Link>
                </div>
              </div>
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
