import { Link, useLocation } from 'react-router'
import FlowerArt from '../components/FlowerArt.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import './Pages.css'

// Route path="*": bắt mọi URL không khớp route nào.
export default function NotFound() {
  usePageTitle('Không tìm thấy trang')
  const { pathname } = useLocation()

  return (
    <section className="section">
      <div className="container notfound">
        <FlowerArt petal="#c9b6bd" className="notfound__art" />
        <p className="eyebrow">Lỗi 404</p>
        <h1>Không tìm thấy trang</h1>
        <p className="muted">Đường dẫn "{pathname}" không tồn tại.</p>
        <Link to="/" className="btn btn--primary">Về trang chủ</Link>
      </div>
    </section>
  )
}
