import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../../context/TransactionContext.jsx';

function InvoiceGenerate() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const { transactions, loading, error } = useTransactions();

  const filteredTransactions = transactions?.filter((txn) => {
    const txnDate = new Date(txn.transactionDate);
    const from = new Date(startDate);
    const to = new Date(endDate);
    return txnDate >= from && txnDate <= to;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/invoices/preview", {
      state: {
        transactions: filteredTransactions,
        notes,
        startDate,
        endDate
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-2xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any invoice notes here..."
            className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        <div className="md:col-span-2 text-right">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Generate Invoice
          </button>
        </div>
      </form>

      {loading && <p className="mt-4 text-blue-600">Loading Transactions...</p>}
      {error && <p className="mt-4 text-red-600">Error: {error.message}</p>}

      <div className="mt-6 space-y-4">
        {filteredTransactions?.map((txn) => (
          <div key={txn._id} className="bg-white p-4 rounded-xl shadow border">
            <p><strong>Date:</strong> {txn.transactionDate}</p>
            <p><strong>Buyer:</strong> {txn.buyer?.name}</p>
            <p><strong>Quantity:</strong> {txn.quantity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvoiceGenerate;
