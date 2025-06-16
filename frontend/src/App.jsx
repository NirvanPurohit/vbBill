import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { MasterDataProvider } from './context/MasterDataProvider.jsx';
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

export default function App() {
  return (
    <>
      <AuthProvider>
        <MasterDataProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Item Routes */}
              <Route path="/masters/item/items" element={<ItemList />} />
              <Route path="/masters/item/newitem" element={<ItemNew />} />
              <Route path="/masters/item/update/:id" element={<ItemUpdate />} />
              
              {/* Business Routes */}
              <Route path="/masters/business/list" element={<BusinessList />} />
              <Route path="/masters/business/new" element={<BusinessNew />} />
              <Route path="/masters/business/update/:id" element={<BusinessUpdate />} />
              
              {/* Lorry Routes */}
              <Route path="/masters/lorry/list" element={<LorryList />} />
              <Route path="/masters/lorry/new" element={<LorryNew />} />
              <Route path="/masters/lorry/update/:id" element={<LorryUpdate />} />
              
              {/* Site Routes */}
              <Route path="/masters/site/list" element={<SiteList />} />
              <Route path="/masters/site/new" element={<SiteNew />} />
              <Route path="/masters/site/update/:id" element={<SiteUpdate />} />
              
              {/* Supplier Routes */}
              <Route path="/masters/supplier/list" element={<SupplierList />} />
              <Route path="/masters/supplier/new" element={<SupplierNew />} />
              <Route path="/masters/supplier/update/:id" element={<SupplierUpdate />} />
            </Routes>
          </BrowserRouter>
        </MasterDataProvider>
      </AuthProvider>
    </>
  );
}
