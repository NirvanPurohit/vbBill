import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { InvoiceService } from '../../../services/invoice.service';
import { toast } from 'react-hot-toast';

const InvoicePreview = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { transactions = [], notes = '', startDate, endDate } = state || {};
  const [loading, setLoading] = useState(false);

  // Validate transactions data
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-center text-yellow-700">No transactions selected. Please select transactions to generate an invoice.</p>
        </div>
      </div>
    );
  }

  // Validate required transaction data
  const buyer = transactions[0]?.buyer;
  const site = transactions[0]?.site;
  const item = transactions[0]?.item;

  if (!buyer || !site || !item) {
    return (
      <div className="max-w-5xl mx-auto p-6 mt-10">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-center text-red-700">Invalid transaction data. Missing buyer, site, or item information.</p>
        </div>
      </div>
    );
  }

  // Calculate net amount
  const net = transactions.reduce((sum, t) => {
    const amount = (t.quantity || 0) * (t.saleRate || 0);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  // Get tax rates from the first transaction's item
  const { igstRate = 0, cgstRate = 0, sgstRate = 0 } = item;

  // Calculate taxes based on net amount
  const igst = (net * (igstRate || 0)) / 100;
  const cgst = (net * (cgstRate || 0)) / 100;
  const sgst = (net * (sgstRate || 0)) / 100;

  // Calculate total amount
  const total = net + igst + cgst + sgst;

  const handleGenerate = async () => {
    try {
      setLoading(true);

      // Validate calculated amounts
      if (isNaN(net) || net <= 0) {
        toast.error('Invalid net amount. Please check the transaction quantities and rates.');
        return;
      }

      if ([igst, cgst, sgst, total].some(amount => isNaN(amount))) {
        toast.error('Invalid tax calculations. Please check the item tax rates.');
        return;
      }

      // Validate transactions
      if (!transactions.every(t => t._id && t.buyer?._id && t.site?._id && t.item?._id)) {
        toast.error('Invalid transaction data. Missing required information.');
        return;
      }

      // Construct invoice data
      const invoiceData = {
        transactionIds: transactions.map(t => t._id),
        invoiceDate: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
        notes: notes || ''
      };

      console.log('Sending invoice data:', invoiceData); // Debug log

      const response = await InvoiceService.generateInvoice(invoiceData);
      console.log('Invoice generation response:', response); // Debug log

      const invoiceId = response?.data?._id;
      if (invoiceId) {
    toast.success('Invoice generated successfully');
    navigate(`/invoices/${invoiceId}`, {
      replace: true,
      state: { refresh: true }
    });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to generate invoice';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Invoice Preview</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500">Buyer</p>
          <p className="text-lg text-gray-900">{buyer.name || 'N/A'}</p>
          <p className="text-sm text-gray-500">{buyer.gstNum || ''}</p>
        </div>
        <div>          <p className="text-sm text-gray-500">Site</p>
          <p className="text-lg text-gray-900">{site.siteName || 'N/A'}</p>
          <p className="text-sm text-gray-500">{site.address || ''}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Item</p>
          <p className="text-lg text-gray-900">{item.itemName || 'N/A'}</p>
        </div>
        {startDate && endDate && (
          <div>
            <p className="text-sm text-gray-500">Period</p>
            <p className="text-lg text-gray-900">
              {format(new Date(startDate), 'dd/MM/yyyy')} - {format(new Date(endDate), 'dd/MM/yyyy')}
            </p>
          </div>
        )}
      </div>

      {/* Transaction Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Transaction Summary</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Challan</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((txn) => (
                <tr key={txn._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">
                    {format(new Date(txn.transactionDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{txn.challanNumber}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">{txn.quantity?.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">₹{txn.saleRate?.toFixed(2)}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    ₹{((txn.quantity || 0) * (txn.saleRate || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amount Summary */}
      <div className="border-t pt-4">
        <div className="flex justify-end space-y-2">
          <div className="w-64">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Net Amount:</span>
              <span className="font-medium">₹{net.toFixed(2)}</span>
            </div>
            {igst > 0 ? (
              <div className="flex justify-between py-1">
                <span className="text-gray-600">IGST ({igstRate}%):</span>
                <span className="font-medium">₹{igst.toFixed(2)}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">CGST ({cgstRate}%):</span>
                  <span className="font-medium">₹{cgst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">SGST ({sgstRate}%):</span>
                  <span className="font-medium">₹{sgst.toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between py-1 border-t font-semibold">
              <span>Total Amount:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Invoice'
          )}
        </button>
      </div>
    </div>
  );
};

export default InvoicePreview;