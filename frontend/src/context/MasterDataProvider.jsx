import React, { useEffect, createContext, useContext } from 'react';

// ✅ Import the actual providers
import { useBusinesses, BusinessProvider } from './BusinessContext';
import { useItems, ItemProvider } from './ItemContext';
import { useLorries, LorryProvider } from './LorryContext';
import { useSites, SiteProvider } from './SiteContext';
import { useSuppliers, SupplierProvider } from './SupplierContext';

// ✅ Create MasterDataContext
export const MasterDataContext = createContext();

// ✅ Hook to use context safely
export const useMasterData = () => {
  const context = useContext(MasterDataContext);
  if (!context) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  return context;
};

// ✅ Wrap everything in nested providers
export const MasterDataProvider = ({ children }) => {
  return (
    <BusinessProvider>
      <ItemProvider>
        <LorryProvider>
          <SiteProvider>
            <SupplierProvider>
              <MasterDataCollector>{children}</MasterDataCollector>
            </SupplierProvider>
          </SiteProvider>
        </LorryProvider>
      </ItemProvider>
    </BusinessProvider>
  );
};

// ✅ This component will fetch all master data once on load
const MasterDataCollector = ({ children }) => {
  const businessCtx = useBusinesses();
  const itemCtx = useItems();
  const lorryCtx = useLorries();
  const siteCtx = useSites();
  const supplierCtx = useSuppliers();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          businessCtx.fetchBusinesses(),
          itemCtx.fetchItems(),
          lorryCtx.fetchLorries(),
          siteCtx.fetchSites(),
          supplierCtx.fetchSuppliers()
        ]);
      } catch (error) {
        console.error('Error fetching master data:', error);
      }
    };

    fetchAllData();
  }, []);

  const value = {
    buyers: businessCtx.businesses || [],
    items: itemCtx.items || [],
    lorries: lorryCtx.lorries || [],
    sites: siteCtx.sites || [],
    suppliers: supplierCtx.suppliers || [],
    loading: {
      buyers: businessCtx.loading,
      items: itemCtx.loading,
      lorries: lorryCtx.loading,
      sites: siteCtx.loading,
      suppliers: supplierCtx.loading
    },
    error: {
      buyers: businessCtx.error,
      items: itemCtx.error,
      lorries: lorryCtx.error,
      sites: siteCtx.error,
      suppliers: supplierCtx.error
    },
    refresh: {
      buyers: businessCtx.fetchBusinesses,
      items: itemCtx.fetchItems,
      lorries: lorryCtx.fetchLorries,
      sites: siteCtx.fetchSites,
      suppliers: supplierCtx.fetchSuppliers
    }
  };

  return (
    <MasterDataContext.Provider value={value}>
      {children}
    </MasterDataContext.Provider>
  );
};
