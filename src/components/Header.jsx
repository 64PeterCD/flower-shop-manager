import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { shop } from '../data/shop.js'
import useAuth from '../hooks/useAuth.js'
import BrandMark from './BrandMark.jsx'
import './Layout.css'

const MENU = [
  { to: '/', label: 'Trang chủ', end: true },
  { to: '/about-us', label: 'Giới thiệu' },
  { to: '/products', label: 'Sản phẩm' },
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
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <BrandMark />
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
          <div className="main-nav__links">
            {MENU.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} onClick={closeMenu}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="main-nav__account">
            {isAdmin && (
              <Link to="/admin" className="btn btn--outline btn--sm" onClick={closeMenu}>
                Quản lý shop
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <span className="main-nav__user" title={user.email}>
                  {user.email}
                </span>
                <button type="button" className="main-nav__text-btn" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="main-nav__text-link" onClick={closeMenu}>
                  Đăng nhập
                </NavLink>
                <NavLink to="/register" className="main-nav__text-link" onClick={closeMenu}>
                  Đăng ký
                </NavLink>
              </>
            )}
            <Link to="/order" className="btn btn--primary btn--sm" onClick={closeMenu}>
              Đặt hoa
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
