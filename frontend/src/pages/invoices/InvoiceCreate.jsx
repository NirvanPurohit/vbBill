import React from 'react'
import InvoiceGenerate from "../../components/invoices/InvoiceGenerate.jsx"
function InvoiceCreate() {
  return (
   <>
   <div>
      <div className=''>Create Invoice:</div>
      <div>
         <InvoiceGenerate />
      </div>
   </div>
   
   </>   
)
}

export default InvoiceCreate