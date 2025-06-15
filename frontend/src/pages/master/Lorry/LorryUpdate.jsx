import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getLorryById, updateLorry } from '../../../api/auth'

function LorryUpdate() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [formData, setFormData] = useState({
    lorryCode: '',
    lorryNumber: ''
  })

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const fetchLorry = async () => {
      try {
        const response = await getLorryById(id)
        const lorry = response.data.data
        setFormData({
          lorryCode: lorry.lorryCode,
          lorryNumber: lorry.lorryNumber
        })
      } catch (err) {
        setError('Failed to load lorry')
      }
    }

    fetchLorry()
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
      const response = await updateLorry(id, formData)
      if (response.status === 200) {
        setSuccess('Lorry updated successfully!')
        navigate('/masters/lorry/list')
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to update lorry'
      setError(message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Update Lorry Details</h1>

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
          Update Lorry
        </button>
      </form>
    </div>
  )
}

export default LorryUpdate
