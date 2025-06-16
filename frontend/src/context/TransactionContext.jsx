import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';
import { TransactionService } from '../services/transaction.service';
import { toast } from 'react-hot-toast';
import { AuthContext } from './AuthContext';

// Create context
const TransactionContext = createContext();

// Custom hook for using transactions
export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

// Provider component
export const TransactionProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    buyer: '',
    site: '',
    item: '',
    startDate: '',
    endDate: '',
    isInvoiced: undefined
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  // Reset filters
  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      buyer: '',
      site: '',
      item: '',
      startDate: '',
      endDate: '',
      isInvoiced: undefined
    });
    fetchTransactions({ page: 1 });
  };

  // 🔄 Fetch transactions
  const fetchTransactions = useCallback(async (newFilters = {}) => {
    if (!user) return; // Don't fetch if no user is logged in

    try {
      setLoading(true);
      setError(null);
      const mergedFilters = { ...filters, ...newFilters };

      const response = await TransactionService.getTransactions(mergedFilters);

      if (response.success) {
        setTransactions(response.data.transactions || []);
        setPagination({
          currentPage: response.data.pagination?.currentPage || 1,
          totalPages: response.data.pagination?.totalPages || 1,
          totalItems: response.data.pagination?.totalItems || 0
        });
        setFilters(mergedFilters);
      } else {
        throw new Error(response.message || 'Failed to fetch transactions');
      }
    } catch (err) {
      setError(err.message || 'Error fetching transactions');
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  // ✅ Auto-fetch when user changes or filters change
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  // ➕ Create transaction
  const createTransaction = async (transactionData) => {
    if (!user) throw new Error('You must be logged in to create a transaction');

    try {
      setLoading(true);
      const response = await TransactionService.createTransaction(transactionData);
      if (response.success) {
        toast.success('Transaction created successfully');
        await fetchTransactions(); // Refresh list
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create transaction');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to create transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Update transaction
  const updateTransaction = async (id, updateData) => {
    if (!user) throw new Error('You must be logged in to update a transaction');

    try {
      setLoading(true);
      const response = await TransactionService.updateTransaction(id, updateData);
      if (response.success) {
        toast.success('Transaction updated successfully');
        await fetchTransactions(); // Refresh list
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update transaction');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to update transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete transaction
  const deleteTransaction = async (id) => {
    if (!user) throw new Error('You must be logged in to delete a transaction');

    try {
      setLoading(true);
      const response = await TransactionService.deleteTransaction(id);
      if (response.success) {
        toast.success('Transaction deleted successfully');
        await fetchTransactions(); // Refresh list
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to delete transaction');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to delete transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Get transaction by ID
  const getTransactionById = async (id) => {
    if (!user) throw new Error('You must be logged in to view a transaction');

    try {
      setLoading(true);
      const response = await TransactionService.getTransactionById(id);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch transaction');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to fetch transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        error,
        filters,
        pagination,
        setFilters,
        resetFilters,
        fetchTransactions,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionById
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
