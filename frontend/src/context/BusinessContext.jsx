import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllBusinesses, createBusiness, updateBusiness, deleteBusiness, getBusinessById } from '../api/auth';

const BusinessContext = createContext();

export const useBusinesses = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinesses must be used within a BusinessProvider');
  }
  return context;
};

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllBusinesses();
      const { data } = response.data;
      setBusinesses(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch businesses');
    } finally {
      setLoading(false);
    }
  }, []);

  const getBusiness = useCallback((id) => {
    // First try to find the business in our cached businesses
    const cachedBusiness = businesses.find(business => business._id === id);
    
    if (cachedBusiness) {
      // If found in cache, return it immediately wrapped in a promise
      return Promise.resolve(cachedBusiness);
    }

    // If not found in cache, fetch it from the API
    setLoading(true);
    return getBusinessById(id)
      .then(response => {
        setError(null);
        return response.data.data;
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch business');
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [businesses]);

  const addBusiness = useCallback(async (businessData) => {
    setLoading(true);
    try {
      const response = await createBusiness(businessData);
      setError(null);
      // Refresh the list
      fetchBusinesses();
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create business';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchBusinesses]);

  const modifyBusiness = useCallback(async (id, businessData) => {
    setLoading(true);
    try {
      const response = await updateBusiness(id, businessData);
      setError(null);
      // Refresh the list
      fetchBusinesses();
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update business';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchBusinesses]);

  const removeBusiness = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteBusiness(id);
      setError(null);
      // Refresh the list
      fetchBusinesses();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete business';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchBusinesses]);

  const value = {
    businesses,
    loading,
    error,
    fetchBusinesses,
    getBusiness,
    addBusiness,
    modifyBusiness,
    removeBusiness,
  };

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
};
