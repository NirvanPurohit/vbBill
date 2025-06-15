import React, { useState } from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import { getItemById, updateItem } from '../../api/auth'
import { useEffect } from 'react'
function ItemUpdate() {
  const navigate = useNavigate()
   const { id } = useParams()
   const [formData, setFormData] = useState({
    itemCode: '',
    itemName: '',
    IGST_Rate: '',
    CGST_Rate: '',
    SGST_Rate: ''
  })
   useEffect(() => {
  const fetchItem = async () => {
    try {
      const response = await getItemById(id)
      setFormData({
        itemCode: response.data.data.itemCode,
        itemName: response.data.data.itemName,
        IGST_Rate: response.data.data.IGST_Rate,
        CGST_Rate: response.data.data.CGST_Rate,
        SGST_Rate: response.data.data.SGST_Rate
      })
    } catch (err) {
      setError('Failed to load item')
    }
  }

  fetchItem()
}, [id])



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
      const response = await updateItem(id, formData)
      if (response.status !== 200) {
        setError('Failed to update item')
      }
      setSuccess('Item Updated successfully!')
      setFormData({
        itemCode: '',
        itemName: '',
        IGST_Rate: '',
        CGST_Rate: '',
        SGST_Rate: ''
      })
       navigate('/masters/item/items')
    } catch (err) {
      const message = err?.response?.data?.data?.message  || err?.response?.data?.message ||
        err?.message || 'An error occurred while updating the item'
      setError(message)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
<h1 className="text-2xl font-bold mb-4">Update Item Details</h1>

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
          Update
        </button>
      </form>
    </div>
  )
}

export default ItemUpdate
