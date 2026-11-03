import { Link } from 'react-router'
import { shop } from '../data/shop.js'
import useAuth from '../hooks/useAuth.js'
import Icon from './Icon.jsx'
import './Layout.css'

export default function Footer() {
  const { isAdmin } = useAuth()

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__brand">{shop.name}</p>
          <p className="site-footer__tagline">Hoa tươi cắm tay mỗi ngày, giao đúng khung giờ bạn chọn.</p>
        </div>

        <nav aria-label="Liên kết cuối trang">
          <h2 className="site-footer__title">Khám phá</h2>
          <ul>
            <li><Link to="/products">Sản phẩm</Link></li>
            <li><Link to="/order">Đặt hoa online</Link></li>
            <li><Link to="/about-us">Về Sắc Hoa</Link></li>
            {isAdmin && <li><Link to="/admin">Trang quản lý</Link></li>}
          </ul>
        </nav>

        <div>
          <h2 className="site-footer__title">Ghé tiệm</h2>
          <ul className="site-footer__contact">
            <li><Icon name="pin" size={18} /> {shop.address}</li>
            <li><Icon name="clock" size={18} /> {shop.hours}</li>
            <li><Icon name="phone" size={18} /> <a href={`tel:${shop.phone.replace(/\s/g, '')}`}>{shop.phone}</a></li>
            <li><Icon name="mail" size={18} /> <a href={`mailto:${shop.email}`}>{shop.email}</a></li>
          </ul>
        </div>
      </div>
      <p className="site-footer__copy">© 2026 {shop.name} · Bài thực hành môn Lập trình web</p>
    </footer>
  )
}
