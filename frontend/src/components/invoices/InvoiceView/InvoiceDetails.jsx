import React from 'react';
import { useInvoices } from '../../../context/InvoiceContext';
import { format } from 'date-fns';

const InvoiceDetails = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Invoice #{invoice.invoiceNo}</h2>
            <p className="text-sm text-gray-600">
              {format(new Date(invoice.invoiceDate), 'dd MMMM yyyy')}
            </p>
          </div>
          <div className="text-right">
            <button
              onClick={() => {/* Handle print/download */}}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Print Invoice
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="px-6 py-4 grid grid-cols-2 gap-6">
        {/* Buyer Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Buyer Details</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-900">{invoice.buyer.name}</p>
            <p className="text-sm text-gray-600">GST: {invoice.buyer.gstNum}</p>
          </div>
        </div>

        {/* Site Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Site Details</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-900">{invoice.site.siteName}</p>
            <p className="text-sm text-gray-600">{invoice.site.address}</p>
          </div>
        </div>

        {/* Item Info */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Item Details</h3>
          <p className="text-sm text-gray-900">{invoice.item.itemName}</p>
        </div>

        {/* Transaction Range */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Transaction Period</h3>
          <p className="text-sm text-gray-900">
            {format(new Date(invoice.transactionRange.from), 'dd MMM yyyy')} - 
            {format(new Date(invoice.transactionRange.to), 'dd MMM yyyy')}
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="px-6 py-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Challan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lorry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoice.transactions.map((txn) => (
                <tr key={txn._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(txn.transactionDate), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {txn.challanNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {txn.lorryCode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {txn.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{txn.saleRate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{(txn.quantity * txn.saleRate).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Amount Summary */}
      <div className="px-6 py-4 bg-gray-50">
        <dl className="space-y-3">
          <div className="flex justify-between">
            <dt className="text-sm font-medium text-gray-500">Net Amount</dt>
            <dd className="text-sm text-gray-900">₹{invoice.amounts.netAmount.toFixed(2)}</dd>
          </div>
          {invoice.amounts.igst > 0 ? (
            <div className="flex justify-between">
              <dt className="text-sm font-medium text-gray-500">IGST</dt>
              <dd className="text-sm text-gray-900">₹{invoice.amounts.igst.toFixed(2)}</dd>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">CGST</dt>
                <dd className="text-sm text-gray-900">₹{invoice.amounts.cgst.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">SGST</dt>
                <dd className="text-sm text-gray-900">₹{invoice.amounts.sgst.toFixed(2)}</dd>
              </div>
            </>
          )}
          <div className="flex justify-between pt-3 border-t border-gray-200">
            <dt className="text-base font-medium text-gray-900">Total Amount</dt>
            <dd className="text-base font-medium text-gray-900">
              ₹{invoice.amounts.totalAmount.toFixed(2)}
            </dd>
          </div>
        </dl>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="px-6 py-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Notes</h3>
          <p className="text-sm text-gray-600">{invoice.notes}</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
