import axiosInstance from '../api/axiosInstnance';

export const InvoiceService = {
  // Generate a new invoice
  generateInvoice: async (invoiceData) => {
    try {
      const response = await axiosInstance.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error generating invoice:', error.response || error);
      throw error;
    }
  },

  getAllInvoices: async () => {
    try {
      console.log('Fetching all invoices'); // Debug log
      const response = await axiosInstance.get('/invoices');
      console.log('Invoices response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching invoices:', error.response || error);
      throw error;
    }
  },

  // Get a single invoice by ID
  getInvoiceById: async (id) => {
    try {
      console.log('Fetching invoice by ID:', id); // Debug log
      const response = await axiosInstance.get(`/invoices/${id}`);
      console.log('Invoice by ID response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching invoice by ID:', error.response || error);
      throw error;
    }
  }
};
