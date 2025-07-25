import React from 'react';
import InvoiceTable from '../../components/invoices/InvoiceList/InvoiceTable';
import { useInvoices } from '../../context/InvoiceContext';

const InvoiceListPage = () => {
  const { invoices, loading } = useInvoices();
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="px-4 sm:px-0 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <InvoiceTable />
        )}
      </div>
    </div>
  );
};

export default InvoiceListPage;
