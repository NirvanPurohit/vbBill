import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { AuthContext } from '../context/AuthContext'

function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user, setUser } = useContext(AuthContext)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      navigate('/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const masters = [
    { name: 'Item', toView: '/masters/item/items', toAdd: '/masters/item/newitem' },
    { name: 'Business', toView: '/masters/business/list', toAdd: '/masters/business/new' },
    { name: 'Lorry', toView: '/masters/lorry/list', toAdd: '/masters/lorry/new' },
    { name: 'Site', toView: '/masters/site/list', toAdd: '/masters/site/new' },
    { name: 'Supplier', toView: '/masters/supplier/list', toAdd: '/masters/supplier/new' }
  ]

  const handleDropdownClick = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow flex justify-between items-center">
      {/* Left side */}
      <div className="flex items-center space-x-6" ref={dropdownRef}>
        <Link to="/" className="text-xl font-bold text-white hover:underline">
          VB BILL
        </Link>
        
        {/* Masters Dropdown */}
        <div className="relative">
          <button
            className={`hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none ${
              activeDropdown === 'masters' ? 'bg-blue-700' : ''
            }`}
            onClick={() => handleDropdownClick('masters')}
            aria-expanded={activeDropdown === 'masters'}
            aria-haspopup="true"
          >
            Masters ▾
          </button>

          {activeDropdown === 'masters' && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-md shadow-lg py-2 min-w-[200px] z-50">
              {masters.map((master, idx) => (
                <div 
                  key={idx}
                  className="group relative px-4 py-2 hover:bg-gray-100"
                >
                  <div className="flex justify-between items-center text-gray-700">
                    {master.name} Master
                    <span className="ml-2">▸</span>
                  </div>
                  <div className="invisible group-hover:visible absolute left-full top-0 bg-white rounded-md shadow-lg py-2 min-w-[160px] -mt-2">
                    <Link 
                      to={master.toView}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setActiveDropdown(null)}
                    >
                      View All
                    </Link>
                    <Link 
                      to={master.toAdd}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setActiveDropdown(null)}
                    >
                      Add New
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transactions Dropdown */}
        <div className="relative">
          <button
            className={`hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none ${
              activeDropdown === 'transactions' ? 'bg-blue-700' : ''
            }`}
            onClick={() => handleDropdownClick('transactions')}
            aria-expanded={activeDropdown === 'transactions'}
            aria-haspopup="true"
          >
            Transactions ▾
          </button>

          {activeDropdown === 'transactions' && (
            <div className="absolute left-0 top-full mt-1 bg-white rounded-md shadow-lg py-2 min-w-[160px] z-50">
              <Link
                to="/transactions"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setActiveDropdown(null)}
              >
                View All
              </Link>
              <Link
                to="/transactions/new"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setActiveDropdown(null)}
              >
                Add New
              </Link>
            </div>
          )}
        </div>

        {/* Invoice Dropdown */}
<div className="relative">
  <button
    className={`hover:bg-blue-700 px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none ${
      activeDropdown === 'invoice' ? 'bg-blue-700' : ''
    }`}
    onClick={() => handleDropdownClick('invoice')}
    aria-expanded={activeDropdown === 'invoice'}
    aria-haspopup="true"
  >
    Invoice ▾
  </button>

  {activeDropdown === 'invoice' && (
    <div className="absolute left-0 top-full mt-1 bg-white rounded-md shadow-lg py-2 min-w-[160px] z-50">
      <Link
        to="/invoices"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        onClick={() => setActiveDropdown(null)}
      >
        View All
      </Link>
      <Link
        to="/invoice/"
        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
        onClick={() => setActiveDropdown(null)}
      >
        Add New
      </Link>
    </div>
  )}
</div>

      </div>

      {/* Right side - User menu */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-white">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors duration-200"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
