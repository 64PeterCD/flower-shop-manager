import { Link } from 'react-router'
import { shop } from '../data/shop.js'
import './Layout.css'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <p className="site-footer__brand">✿ {shop.name}</p>
          <p>{shop.tagline}</p>
        </div>
        <div>
          <h3>Khám phá</h3>
          <ul>
            <li><Link to="/products">Sản phẩm</Link></li>
            <li><Link to="/order">Đặt hoa online</Link></li>
            <li><Link to="/about-us">Về Sắc Hoa</Link></li>
            <li><Link to="/admin">Trang quản lý</Link></li>
          </ul>
        </div>
        <div>
          <h3>Liên hệ</h3>
          <ul>
            <li>{shop.address}</li>
            <li>{shop.phone}</li>
            <li>{shop.email}</li>
            <li>{shop.hours}</li>
          </ul>
        </div>
      </div>
      <p className="site-footer__copy">© 2026 {shop.name} · Bài thực hành môn Lập trình web</p>
    </footer>
  )
}
