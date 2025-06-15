import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createItem } from '../../../api/auth.js'
function ItemNew() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    IGST_Rate: '',
    CGST_Rate: '',
    SGST_Rate: ''
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
      const response = await createItem(formData)
      if (response.status !== 201) {
        throw new Error('Failed to create item')
      }
      setSuccess('Item created successfully!')
      setFormData({
        itemCode: '',
        itemName: '',
        IGST_Rate: '',
        CGST_Rate: '',
        SGST_Rate: ''
      })
      // optionally navigate to item list
      navigate('/masters/item/items')
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to create item'
      setError(message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Item Details</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Item Code</label>
          <input
            type="text"
            name="itemCode"
            value={formData.itemCode}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Item Name</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">IGST Rate (%)</label>
          <input
            type="number"
            step="0.01"
            name="IGST_Rate"
            value={formData.IGST_Rate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">CGST Rate (%)</label>
          <input
            type="number"
            step="0.01"
            name="CGST_Rate"
            value={formData.CGST_Rate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">SGST Rate (%)</label>
          <input
            type="number"
            step="0.01"
            name="SGST_Rate"
            value={formData.SGST_Rate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Create Item
        </button>
      </form>
    </div>
  )
}

export default ItemNew
