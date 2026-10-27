import { Outlet } from 'react-router'
import Footer from './Footer.jsx'
import Header from './Header.jsx'
import ScrollToTop from './ScrollToTop.jsx'

// Khung chung của các trang công khai: <Outlet /> là chỗ route con được vẽ vào.
export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
