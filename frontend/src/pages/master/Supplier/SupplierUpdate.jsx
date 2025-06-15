import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getSupplierById, updateSupplier } from '../../../api/auth'

function SupplierUpdate() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    name: '',
    address: ''
  })

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await getSupplierById(id)
        const supplier = response.data.data
        setFormData({
          name: supplier.name,
          address: supplier.address
        })
      } catch (err) {
        setError('Failed to load supplier')
      }
    }

    fetchSupplier()
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
      const response = await updateSupplier(id, formData)
      if (response.status === 200) {
        setSuccess('Supplier updated successfully!')
        navigate('/masters/supplier/list')
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to update supplier'
      setError(message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Update Supplier Details</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Supplier Name</label>
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
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Supplier
        </button>
      </form>
    </div>
  )
}

export default SupplierUpdate
