import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2pdf from 'html2pdf.js';
import axiosInstnance from '../../../api/axiosInstnance.js'
import { format } from 'date-fns';

const InvoiceDetails = ({ invoice }) => {
  const componentRef = useRef();
  const [emailId, setEmailId] = useState(invoice.customerEmail || '');
  
  const handleEmail = async () => {
    try {
      // Validate email input
      if (!emailId || !emailId.trim()) {
        alert('Please enter an email address to send the invoice.');
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailId.trim())) {
        alert('Please enter a valid email address.');
        return;
      }

      // Validate required invoice data
      if (!invoice.invoiceNo) {
        alert('Invoice number is missing. Cannot send email.');
        return;
      }

      // Hide action buttons and show invoice header before generating PDF
      const actionBar = document.querySelector('.invoice-action-bar');
      const invoiceHeader = document.querySelector('.invoice-header');
      
      if (actionBar) actionBar.style.display = 'none';
      if (invoiceHeader) invoiceHeader.style.display = 'block';
  
      // Wait for DOM update
      await new Promise((resolve) => setTimeout(resolve, 200));
  
      const element = componentRef.current;
      if (!element) {
        alert('Invoice content is not available for email. Please try reloading the page.');
        throw new Error('componentRef.current is null');
      }
  
      const opt = {
        margin: 0.5,
        filename: `Invoice-${invoice.invoiceNo}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
  
      console.log('Generating PDF...');
      // Generate PDF as blob
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
      console.log('PDF generated successfully, size:', pdfBlob.size);
      
      // Prepare form data
      const formData = new FormData();
      formData.append('file', pdfBlob, `Invoice-${invoice.invoiceNo}.pdf`);
      formData.append('email', emailId.trim());
      formData.append('invoiceNo', invoice.invoiceNo || '');
      formData.append('customerName', invoice.buyer?.name || '');
      formData.append('invoiceDate', invoice.invoiceDate || '');
      formData.append('totalAmount', invoice.amounts?.totalAmount?.toString() || '0');

      // Debug: Log form data contents
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        if (key === 'file') {
          console.log(`${key}: [File] ${value.name}, size: ${value.size}`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      console.log('Sending email request...');
      const response = await axiosInstnance.post(
        '/send-invoice-email',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000 // 30 second timeout
        }
      );
  
      console.log('Email response:', response.data);
      
      if (response.status === 200 || response.status === 201) {
        alert('Invoice emailed successfully!');
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Email Send Error Details:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      });

      // More specific error messages
      if (err.response?.status === 500) {
        alert('Server error occurred while sending email. Please check server logs and try again.');
      } else if (err.response?.status === 400) {
        alert('Invalid request. Please check the email address and try again.');
      } else if (err.code === 'ECONNABORTED') {
        alert('Request timed out. Please try again.');
      } else if (err.response?.data?.message) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert('Failed to send invoice email. Please try again.');
      }
    } finally {
      // Restore action bar and hide invoice header
      const actionBar = document.querySelector('.invoice-action-bar');
      const invoiceHeader = document.querySelector('.invoice-header');
      
      if (actionBar) actionBar.style.display = '';
      if (invoiceHeader) invoiceHeader.style.display = 'none';
    }
  };
  
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice-${invoice.invoiceNo}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .print\\:hidden { display: none !important; }
        .print\\:block { display: block !important; }
        .print\\:bg-gray-100 { background-color: #f3f4f6 !important; }
        .print\\:text-base { font-size: 1rem !important; }
        .print\\:text-lg { font-size: 1.125rem !important; }
        .print\\:font-bold { font-weight: 700 !important; }
        .print\\:font-medium { font-weight: 500 !important; }
        .print\\:border-t-2 { border-top-width: 2px !important; }
        .print\\:border-gray-300 { border-color: #d1d5db !important; }
        .print\\:border-gray-400 { border-color: #9ca3af !important; }
        .print\\:gap-8 { gap: 2rem !important; }
        .print\\:space-y-2 > * + * { margin-top: 0.5rem !important; }
        .print\\:shadow-none { box-shadow: none !important; }
        .print\\:text-sm { font-size: 0.875rem !important; }
        .print\\:border-b { border-bottom-width: 1px !important; }
        .invoice-header { display: block !important; }
        .invoice-action-bar { display: none !important; }
      }
    `,
    onBeforeGetContent: () => {
      console.log("Preparing to print...");
    },
    onAfterPrint: () => {
      console.log("Print completed");
    }
  });

  const handleDownload = async () => {
    try {
      // Hide action buttons and show invoice header before generating PDF
      const actionBar = document.querySelector('.invoice-action-bar');
      const invoiceHeader = document.querySelector('.invoice-header');
      
      if (actionBar) actionBar.style.display = 'none';
      if (invoiceHeader) invoiceHeader.style.display = 'block';
  
      // Wait for DOM update
      await new Promise((resolve) => setTimeout(resolve, 200));
  
      const element = componentRef.current;
      if (!element) {
        alert('Invoice content is not available for download. Please try reloading the page.');
        throw new Error('componentRef.current is null');
      }
  
      const opt = {
        margin: 0.5,
        filename: `Invoice-${invoice.invoiceNo}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
  
      // Generate PDF as blob
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob');
  
      // Trigger download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoice.invoiceNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url); // Clean up
  
    } catch (err) {
      alert('Failed to generate PDF. Please try again.');
      console.error('PDF Download Error:', err);
    } finally {
      // Restore action buttons and hide invoice header
      const actionBar = document.querySelector('.invoice-action-bar');
      const invoiceHeader = document.querySelector('.invoice-header');
      
      if (actionBar) actionBar.style.display = '';
      if (invoiceHeader) invoiceHeader.style.display = 'none';
    }
  };

  // Helper function to format invoice number
  const formatInvoiceNumber = (invoiceNo) => {
    if (!invoiceNo) return 'N/A';
    // Add proper formatting - you can customize this based on your needs
    return invoiceNo.toString().padStart(6, '0'); // e.g., "000123"
  };

  // Defensive checks for required fields
  const missingFields = [];
  if (!invoice.buyer || !invoice.buyer.name) missingFields.push('Buyer');
  if (!invoice.site || !invoice.site.siteName) missingFields.push('Site');
  if (!invoice.item || !invoice.item.itemName) missingFields.push('Item');
  if (!invoice.transactionRange || !invoice.transactionRange.from || !invoice.transactionRange.to) missingFields.push('Transaction Range');
  if (!invoice.amounts) missingFields.push('Amounts');
  if (!Array.isArray(invoice.transactions)) missingFields.push('Transactions');

  return (
    <div>
      {missingFields.length > 0 && (
        <div style={{ background: '#fef3c7', color: '#92400e', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #fde68a' }}>
          <strong>Warning:</strong> This invoice is missing the following data: {missingFields.join(', ')}. Some details may not be displayed.
        </div>
      )}
      <div ref={componentRef} style={{ background: '#fff', color: '#000' }}>
        <div style={{ background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: '0.5rem', overflow: 'hidden' }}>
          
          {/* Screen Action Buttons - Hidden in print/PDF */}
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }} className="print:hidden invoice-action-bar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111' }}>Invoice #{formatInvoiceNumber(invoice.invoiceNo)}</h2>
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                  {invoice.invoiceDate ? format(new Date(invoice.invoiceDate), 'dd MMMM yyyy') : 'No date'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handlePrint}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#fff', background: '#16a34a', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
                  disabled={missingFields.length > 0}
                >
                  Print Invoice
                </button>
                <button
                  onClick={handleDownload}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: '#fff', background: '#4f46e5', borderRadius: '0.375rem', border: 'none', cursor: 'pointer' }}
                  disabled={missingFields.length > 0}
                >
                  Download PDF
                </button>
                
                {/* Email Input and Button Container */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    placeholder="Enter email address"
                    style={{ 
                      padding: '0.5rem', 
                      fontSize: '0.875rem', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '0.375rem',
                      minWidth: '200px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  />
                  <button 
                    onClick={handleEmail}
                    style={{ 
                      padding: '0.5rem 1rem', 
                      fontSize: '0.875rem', 
                      fontWeight: 500, 
                      color: '#fff', 
                      background: missingFields.length > 0 || !emailId.trim() ? '#9ca3af' : '#dc2626', 
                      borderRadius: '0.375rem', 
                      border: 'none', 
                      cursor: missingFields.length > 0 || !emailId.trim() ? 'not-allowed' : 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                    disabled={missingFields.length > 0 || !emailId.trim()}
                    title={!emailId.trim() ? 'Please enter email address' : ''}
                  >
                    Email Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Print/PDF Header - Always visible in print/PDF, hidden on screen */}
          <div className="invoice-header" style={{ 
            display: 'none', 
            padding: '2rem 1.5rem 1rem 1.5rem', 
            borderBottom: '2px solid #e5e7eb',
            textAlign: 'center' 
          }}>
            <h1 style={{ 
              fontSize: '2.25rem', 
              fontWeight: 'bold', 
              color: '#111', 
              marginBottom: '0.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              INVOICE
            </h1>
            <div style={{ 
              fontSize: '1.25rem', 
              fontWeight: 600, 
              color: '#374151',
              marginBottom: '0.25rem'
            }}>
              Invoice No: {formatInvoiceNumber(invoice.invoiceNo)}
            </div>
            <div style={{ 
              fontSize: '1rem', 
              color: '#4b5563',
              fontWeight: 500
            }}>
              Date: {invoice.invoiceDate ? format(new Date(invoice.invoiceDate), 'dd MMMM yyyy') : 'No date'}
            </div>
          </div>

          {/* Invoice Content */}
          <div>
            {/* Details Grid */}
            <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Buyer Info */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                  BUYER DETAILS
                </h3>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#111', fontWeight: 500 }}>
                    {invoice.buyer?.name || 'N/A'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    GST: {invoice.buyer?.gstNum || 'N/A'}
                  </p>
                  {invoice.customerEmail && (
                    <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                      Email: {invoice.customerEmail}
                    </p>
                  )}
                </div>
              </div>

              {/* Site Info */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                  SITE DETAILS
                </h3>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#111', fontWeight: 500 }}>
                    {invoice.site?.siteName || 'N/A'}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                    {invoice.site?.siteAddress || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Item Info */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                  ITEM DETAILS
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#111', fontWeight: 500 }}>
                  {invoice.item?.itemName || 'N/A'}
                </p>
              </div>

              {/* Transaction Range */}
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.5rem' }}>
                  TRANSACTION PERIOD
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#111' }}>
                  {invoice.transactionRange?.from && invoice.transactionRange?.to
                    ? `${format(new Date(invoice.transactionRange.from), 'dd MMM yyyy')} - ${format(new Date(invoice.transactionRange.to), 'dd MMM yyyy')}`
                    : 'N/A'}
                </p>
              </div>
            </div>

            {/* Transactions Table */}
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#374151', marginBottom: '0.75rem' }}>
                TRANSACTIONS
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', color: '#111' }}>
                  <thead style={{ background: '#f9fafb' }}>
                    <tr>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                        Date
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                        Challan
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                        Lorry
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                        Quantity
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                        Rate
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(invoice.transactions) && invoice.transactions.length > 0 ? (
                      invoice.transactions.map((txn) => (
                        <tr key={txn._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: '#111' }}>
                            {txn.transactionDate ? format(new Date(txn.transactionDate), 'dd/MM/yyyy') : 'N/A'}
                          </td>
                          <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: '#111' }}>
                            {txn.challanNumber || 'N/A'}
                          </td>
                          <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: '#111' }}>
                            {txn.lorryCode || 'N/A'}
                          </td>
                          <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: '#111' }}>
                            {txn.quantity ?? 'N/A'}
                          </td>
                          <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: '#111' }}>
                            {txn.saleRate ?? 'N/A'}
                          </td>
                          <td style={{ padding: '1rem', whiteSpace: 'nowrap', color: '#111' }}>
                            {txn.amount ?? 'N/A'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>No transactions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Amount Summary */}
            <div style={{ padding: '1.5rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
              {invoice.amounts ? (
                <>
                  <dl style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <dt style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                      Net Amount
                    </dt>
                    <dd style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111' }}>
                      ₹{invoice.amounts.netAmount?.toFixed(2) ?? 'N/A'}
                    </dd>
                  </dl>
                  {invoice.amounts.igst > 0 ? (
                    <dl style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <dt style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                        IGST
                      </dt>
                      <dd style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111' }}>
                        ₹{invoice.amounts.igst?.toFixed(2) ?? 'N/A'}
                      </dd>
                    </dl>
                  ) : (
                    <>
                      <dl style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <dt style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                          CGST
                        </dt>
                        <dd style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111' }}>
                          ₹{invoice.amounts.cgst?.toFixed(2) ?? 'N/A'}
                        </dd>
                      </dl>
                      <dl style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <dt style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                          SGST
                        </dt>
                        <dd style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111' }}>
                          ₹{invoice.amounts.sgst?.toFixed(2) ?? 'N/A'}
                        </dd>
                      </dl>
                    </>
                  )}
                  <dl style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                    <dt style={{ fontSize: '0.875rem', fontWeight: 500, color: '#6b7280' }}>
                      TOTAL AMOUNT
                    </dt>
                    <dd style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111' }}>
                      ₹{invoice.amounts.totalAmount?.toFixed(2) ?? 'N/A'}
                    </dd>
                  </dl>
                </>
              ) : (
                <div style={{ color: '#b91c1c' }}>Amount details not available.</div>
              )}
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '0.5rem' }}>
                  NOTES
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;