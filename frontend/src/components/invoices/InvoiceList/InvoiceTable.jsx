import React from 'react';
import { useInvoices } from '../../../context/InvoiceContext';
import { format } from 'date-fns';
import {useNavigate} from "react-router-dom"
const InvoiceTable = () => {
  const { invoices, loading, error } = useInvoices();
  const navigate=useNavigate();
  if (loading) return <div className="text-center py-8">Loading invoices...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!invoices?.length) return <div className="text-center py-8">No invoices found</div>;
  console.log("Invoices:",invoices)

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Buyer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Site
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{invoice.invoiceNo}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(invoice.invoiceDate), 'dd/MM/yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{invoice.buyer?.name}</div>
                <div className="text-sm text-gray-500">{invoice.buyer?.gstNum}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {invoice.site?.siteName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {invoice.item?.itemName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  ₹{invoice.amounts?.totalAmount?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-gray-500">
                  Net: ₹{invoice.amounts?.netAmount?.toFixed(2) || '0.00'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                  navigate(`/invoices/${invoice._id}`);
              console.log('View', invoice._id); // This will log AFTER navigation
              }}

                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View
                  </button>
                  <button
                    onClick={() => console.log('Download', invoice._id)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Download
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;