import { Link, NavLink, Outlet } from 'react-router'
import { shop } from '../data/shop.js'
import ScrollToTop from './ScrollToTop.jsx'
import './Layout.css'

const ADMIN_MENU = [
  { to: '/admin', label: 'Tổng quan', end: true },
  { to: '/admin/orders', label: 'Đơn hàng' },
  { to: '/admin/products', label: 'Sản phẩm & kho' },
]

// Khung của khu quản lý (/admin/...): thanh bên + nội dung từng trang con.
export default function AdminLayout() {
  return (
    <div className="admin">
      <ScrollToTop />
      <aside className="admin__sidebar">
        <Link to="/" className="brand brand--light">
          <span className="brand__mark" aria-hidden="true">✿</span>
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
        <Link to="/" className="admin__back">← Về trang web</Link>
      </aside>
      <div className="admin__content">
        <Outlet />
      </div>
    </div>
  )
}
