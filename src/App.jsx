import { Route, Routes } from 'react-router'
import AdminLayout from './components/AdminLayout.jsx'
import Layout from './components/Layout.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Order from './pages/Order.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Products from './pages/Products.jsx'
import Register from './pages/Register.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import Dashboard from './pages/admin/Dashboard.jsx'

// Bảng định tuyến: URL -> trang.
// Layout / AdminLayout là "route cha": vẽ khung dùng chung và chừa <Outlet /> cho trang con.
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about-us" element={<About />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:productId" element={<ProductDetail />} />
        <Route path="order" element={<Order />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* RequireAdmin: chưa đăng nhập -> /login, không phải Admin -> trang 403 */}
      <Route
        path="admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
      </Route>
    </Routes>
  )
}
