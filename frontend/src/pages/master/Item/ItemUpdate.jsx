import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useItems } from '../../../context/ItemContext'

function ItemUpdate() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { getItem, modifyItem, loading, error: contextError } = useItems()
  
  const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    IGST_Rate: '',
    CGST_Rate: '',
    SGST_Rate: ''
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const loadItem = async () => {
      try {
        const item = await getItem(id)
        if (item) {
          setFormData({
            itemCode: item.itemCode,
            itemName: item.itemName,
            IGST_Rate: item.IGST_Rate,
            CGST_Rate: item.CGST_Rate,
            SGST_Rate: item.SGST_Rate
          })
        }
      } catch (err) {
        setError('Failed to load item')
      }
    }

    loadItem()
  }, [id, getItem])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await modifyItem(id, formData)
      setSuccess('Item Updated successfully!')
      navigate('/masters/item/items')
    } catch (err) {
      setError(err.message || 'Failed to update item')
    }
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <div className="animate-pulse text-gray-500">Loading item details...</div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Update Item Details</h1>

      {(error || contextError) && (
        <p className="text-red-600 mb-2">{error || contextError}</p>
      )}
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
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  )
}

export default ItemUpdate
