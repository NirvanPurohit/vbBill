import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ItemNew from './pages/master/ItemNew.jsx';
import ItemList from './pages/master/ItemList.jsx';
import ItemUpdate from './pages/master/ItemUpdate.jsx';
export default function App() {
  return (
    <>
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/masters/item/newitem" element={<ItemNew />} />
        <Route path="/masters/item/items" element={<ItemList />} />
        <Route path="/masters/item/update/:id" element={<ItemUpdate />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
    </>
  );
}
