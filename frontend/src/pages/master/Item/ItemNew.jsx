import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createItem } from '../../../api/auth.js'
import { toast } from 'react-hot-toast'

function ItemNew() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    IGST_Rate: '0',
    CGST_Rate: '0',
    SGST_Rate: '0'
  })

  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    // For tax rates, ensure the value is a valid number and not negative
    if (name.includes('Rate')) {
      const numValue = parseFloat(value)
      if (numValue < 0) return // Don't allow negative values
    }
    setFormData({ ...formData, [name]: value })
  }

  const validateTaxRates = () => {
    const taxRates = {
      IGST_Rate: parseFloat(formData.IGST_Rate),
      CGST_Rate: parseFloat(formData.CGST_Rate),
      SGST_Rate: parseFloat(formData.SGST_Rate)
    }
    return !Object.values(taxRates).some(rate => isNaN(rate))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!validateTaxRates()) {
      setError('All tax rates must be valid numbers')
      return
    }

    try {
      const taxRates = {
        IGST_Rate: parseFloat(formData.IGST_Rate),
        CGST_Rate: parseFloat(formData.CGST_Rate),
        SGST_Rate: parseFloat(formData.SGST_Rate)
      }

      const response = await createItem({
        ...formData,
        ...taxRates
      })

      if (response.status === 201) {
        toast.success('Item created successfully!')
        navigate('/masters/item/items')
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Failed to create item'
      setError(message)
      toast.error(message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Add Item Details</h1>

      {error && <p className="text-red-600 mb-4 p-2 bg-red-50 rounded">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Item Code</label>
          <input
            type="text"
            name="itemCode"
            value={formData.itemCode}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter item code"
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
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter item name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">IGST Rate (%)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            name="IGST_Rate"
            value={formData.IGST_Rate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter IGST rate"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">CGST Rate (%)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            name="CGST_Rate"
            value={formData.CGST_Rate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter CGST rate"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">SGST Rate (%)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            name="SGST_Rate"
            value={formData.SGST_Rate}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter SGST rate"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        >
          Create Item
        </button>
      </form>
    </div>
  )
}

export default ItemNew
