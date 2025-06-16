import React, { createContext, useContext, useState, useCallback } from 'react';
import { getAllSites, createSite, updateSite, deleteSite, getSiteById } from '../api/auth';

const SiteContext = createContext();

export const useSites = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSites must be used within a SiteProvider');
  }
  return context;
};

export const SiteProvider = ({ children }) => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSites = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllSites();
      const { data } = response.data;
      setSites(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sites');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSite = useCallback((id) => {
    // First try to find the site in our cached sites
    const cachedSite = sites.find(site => site._id === id);
    
    if (cachedSite) {
      // If found in cache, return it immediately wrapped in a promise
      return Promise.resolve(cachedSite);
    }

    // If not found in cache, fetch it from the API
    setLoading(true);
    return getSiteById(id)
      .then(response => {
        setError(null);
        return response.data.data;
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to fetch site');
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sites]);

  const addSite = useCallback(async (siteData) => {
    setLoading(true);
    try {
      const response = await createSite(siteData);
      setError(null);
      // Refresh the list
      fetchSites();
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create site';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchSites]);

  const modifySite = useCallback(async (id, siteData) => {
    setLoading(true);
    try {
      const response = await updateSite(id, siteData);
      setError(null);
      // Refresh the list
      fetchSites();
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update site';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchSites]);

  const removeSite = useCallback(async (id) => {
    setLoading(true);
    try {
      await deleteSite(id);
      setError(null);
      // Refresh the list
      fetchSites();
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete site';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [fetchSites]);

  const value = {
    sites,
    loading,
    error,
    fetchSites,
    getSite,
    addSite,
    modifySite,
    removeSite,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};
