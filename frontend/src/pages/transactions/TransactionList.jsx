import React from 'react';
import TransactionList from '../../components/transactions/TransactionList';
import TransactionFilters from '../../components/transactions/TransactionFilters';
import { useTransactions } from '../../context/TransactionContext';
import { useNavigate } from 'react-router-dom';

const TransactionListPage = () => {
  const { loading } = useTransactions();
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="px-4 sm:px-0 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
        <button
          onClick={() => navigate('/transactions/new')}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          New Transaction
        </button>
      </div>

      {/* Filters */}
      {/* <TransactionFilters /> */}

      {/* Content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <TransactionList />
        )}
      </div>
    </div>
  );
};

export default TransactionListPage;
