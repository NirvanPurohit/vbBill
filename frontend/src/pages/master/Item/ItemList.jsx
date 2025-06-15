import React, { useEffect, useState } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { getAllItems, deleteItem } from '../../../api/auth.js'
import { useNavigate } from 'react-router-dom'

function ItemList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  
  useEffect(() => {    const fetchItems = async () => {
      try {
         const response = await getAllItems()
         console.log('Items response:', response)
         console.log('Response data:', response.data)
         if (!response.data || !response.data.data) {
           console.error('Unexpected response structure:', response)
           setError('Unexpected response structure from server')
           setLoading(false)
           return
         }
         setItems(response.data.data)
         setError(null)
         setLoading(false)
      } catch (err) {
        console.error('Error fetching items:', err)
        console.error('Error response:', err.response)
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch items'
        setError(`Error: ${errorMessage}`)
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const handleUpdate = (itemId) => {
    console.log('Update item:', itemId)
    navigate(`/masters/item/update/${itemId}`)
  }

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(itemId)
        setItems(items.filter(item => item._id !== itemId))
      } catch (err) {
        console.error('Error deleting item:', err)
        alert('Failed to delete item')
      }
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Items</h2>
        <div>Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Items</h2>
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Items</h2>
        <button
          onClick={() => navigate('/masters/item/newitem')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New Item
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead className="bg-gray-200">
            <tr>              <th className="px-6 py-3 text-left">Item Name</th>
              <th className="px-6 py-3 text-left">Item Code</th>
              <th className="px-6 py-3 text-left">IGST Rate</th>
              <th className="px-6 py-3 text-left">CGST Rate</th>
              <th className="px-6 py-3 text-left">SGST Rate</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{item.itemName}</td>
                <td className="px-6 py-4">{item.itemCode}</td>
                <td className="px-6 py-4">{item.IGST_Rate}%</td>
                <td className="px-6 py-4">{item.CGST_Rate}%</td>
                <td className="px-6 py-4">{item.SGST_Rate}%</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleUpdate(item._id)}
                    className="text-blue-600 hover:text-blue-800 mr-4"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ItemList