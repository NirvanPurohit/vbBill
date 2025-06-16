import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TransactionForm from '../../components/transactions/TransactionForm';
import { useTransactions } from '../../context/TransactionContext';

const UpdateTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, getTransactionById } = useTransactions();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const existing = transactions.find(t => t._id === id);
    if (existing) {
      setTransaction(existing);
      setLoading(false);
    } else {
      getTransactionById(id)
        .then(data => setTransaction(data))
        .catch(() => navigate('/transactions'))
        .finally(() => setLoading(false));
    }
  }, [id, transactions, getTransactionById, navigate]);

  if (loading) return <div className="p-6 text-gray-500">Loading...</div>;
  if (!transaction) return <div className="p-6 text-red-500">Transaction not found</div>;

  if (transaction.isInvoiced) {
    navigate('/transactions');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Update Transaction</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <TransactionForm initialData={transaction} />
      </div>
    </div>
  );
};

export default UpdateTransaction;
