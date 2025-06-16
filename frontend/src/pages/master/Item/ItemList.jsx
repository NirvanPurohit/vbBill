import React, { useEffect } from 'react'
import { Edit, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useItems } from '../../../context/ItemContext'

function ItemList() {
  const {
    items,
    loading,
    error,
    totalPages,
    currentPage,
    fetchItems,
    removeItem
  } = useItems();
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems(1); // Load first page on mount
  }, [fetchItems]);

  const handleUpdate = (itemId) => {
    navigate(`/masters/item/update/${itemId}`);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await removeItem(itemId);
      } catch (err) {
        // Error handling is managed by the context
        console.error('Error deleting item:', err);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    fetchItems(pageNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-pulse text-gray-500">Loading items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
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
            <tr>
              <th className="px-6 py-3 text-left">Item Name</th>
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
                <td className="px-6 py-4">{item.igstRate}%</td>
                <td className="px-6 py-4">{item.cgstRate}%</td>
                <td className="px-6 py-4">{item.sgstRate}%</td>
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

      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ItemList;
