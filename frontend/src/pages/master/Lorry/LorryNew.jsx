import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createLorry } from '../../../api/auth'

function LorryNew() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    lorryCode: '',
    lorryNumber: ''
  })

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      const response = await createLorry(formData)
      if (response.status === 201) {
        setSuccess('Lorry created successfully!')
        navigate('/masters/lorry/list')
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to create lorry'
      setError(message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Add Lorry Details</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Lorry Code</label>
          <input
            type="text"
            name="lorryCode"
            value={formData.lorryCode}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Lorry Number</label>
          <input
            type="text"
            name="lorryNumber"
            value={formData.lorryNumber}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Create Lorry
        </button>
      </form>
    </div>
  )
}

export default LorryNew
