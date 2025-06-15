import React, { useEffect, useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { getAllLorries, deleteLorry } from '../../../api/auth'
import { useNavigate } from 'react-router-dom'

function LorryList() {
  const [lorries, setLorries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLorries = async () => {
      try {
        const response = await getAllLorries()
        setLorries(response.data.data)
        setError(null)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch lorries')
        setLoading(false)
      }
    }

    fetchLorries()
  }, [])

  const handleUpdate = (lorryId) => {
    navigate(`/masters/lorry/update/${lorryId}`)
  }

  const handleDelete = async (lorryId) => {
    if (window.confirm('Are you sure you want to delete this lorry?')) {
      try {
        await deleteLorry(lorryId)
        setLorries(lorries.filter(lorry => lorry._id !== lorryId))
      } catch (err) {
        setError('Failed to delete lorry')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-pulse text-gray-500">Loading lorries...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">All Lorries</h1>
          <p className="text-gray-600 mt-1">{lorries.length} lorries found</p>
        </div>

        <div className="divide-y divide-gray-200">
          {lorries.map((lorry) => (
            <div key={lorry._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {lorry.lorryCode}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lorry.lorryNumber}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <button
                    onClick={() => handleUpdate(lorry._id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(lorry._id)}
                    className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {lorries.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-lg">No lorries found</div>
            <p className="text-gray-500 mt-2">Add some lorries to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LorryList
