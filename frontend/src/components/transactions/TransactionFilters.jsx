import React from 'react';
import { useTransactions } from '../../context/TransactionContext';

const TransactionFilters = () => {
  const { filters, setFilters } = useTransactions();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700">From Date</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">To Date</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        {/* Buyer Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Buyer</label>
          <select
            name="buyer"
            value={filters.buyer}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Buyers</option>
            {/* Add buyer options from context */}
          </select>
        </div>

        {/* Site Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Site</label>
          <select
            name="site"
            value={filters.site}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Sites</option>
            {/* Add site options from context */}
          </select>
        </div>

        {/* Item Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Item</label>
          <select
            name="item"
            value={filters.item}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Items</option>
            {/* Add item options from context */}
          </select>
        </div>

        {/* Invoice Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="isInvoiced"
            value={filters.isInvoiced}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="false">Pending</option>
            <option value="true">Invoiced</option>
          </select>
        </div>
      </div>

      {/* Reset Filters Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setFilters({
            page: 1,
            limit: 10,
            buyer: '',
            site: '',
            item: '',
            startDate: '',
            endDate: '',
            isInvoiced: undefined
          })}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default TransactionFilters;
