import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { shop } from '../data/shop.js'
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
  const closeMenu = () => setOpen(false)

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
          <Link to="/admin" className="btn btn--primary btn--sm" onClick={closeMenu}>
            Quản lý shop
          </Link>
        </nav>
      </div>
    </header>
  )
}
