import { Link, useLocation } from 'react-router'
import Bouquet from '../components/Bouquet.jsx'
import usePageTitle from '../hooks/usePageTitle.js'
import './Pages.css'

// Route path="*": bắt mọi URL không khớp route nào.
export default function NotFound() {
  usePageTitle('Không tìm thấy trang')
  const { pathname } = useLocation()

  return (
    <section className="section">
      <div className="container notfound">
        <div className="notfound__art" aria-hidden="true">
          <Bouquet color="#c9b6bd" kinds={['daisy']} seed={0} />
        </div>
        <h1>Không tìm thấy trang này</h1>
        <p className="muted">Đường dẫn "{pathname}" không tồn tại. Có thể trang đã được chuyển đi hoặc bạn gõ nhầm địa chỉ.</p>
        <Link to="/" className="btn btn--primary">Về trang chủ</Link>
      </div>
    </section>
  )
}
