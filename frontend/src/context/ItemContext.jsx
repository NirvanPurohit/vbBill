import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllItems, createItem, updateItem, deleteItem, getItemById } from '../api/auth';

const ItemContext = createContext();

export const useItems = () => {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error('useItems must be used within an ItemProvider');
  }
  return context;
};

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchItems = useCallback(async (page = 1, limit = 8) => {
    setLoading(true);
    try {
      const response = await getAllItems(page, limit);
      const { items, totalPages } = response.data.data;
      setItems(items);
      setTotalPages(totalPages);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, []);

  const getItem = useCallback((id) => {
    // First try to find the item in our cached items
    const cachedItem = items.find(item => item._id === id);
    
    if (cachedItem) {
      // If found in cache, return it immediately wrapped in a promise
      return Promise.resolve(cachedItem);
    }

    // If not found in cache, fetch it from the API
    setLoading(true);
    return getItemById(id)
      .then(response => {
        setError(null);
        return response.data.data;
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch item');
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [items]);

  const addItem = useCallback(async (itemData) => {
    setLoading(true);
    try {
      const response = await createItem(itemData);
      setError(null);
      // Refresh the items list after adding
      fetchItems(currentPage);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchItems]);

  const modifyItem = useCallback(async (id, itemData) => {
    setLoading(true);
    try {
      const response = await updateItem(id, itemData);
      setError(null);
      // Refresh the items list after updating
      fetchItems(currentPage);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchItems]);

  const removeItem = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteItem(id);
      setError(null);
      // Refresh the items list after deletion
      fetchItems(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchItems]);

  const value = {
    items,
    loading,
    error,
    totalPages,
    currentPage,
    fetchItems,
    getItem,
    addItem,
    modifyItem,
    removeItem,
  };

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>;
};
