import { Link, Navigate, useLocation } from 'react-router'
import useAuth from '../hooks/useAuth.js'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

// Chặn khu /admin ở phía giao diện: chưa đăng nhập -> chuyển tới /login; không phải Admin -> báo không có quyền.
// Đây chỉ là bước cho người dùng dễ hiểu; việc chặn thật sự do API làm (401/403) vì code ở trình duyệt có thể bị sửa.
export default function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="site-main">
          <section className="section">
            <div className="container notfound">
              <h1>Bạn không có quyền vào trang quản lý</h1>
              <p className="muted">
                Tài khoản {user.email} là tài khoản khách hàng. Hãy đăng xuất rồi đăng nhập bằng tài khoản quản trị.
              </p>
              <Link to="/" className="btn btn--primary">Về trang chủ</Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return children
}
