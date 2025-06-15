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

        {/* Masters Dropdown */}
        <div className="relative group">
          <button
            className="hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200"
            onMouseEnter={() => setDropdownOpen(true)}
          >
            Masters ▾
          </button>

          {/* Main dropdown menu */}
          {isDropdownOpen && (
            <div
              className="absolute left-0 top-full bg-white rounded-md shadow-lg py-2 min-w-[200px]"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              {/* Item Master */}
              <div className="group/item relative px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <div className="flex justify-between items-center text-gray-700">
                  Item Master
                  <span className="ml-2">▸</span>
                </div>
                <div className="hidden group-hover/item:block absolute left-full top-0 bg-white rounded-md shadow-lg py-2 min-w-[160px] -mt-2">
                  <Link
                    to="/masters/item/items"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    View All
                  </Link>
                  <Link
                    to="/masters/item/newitem"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Add New
                  </Link>
                </div>
              </div>

              {/* Business Master */}
              <div className="group/business relative px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <div className="flex justify-between items-center text-gray-700">
                  Business Master
                  <span className="ml-2">▸</span>
                </div>
                <div className="hidden group-hover/business:block absolute left-full top-0 bg-white rounded-md shadow-lg py-2 min-w-[160px] -mt-2">
                  <Link
                    to="/masters/business/list"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    View All
                  </Link>
                  <Link
                    to="/masters/business/new"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Add New
                  </Link>
                </div>
              </div>

              {/* Lorry Master */}
              <div className="group/lorry relative px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <div className="flex justify-between items-center text-gray-700">
                  Lorry Master
                  <span className="ml-2">▸</span>
                </div>
                <div className="hidden group-hover/lorry:block absolute left-full top-0 bg-white rounded-md shadow-lg py-2 min-w-[160px] -mt-2">
                  <Link
                    to="/masters/lorry/list"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    View All
                  </Link>
                  <Link
                    to="/masters/lorry/new"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Add New
                  </Link>
                </div>
              </div>

              {/* Site Master */}
              <div className="group/site relative px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <div className="flex justify-between items-center text-gray-700">
                  Site Master
                  <span className="ml-2">▸</span>
                </div>
                <div className="hidden group-hover/site:block absolute left-full top-0 bg-white rounded-md shadow-lg py-2 min-w-[160px] -mt-2">
                  <Link
                    to="/masters/site/list"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    View All
                  </Link>
                  <Link
                    to="/masters/site/new"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Add New
                  </Link>
                </div>
              </div>

              {/* Supplier Master */}
              <div className="group/supplier relative px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <div className="flex justify-between items-center text-gray-700">
                  Supplier Master
                  <span className="ml-2">▸</span>
                </div>
                <div className="hidden group-hover/supplier:block absolute left-full top-0 bg-white rounded-md shadow-lg py-2 min-w-[160px] -mt-2">
                  <Link
                    to="/masters/supplier/list"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    View All
                  </Link>
                  <Link
                    to="/masters/supplier/new"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Add New
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <Link to="/daily-transaction" className="hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200">
          Daily Transaction
        </Link>
        <Link to="/invoice" className="hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200">
          Invoice
        </Link>
        <Link to="/reports" className="hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200">
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
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
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
