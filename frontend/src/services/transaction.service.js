import api from '../api/axiosInstnance';

export const TransactionService = {
  // ✅ Create a new transaction
  createTransaction: async (transactionData) => {
    const res = await api.post('/transactions', transactionData);
    return res.data;
  },

  // ✅ Get all transactions with filters
  getTransactions: async (filters = {}) => {
    const {
      page = 1,
      limit = 10,
      buyer,
      site,
      item,
      startDate,
      endDate,
      isInvoiced
    } = filters;

    const queryParams = new URLSearchParams({
      page,
      limit
    });

    if (buyer) queryParams.append('buyer', buyer);
    if (site) queryParams.append('site', site);
    if (item) queryParams.append('item', item);
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (isInvoiced !== undefined) queryParams.append('isInvoiced', isInvoiced);

    const res = await api.get(`/transactions?${queryParams.toString()}`);
    return res.data;
  },

  // ✅ Get a single transaction by ID
  getTransactionById: async (id) => {
    const res = await api.get(`/transactions/${id}`);
    return res.data;
  },

  // ✅ Update a transaction
  updateTransaction: async (id, updateData) => {
    const res = await api.put(`/transactions/${id}`, updateData);
    return res.data;
  },

  // ✅ Delete a transaction
  deleteTransaction: async (id) => {
    const res = await api.delete(`/transactions/${id}`);
    return res.data;
  },
};
