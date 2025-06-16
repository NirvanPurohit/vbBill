import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { MasterDataProvider } from './context/MasterDataProvider.jsx';
import { TransactionProvider } from './context/TransactionContext.jsx';
import { InvoiceProvider } from './context/InvoiceContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ItemNew from './pages/master/Item/ItemNew.jsx';
import ItemList from './pages/master/Item/ItemList.jsx';
import ItemUpdate from './pages/master/Item/ItemUpdate.jsx';
import BusinessList from './pages/master/Business/BusinessList.jsx';
import BusinessNew from './pages/master/Business/BusinessNew.jsx';
import BusinessUpdate from './pages/master/Business/BusinessUpdate.jsx';
import LorryList from './pages/master/Lorry/LorryList.jsx';
import LorryNew from './pages/master/Lorry/LorryNew.jsx';
import LorryUpdate from './pages/master/Lorry/LorryUpdate.jsx';
import SiteList from './pages/master/Site/SiteList.jsx';
import SiteNew from './pages/master/Site/SiteNew.jsx';
import SiteUpdate from './pages/master/Site/SiteUpdate.jsx';
import SupplierList from './pages/master/Supplier/SupplierList.jsx';
import SupplierNew from './pages/master/Supplier/SupplierNew.jsx';
import SupplierUpdate from './pages/master/Supplier/SupplierUpdate.jsx';
import Navbar from './components/Navbar.jsx';

// Transaction and Invoice pages
import TransactionList from './pages/transactions/TransactionList.jsx';
import CreateTransaction from './pages/transactions/CreateTransaction.jsx';
import UpdateTransaction from './pages/transactions/UpdateTransaction.jsx';
import InvoiceList from './pages/invoices/InvoiceList.jsx';
import InvoiceView from './pages/invoices/InvoiceView.jsx';
import TransactionListPage from "./pages/transactions/TransactionList.jsx";
import InvoiceCreatePage from "./pages/invoices/InvoiceCreate.jsx";
import InvoicePreview from "./components/invoices/InvoiceGeneration/InvoicePreview.jsx";

export default function App() {
  return (
    <AuthProvider>
      <MasterDataProvider>
        <TransactionProvider>
          <InvoiceProvider>
            <BrowserRouter>
              <Navbar />
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />

                {/* Transaction Routes */}
                <Route path="/transactions" element={
                  <ProtectedRoute>
                    <TransactionListPage />
                  </ProtectedRoute>
                } />
                <Route path="/transactions/new" element={
                  <ProtectedRoute>
                    <CreateTransaction />
                  </ProtectedRoute>
                } />
                <Route path="/transactions/:id" element={
                  <ProtectedRoute>
                    <UpdateTransaction />
                  </ProtectedRoute>
                } />

                {/* Invoice Routes */}
                <Route path="/invoice" element={
                  <ProtectedRoute>
                    <InvoiceCreatePage />
                  </ProtectedRoute>
                } />
                <Route path="/invoices" element={
                  <ProtectedRoute>
                    <InvoiceList />
                  </ProtectedRoute>
                } />
                <Route path="/invoices/:id" element={
                  <ProtectedRoute>
                    <InvoiceView />
                  </ProtectedRoute>
                } />
                <Route path="/invoices/preview" element={
                  <ProtectedRoute>
                    <InvoicePreview />
                  </ProtectedRoute>
                } />

                {/* Item Routes */}
                <Route path="/masters/item/items" element={
                  <ProtectedRoute>
                    <ItemList />
                  </ProtectedRoute>
                } />
                <Route path="/masters/item/newitem" element={
                  <ProtectedRoute>
                    <ItemNew />
                  </ProtectedRoute>
                } />
                <Route path="/masters/item/update/:id" element={
                  <ProtectedRoute>
                    <ItemUpdate />
                  </ProtectedRoute>
                } />

                {/* Business Routes */}
                <Route path="/masters/business/list" element={
                  <ProtectedRoute>
                    <BusinessList />
                  </ProtectedRoute>
                } />
                <Route path="/masters/business/new" element={
                  <ProtectedRoute>
                    <BusinessNew />
                  </ProtectedRoute>
                } />
                <Route path="/masters/business/update/:id" element={
                  <ProtectedRoute>
                    <BusinessUpdate />
                  </ProtectedRoute>
                } />

                {/* Lorry Routes */}
                <Route path="/masters/lorry/list" element={
                  <ProtectedRoute>
                    <LorryList />
                  </ProtectedRoute>
                } />
                <Route path="/masters/lorry/new" element={
                  <ProtectedRoute>
                    <LorryNew />
                  </ProtectedRoute>
                } />
                <Route path="/masters/lorry/update/:id" element={
                  <ProtectedRoute>
                    <LorryUpdate />
                  </ProtectedRoute>
                } />

                {/* Site Routes */}
                <Route path="/masters/site/list" element={
                  <ProtectedRoute>
                    <SiteList />
                  </ProtectedRoute>
                } />
                <Route path="/masters/site/new" element={
                  <ProtectedRoute>
                    <SiteNew />
                  </ProtectedRoute>
                } />
                <Route path="/masters/site/update/:id" element={
                  <ProtectedRoute>
                    <SiteUpdate />
                  </ProtectedRoute>
                } />

                {/* Supplier Routes */}
                <Route path="/masters/supplier/list" element={
                  <ProtectedRoute>
                    <SupplierList />
                  </ProtectedRoute>
                } />
                <Route path="/masters/supplier/new" element={
                  <ProtectedRoute>
                    <SupplierNew />
                  </ProtectedRoute>
                } />
                <Route path="/masters/supplier/update/:id" element={
                  <ProtectedRoute>
                    <SupplierUpdate />
                  </ProtectedRoute>
                } />
              </Routes>
            </BrowserRouter>
          </InvoiceProvider>
        </TransactionProvider>
      </MasterDataProvider>
    </AuthProvider>
  );
}
