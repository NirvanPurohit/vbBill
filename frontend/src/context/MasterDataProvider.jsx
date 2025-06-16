import React from 'react';
import { ItemProvider } from './ItemContext';
import { BusinessProvider } from './BusinessContext';
import { LorryProvider } from './LorryContext';
import { SiteProvider } from './SiteContext';
import { SupplierProvider } from './SupplierContext';

export const MasterDataProvider = ({ children }) => {
  return (
    <BusinessProvider>
      <ItemProvider>
        <LorryProvider>
          <SiteProvider>
            <SupplierProvider>
              {children}
            </SupplierProvider>
          </SiteProvider>
        </LorryProvider>
      </ItemProvider>
    </BusinessProvider>
  );
};
