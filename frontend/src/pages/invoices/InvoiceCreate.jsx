import React from 'react'
import InvoiceGenerate from "../../components/invoices/InvoiceGenerate.jsx"
import { useLocation } from 'react-router-dom';

function InvoiceCreate() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const transactionId = params.get('transactionId');
  return (
   <>
   <div>
      <div className=''>Create Invoice:</div>
      <div>
         <InvoiceGenerate transactionId={transactionId} />
      </div>
   </div>
   
   </>   
)
}

export default InvoiceCreate