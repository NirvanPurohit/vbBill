import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBusinessById, updateBusiness } from '../../../api/auth'

function BusinessUpdate() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    city: '',
    pin: '',
    state: '',
    gstNum: '',
    type: '',
    panAadhar: ''
  })

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getBusinessById(id)
        const business = response.data.data
        setFormData({
          code: business.code,
          name: business.name,
          address: business.address,
          city: business.city,
          pin: business.pin,
          state: business.state,
          gstNum: business.gstNum,
          type: business.type,
          panAadhar: business.panAadhar
        })
      } catch (err) {
        setError('Failed to load business')
      }
    }

    fetchBusiness()
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
      const response = await updateBusiness(id, formData)
      if (response.status === 200) {
        setSuccess('Business updated successfully!')
        navigate('/masters/business/list')
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to update business'
      setError(message)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Update Business Details</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Business Code</label>
            <input
              type="number"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Business Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
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

          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
              <option value="Service Provider">Service Provider</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">PAN/Aadhar</label>
            <input
              type="text"
              name="panAadhar"
              value={formData.panAadhar}
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
          Update Business
        </button>
      </form>
    </div>
  )
}

export default BusinessUpdate
