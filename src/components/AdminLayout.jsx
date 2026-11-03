import { Link, NavLink, Outlet } from 'react-router'
import { shop } from '../data/shop.js'
import useAuth from '../hooks/useAuth.js'
import BrandMark from './BrandMark.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import './Layout.css'

const ADMIN_MENU = [
  { to: '/admin', label: 'Tổng quan', end: true },
  { to: '/admin/orders', label: 'Đơn hàng' },
  { to: '/admin/products', label: 'Sản phẩm & kho' },
]

// Khung của khu quản lý (/admin/...): thanh bên + nội dung từng trang con.
// Được bọc bởi <RequireAdmin> ở App.jsx nên chỉ tài khoản Admin mới vào tới đây;
// đăng xuất ở đây thì RequireAdmin tự chuyển sang /login.
export default function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="admin">
      <ScrollToTop />
      <aside className="admin__sidebar">
        <Link to="/" className="brand brand--light">
          <BrandMark />
          {shop.name}
        </Link>
        <p className="admin__label">Quản lý shop</p>
        <nav aria-label="Menu quản lý">
          {ADMIN_MENU.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin__user">
          Đăng nhập: {user.email}
          <br />
          <button type="button" onClick={logout}>Đăng xuất</button>
        </div>
        <Link to="/" className="admin__back">← Về trang web</Link>
      </aside>
      <div className="admin__content">
        <Outlet />
      </div>
    </div>
  )
}
