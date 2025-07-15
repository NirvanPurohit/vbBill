import React, { useState } from 'react';
import { useInvoices } from '../../context/InvoiceContext';
import { format } from 'date-fns';

const ExportInvoices = () => {
  const { invoices, loading } = useInvoices();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [buyer, setBuyer] = useState('');

  const quickRanges = [
    { label: "2021-2022", start: "2021-04-01", end: "2022-03-31" },
    { label: "2022-2023", start: "2022-04-01", end: "2023-03-31" },
    { label: "May to December 2023", start: "2023-05-01", end: "2023-12-31" },
  ];

  function setQuickRange(range) {
    setStartDate(range.start);
    setEndDate(range.end);
  }

  // Filter invoices by date range, buyer, and invoice number
  const filteredInvoices = invoices.filter(inv => {
    if (startDate && new Date(inv.invoiceDate) < new Date(startDate)) return false;
    if (endDate && new Date(inv.invoiceDate) > new Date(endDate)) return false;
    if (buyer && !(inv.buyer?.name?.toLowerCase().includes(buyer.toLowerCase()))) return false;
    return true;
  });

  // Calculate totals
  const totalSales = filteredInvoices.reduce((sum, inv) => sum + (inv.amounts?.totalAmount || 0), 0);
  const totalProfit = filteredInvoices.reduce((sum, inv) => sum + (inv.amounts?.netAmount || 0), 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Invoice Reports</h1>
      {/* Quick Range Buttons */}
      <div className="flex gap-2 mb-4">
        {quickRanges.map(range => (
          <button
            key={range.label}
            onClick={() => setQuickRange(range)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
          >
            {range.label}
          </button>
        ))}
      </div>
      <div className="mb-4 text-gray-700 dark:text-gray-300 text-sm">Filter and review invoices by date, buyer, or invoice number. Totals update automatically.</div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-end bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Buyer</label>
          <input
            type="text"
            value={buyer}
            onChange={e => setBuyer(e.target.value)}
            placeholder="Buyer name"
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:border-blue-300 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>
      </div>
      {/* Totals */}
      <div className="flex gap-8 text-base font-semibold mb-4">
        <div>Total Sales: <span className="text-blue-700 dark:text-blue-300">₹{totalSales.toFixed(2)}</span></div>
        <div>Total Profit: <span className="text-green-700 dark:text-green-300">₹{totalProfit.toFixed(2)}</span></div>
        <div>Count: <span className="text-gray-700 dark:text-gray-200">{filteredInvoices.length}</span></div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Invoice No</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Date</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Buyer</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Total</th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-300 uppercase">Profit</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">No invoices found.</td>
              </tr>
            ) : (
              filteredInvoices.map(inv => (
                <tr key={inv._id}>
                  <td className="px-3 py-2">{format(new Date(inv.invoiceDate), 'dd/MM/yyyy')}</td>
                  <td className="px-3 py-2">{inv.buyer?.name || 'N/A'}</td>
                  <td className="px-3 py-2">₹{inv.amounts?.totalAmount?.toFixed(2) || '0.00'}</td>
                  <td className="px-3 py-2">₹{inv.amounts?.netAmount?.toFixed(2) || '0.00'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExportInvoices; 