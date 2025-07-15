import React, { useState, useContext, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../api/auth'
import { AuthContext } from '../context/AuthContext'

function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user, setUser } = useContext(AuthContext)

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

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

  const reports = [
    { name: 'Export Invoices (Excel)', to: '/reports/export-invoices' },
    // Add more report/export options here
  ];

  const handleDropdownClick = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown)
  }

  return (
    <nav className="bg-blue-600 dark:bg-gray-900 text-white dark:text-gray-100 px-6 py-4 shadow flex justify-between items-center">
      {/* Left side */}
      <div className="flex items-center space-x-6" ref={dropdownRef}>
        <Link to="/" className="text-xl font-bold text-white hover:underline">
          VB BILL
        </Link>
        
        {/* Dashboard Button */}
        <Link
          to="/dashboard"
          className="hover:bg-blue-700 dark:hover:bg-gray-800 px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none"
        >
          Dashboard
        </Link>
        
        {/* Masters Dropdown */}
        <div className="relative">
          <button
            className={`hover:bg-blue-700 dark:hover:bg-gray-800 px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none ${
              activeDropdown === 'masters' ? 'bg-blue-700 dark:bg-gray-800' : ''
            }`}
            onClick={() => handleDropdownClick('masters')}
            aria-expanded={activeDropdown === 'masters'}
            aria-haspopup="true"
          >
            Masters ▾
          </button>

          {activeDropdown === 'masters' && (
            <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 min-w-[200px] z-50">
              {masters.map((master, idx) => (
                <div 
                  key={idx}
                  className="group relative px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="flex justify-between items-center text-gray-700 dark:text-gray-100">
                    {master.name} Master
                    <span className="ml-2">▸</span>
                  </div>
                  <div className="invisible group-hover:visible absolute left-full top-0 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 min-w-[160px] -mt-2">
                    <Link 
                      to={master.toView}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setActiveDropdown(null)}
                    >
                      View All
                    </Link>
                    <Link 
                      to={master.toAdd}
                      className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
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

        {/* Reports Dropdown */}
        <div className="relative">
          <button
            className={`hover:bg-blue-700 dark:hover:bg-gray-800 px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none ${
              activeDropdown === 'reports' ? 'bg-blue-700 dark:bg-gray-800' : ''
            }`}
            onClick={() => handleDropdownClick('reports')}
            aria-expanded={activeDropdown === 'reports'}
            aria-haspopup="true"
          >
            Reports ▾
          </button>
          {activeDropdown === 'reports' && (
            <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 min-w-[200px] z-50">
              {reports.map((report, idx) => (
                <Link
                  key={idx}
                  to={report.to}
                  className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setActiveDropdown(null)}
                >
                  {report.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Transactions Dropdown */}
        <div className="relative">
          <button
            className={`hover:bg-blue-700 dark:hover:bg-gray-800 px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none ${
              activeDropdown === 'transactions' ? 'bg-blue-700 dark:bg-gray-800' : ''
            }`}
            onClick={() => handleDropdownClick('transactions')}
            aria-expanded={activeDropdown === 'transactions'}
            aria-haspopup="true"
          >
            Transactions ▾
          </button>

          {activeDropdown === 'transactions' && (
            <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 min-w-[160px] z-50">
              <Link
                to="/transactions"
                className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setActiveDropdown(null)}
              >
                View All
              </Link>
              <Link
                to="/transactions/new"
                className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
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
            className={`hover:bg-blue-700 dark:hover:bg-gray-800 px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none ${
              activeDropdown === 'invoice' ? 'bg-blue-700 dark:bg-gray-800' : ''
            }`}
            onClick={() => handleDropdownClick('invoice')}
            aria-expanded={activeDropdown === 'invoice'}
            aria-haspopup="true"
          >
            Invoice ▾
          </button>

          {activeDropdown === 'invoice' && (
            <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 min-w-[160px] z-50">
              <Link
                to="/invoices"
                className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setActiveDropdown(null)}
              >
                View All
              </Link>
              <Link
                to="/invoice/"
                className="block px-4 py-2 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setActiveDropdown(null)}
              >
                Add New
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Right side - User menu and dark mode toggle */}
      <div className="flex items-center space-x-4">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="focus:outline-none text-xl bg-blue-700 dark:bg-gray-800 hover:bg-blue-800 dark:hover:bg-gray-700 px-3 py-2 rounded-md transition-colors duration-200"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
        {user ? (
          <>
            <span className="text-white dark:text-gray-100">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-blue-700 dark:bg-gray-800 hover:bg-blue-800 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-blue-700 dark:bg-gray-800 hover:bg-blue-800 dark:hover:bg-gray-700 px-4 py-2 rounded-md transition-colors duration-200"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
