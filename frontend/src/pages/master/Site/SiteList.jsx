import React, { useEffect, useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { getAllSites, deleteSite } from '../../../api/auth'
import { useNavigate } from 'react-router-dom'

function SiteList() {
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await getAllSites()
        setSites(response.data.data)
        setError(null)
        setLoading(false)
      } catch (err) {
        setError('Failed to fetch sites')
        setLoading(false)
      }
    }

    fetchSites()
  }, [])

  const handleUpdate = (siteId) => {
    navigate(`/masters/site/update/${siteId}`)
  }

  const handleDelete = async (siteId) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      try {
        await deleteSite(siteId)
        setSites(sites.filter(site => site._id !== siteId))
      } catch (err) {
        setError('Failed to delete site')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-pulse text-gray-500">Loading sites...</div>
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
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">All Sites</h1>
          <p className="text-gray-600 mt-1">{sites.length} sites found</p>
        </div>

        <div className="divide-y divide-gray-200">
          {sites.map((site) => (
            <div key={site._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {site.siteCode}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {site.siteName}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-500 font-medium">Address</div>
                      <div className="text-gray-900">{site.siteAddress}</div>
                      <div className="text-gray-600">{site.city}, {site.state} - {site.pin}</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-gray-500 font-medium">GST Number</div>
                      <div className="text-gray-900 font-mono">{site.gstNum}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-6">
                  <button
                    onClick={() => handleUpdate(site._id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(site._id)}
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

        {sites.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-lg">No sites found</div>
            <p className="text-gray-500 mt-2">Add some sites to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SiteList
