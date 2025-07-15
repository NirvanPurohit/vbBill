import React from 'react';
import { useTransactions } from '../../context/TransactionContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const TransactionList = () => {
  const { transactions, loading, error, deleteTransaction } = useTransactions();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (confirmDelete) {
      try {
        await deleteTransaction(id);
      } catch (err) {
        alert("Failed to delete transaction.");
      }
    }
  };
  
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Challan/Voucher</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lorry</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer/Site</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(transaction.transactionDate), 'dd/MM/yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>CH: {transaction.challanNumber || '-'}</div>
                <div className="text-gray-500">VC: {transaction.voucherNumber || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {transaction.lorry?.registrationNumber || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">{transaction.lorryCode || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {transaction.buyer?.name || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                  {transaction.site?.name || '-'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {transaction.item?.name || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {transaction.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">Sale: ₹{transaction.saleRate}</div>
                <div className="text-sm text-gray-500">Purchase: ₹{transaction.purchaseRate}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  transaction.isInvoiced ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {transaction.isInvoiced ? 'Invoiced' : 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                {!transaction.isInvoiced && (
                  <>
                    <button
                      onClick={() => navigate(`/transactions/${transaction._id}`)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => navigate(`/invoice?transactionId=${transaction._id}`)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Create Invoice
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
