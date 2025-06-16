import React, { createContext, useContext, useState, useEffect } from 'react';
import { InvoiceService } from '../services/invoice.service';
import { toast } from 'react-hot-toast';

const InvoiceContext = createContext();

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }
  return context;
};

export const InvoiceProvider = ({ children }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await InvoiceService.getAllInvoices();
      setInvoices(response.data.invoices);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load invoices');
      console.error('Invoice fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate new invoice
  const generateInvoice = async (invoiceData) => {
    try {
      setLoading(true);
      const response = await InvoiceService.createInvoice(invoiceData);
      toast.success('Invoice created successfully');
      await fetchInvoices(); // Refresh the list
      return response.data;
    } catch (err) {
      setError(err.message);
      toast.error('Failed to create invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an invoice
  const deleteInvoice = async (invoiceId) => {
    try {
      setLoading(true);
      await InvoiceService.deleteInvoice(invoiceId);
      toast.success('Invoice deleted successfully');
      await fetchInvoices(); // Refresh the list
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchInvoices();
  }, []);

  const value = {
    invoices,
    loading,
    error,
    fetchInvoices,
    generateInvoice,
    deleteInvoice
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};