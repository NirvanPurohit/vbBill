import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier, getSupplierById } from '../api/auth';

const SupplierContext = createContext();

export const useSuppliers = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSuppliers must be used within a SupplierProvider');
  }
  return context;
};

export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuppliers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllSuppliers();
      const { data } = response.data;
      setSuppliers(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSupplier = useCallback((id) => {
    // First try to find the supplier in our cached suppliers
    const cachedSupplier = suppliers.find(supplier => supplier._id === id);
    
    if (cachedSupplier) {
      // If found in cache, return it immediately wrapped in a promise
      return Promise.resolve(cachedSupplier);
    }

    // If not found in cache, fetch it from the API
    setLoading(true);
    return getSupplierById(id)
      .then(response => {
        setError(null);
        return response.data.data;
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch supplier');
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [suppliers]);

  const addSupplier = useCallback(async (supplierData) => {
    setLoading(true);
    try {
      const response = await createSupplier(supplierData);
      setError(null);
      // Refresh the list
      fetchSuppliers();
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create supplier';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchSuppliers]);

  const modifySupplier = useCallback(async (id, supplierData) => {
    setLoading(true);
    try {
      const response = await updateSupplier(id, supplierData);
      setError(null);
      // Refresh the list
      fetchSuppliers();
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update supplier';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchSuppliers]);

  const removeSupplier = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteSupplier(id);
      setError(null);
      // Refresh the list
      fetchSuppliers();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete supplier';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchSuppliers]);

  const value = {
    suppliers,
    loading,
    error,
    fetchSuppliers,
    getSupplier,
    addSupplier,
    modifySupplier,
    removeSupplier,
  };

  return <SupplierContext.Provider value={value}>{children}</SupplierContext.Provider>;
};
