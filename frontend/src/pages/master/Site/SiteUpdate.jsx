import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSiteById, updateSite } from '../../../api/auth'

function SiteUpdate() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    siteCode: '',
    siteName: '',
    siteAddress: '',
    city: '',
    pin: '',
    state: '',
    gstNum: ''
  })

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const response = await getSiteById(id)
        const site = response.data.data
        setFormData({
          siteCode: site.siteCode,
          siteName: site.siteName,
          siteAddress: site.siteAddress,
          city: site.city,
          pin: site.pin,
          state: site.state,
          gstNum: site.gstNum
        })
      } catch (err) {
        setError('Failed to load site')
      }
    }

    fetchSite()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const response = await updateSite(id, formData)
      if (response.status === 200) {
        setSuccess('Site updated successfully!')
        navigate('/masters/site/list')
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to update site'
      setError(message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Update Site Details</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Site Code</label>
            <input
              type="text"
              name="siteCode"
              value={formData.siteCode}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1 font-medium">Site Address</label>
            <input
              type="text"
              name="siteAddress"
              value={formData.siteAddress}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">PIN Code</label>
            <input
              type="text"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">GST Number</label>
            <input
              type="text"
              name="gstNum"
              value={formData.gstNum}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Site
        </button>
      </form>
    </div>
  )
}

export default SiteUpdate
