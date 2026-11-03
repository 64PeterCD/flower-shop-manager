import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { shop } from '../data/shop.js'
import useAuth from '../hooks/useAuth.js'
import './Layout.css'

const MENU = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/about-us', label: 'Giới thiệu' },
  { to: '/products', label: 'Sản phẩm' },
  { to: '/order', label: 'Đặt hoa' },
  { to: '/contact', label: 'Liên hệ' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const closeMenu = () => setOpen(false)

  function handleLogout() {
    closeMenu()
    logout()
    // Ở trang công khai thì về trang chủ; riêng /admin sẽ do RequireAdmin tự chuyển sang /login (kèm trang cần quay lại).
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand__mark" aria-hidden="true">✿</span>
          {shop.name}
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Đóng' : 'Menu'}
        </button>

        <nav id="main-menu" className={`main-nav ${open ? 'main-nav--open' : ''}`} aria-label="Menu chính">
          {MENU.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} onClick={closeMenu}>
              {item.label}
            </NavLink>
          ))}

          {isAdmin && (
            <Link to="/admin" className="btn btn--primary btn--sm" onClick={closeMenu}>
              Quản lý shop
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <span className="main-nav__user" title={user.email}>
                {user.email}
              </span>
              <button type="button" className="btn btn--outline btn--sm" onClick={handleLogout}>
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={closeMenu}>
                Đăng nhập
              </NavLink>
              <Link to="/register" className="btn btn--primary btn--sm" onClick={closeMenu}>
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
