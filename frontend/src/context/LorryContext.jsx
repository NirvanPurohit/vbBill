import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllLorries, createLorry, updateLorry, deleteLorry, getLorryById } from '../api/auth';

const LorryContext = createContext();

export const useLorries = () => {
  const context = useContext(LorryContext);
  if (!context) {
    throw new Error('useLorries must be used within a LorryProvider');
  }
  return context;
};

export const LorryProvider = ({ children }) => {
  const [lorries, setLorries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLorries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllLorries();
      const { data } = response.data;
      setLorries(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lorries');
    } finally {
      setLoading(false);
    }
  }, []);

  const getLorry = useCallback((id) => {
    // First try to find the lorry in our cached lorries
    const cachedLorry = lorries.find(lorry => lorry._id === id);
    
    if (cachedLorry) {
      // If found in cache, return it immediately wrapped in a promise
      return Promise.resolve(cachedLorry);
    }

    // If not found in cache, fetch it from the API
    setLoading(true);
    return getLorryById(id)
      .then(response => {
        setError(null);
        return response.data.data;
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch lorry');
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [lorries]);

  const addLorry = useCallback(async (lorryData) => {
    setLoading(true);
    try {
      const response = await createLorry(lorryData);
      setError(null);
      // Refresh the list
      fetchLorries();
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create lorry';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchLorries]);

  const modifyLorry = useCallback(async (id, lorryData) => {
    setLoading(true);
    try {
      const response = await updateLorry(id, lorryData);
      setError(null);
      // Refresh the list
      fetchLorries();
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update lorry';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchLorries]);

  const removeLorry = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteLorry(id);
      setError(null);
      // Refresh the list
      fetchLorries();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete lorry';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchLorries]);

  const value = {
    lorries,
    loading,
    error,
    fetchLorries,
    getLorry,
    addLorry,
    modifyLorry,
    removeLorry,
  };

  return <LorryContext.Provider value={value}>{children}</LorryContext.Provider>;
};
