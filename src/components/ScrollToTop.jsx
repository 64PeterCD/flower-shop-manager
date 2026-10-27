import { useEffect } from 'react'
import { useLocation } from 'react-router'

// Chuyển trang bằng react-router không tự cuộn lên đầu, nên làm thủ công khi đường dẫn đổi.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
