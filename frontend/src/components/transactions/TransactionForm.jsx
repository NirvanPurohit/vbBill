import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useMasterData } from '../../context/MasterDataProvider';

const TransactionForm = ({ initialData = null }) => {
  const navigate = useNavigate();
  const { createTransaction, updateTransaction } = useTransactions();
  const {
    lorries = [],
    buyers = [],
    sites = [],
    items = [],
    loading: masterDataLoading,
    error: masterDataError
  } = useMasterData();

  const today = new Date().toISOString().slice(0, 10);

  // Helper function to map initial data correctly
  const mapInitialData = (data) => {
    if (!data) return null;
    
    return {
      transactionDate: data.transactionDate?.slice(0, 10) || today,
      challanNumber: data.challanNumber || '',
      lorry: data.lorry?._id || data.lorryId || data.lorry || '',
      lorryCode: data.lorryCode || '',
      buyer: data.buyer?._id || data.buyerId || data.buyer || '',
      site: data.site?._id || data.siteId || data.site || '',
      item: data.item?._id || data.itemId || data.item || '',
      purchaseRate: data.purchaseRate || '',
      saleRate: data.saleRate || '',
      quantity: data.quantity || '',
      remarks: data.remarks || ''
    };
  };

  const [formData, setFormData] = useState(() => {
    const mapped = mapInitialData(initialData);
    return mapped || {
      transactionDate: today,
      challanNumber: '',
      lorry: '',
      lorryCode: '',
      buyer: '',
      site: '',
      item: '',
      purchaseRate: '',
      saleRate: '',
      quantity: '',
      remarks: ''
    };
  });

  const [loading, setLoading] = useState(false);

  // Re-map initial data when master data is loaded
  useEffect(() => {
    if (initialData && lorries.length && buyers.length && sites.length && items.length) {
      const mapped = mapInitialData(initialData);
      if (mapped) {
        setFormData(mapped);
      }
    }
  }, [initialData, lorries.length, buyers.length, sites.length, items.length]);

  useEffect(() => {
    if (formData.lorry && !formData.lorryCode) {
      const selectedLorry = lorries.find(l => l._id === formData.lorry);
      const code = selectedLorry?.registrationNumber || selectedLorry?.lorryCode || selectedLorry?.name || '';
      if (code) {
        setFormData(prev => ({ ...prev, lorryCode: code }));
      }
    }
  }, [formData.lorry, lorries]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'lorry') {
      const selectedLorry = lorries.find(l => l._id === value);
      const registrationNumber = selectedLorry?.registrationNumber || selectedLorry?.lorryCode || selectedLorry?.name || '';
      setFormData(prev => ({
        ...prev,
        lorry: value,
        lorryCode: registrationNumber
      }));
    } else if (name === 'buyer') {
      // When buyer changes, reset the site if it doesn't belong to the selected buyer
      const selectedBuyer = buyers.find(b => b._id === value);
      const buyerSites = sites.filter(s => s.buyer === value);
      
      setFormData(prev => ({
        ...prev,
        buyer: value,
        site: buyerSites.some(s => s._id === prev.site) ? prev.site : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      if (initialData) {
        await updateTransaction(initialData._id, formData);
      } else {
        await createTransaction(formData);
      }
      toast.success(`Transaction ${initialData ? 'updated' : 'created'} successfully`);
      navigate('/transactions');
    } catch (error) {
      console.error('Error creating/updating transaction:', error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (masterDataLoading.buyers || masterDataLoading.sites || masterDataLoading.items || masterDataLoading.lorries) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading master data...</div>
      </div>
    );
  }

  if (masterDataError.buyers || masterDataError.sites || masterDataError.items || masterDataError.lorries) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500">Error loading master data. Please try again.</div>
      </div>
    );
  }

  // Get filtered sites based on selected buyer
  const getFilteredSites = () => {
    // If no buyer is selected, show all sites
    if (!formData.buyer) {
      return sites;
    }
    
    // Check if sites have buyer property, if not show all sites
    const hasAnyBuyerProperty = sites.some(site => site.buyer !== undefined);
    if (!hasAnyBuyerProperty) {
      console.log("Sites don't have buyer property, showing all sites");
      return sites;
    }
    
    // Filter sites by buyer
    return sites.filter(site => site.buyer === formData.buyer);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Transaction Date
          </label>
          <input
            type="date"
            name="transactionDate"
            value={formData.transactionDate}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Challan Number
          </label>
          <input
            type="text"
            name="challanNumber"
            value={formData.challanNumber}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Buyer
          </label>
          <select
            name="buyer"
            value={formData.buyer}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Buyer</option>
            {buyers.map((buyer) => (
              <option key={buyer._id} value={buyer._id}>
                {buyer.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Site
          </label>
          <select 
            name="site" 
            value={formData.site || ''} 
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Site</option>
            {(() => {
              console.log("All sites:", sites);
              console.log("Selected buyer:", formData.buyer);
              const filteredSites = getFilteredSites();
              console.log("Filtered sites:", filteredSites);
              
              return filteredSites.map((site) => {
                console.log("Rendering site:", site.siteName, "ID:", site._id);
                return (
                  <option key={site._id} value={site._id}>
                    {site.siteName}
                  </option>
                );
              });
            })()}
          </select>
        </div>

        {/* Lorry Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lorry
          </label>
          <select
            name="lorry"
            value={formData.lorry}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Lorry</option>
            {lorries.map((lorry, index) => {
              const displayName = lorry.name || lorry.lorryName || lorry.vehicleName || lorry.number || `Lorry ${index + 1}`;
              return (
                <option key={lorry._id} value={lorry._id}>
                  {displayName}
                </option>
              );
            })}
          </select>
        </div>

        {/* Lorry Code (auto-filled, read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lorry Code (Auto-filled)
          </label>
          <input
            type="text"
            name="lorryCode"
            value={formData.lorryCode}
            disabled
            className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* Item Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Item
          </label>
          <select
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Item</option>
            {items.map((item, index) => {
              const displayName = item.name || item.itemName || item.title || `Item ${index + 1}`;
              return (
                <option key={item._id} value={item._id}>
                  {displayName}
                </option>
              );
            })}
          </select>
        </div>

        {/* Purchase Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Purchase Rate
          </label>
          <input
            type="number"
            name="purchaseRate"
            value={formData.purchaseRate}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Sale Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sale Rate
          </label>
          <input
            type="number"
            name="saleRate"
            value={formData.saleRate}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Remarks */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Remarks
          </label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/transactions')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;