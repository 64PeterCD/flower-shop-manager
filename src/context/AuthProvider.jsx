import { useCallback, useEffect, useMemo, useState } from 'react'
import { getMe, login as loginRequest, register as registerRequest } from '../api/auth.js'
import { AUTH_EXPIRED_EVENT } from '../api/client.js'
import { AUTH_KEY, clearAuth, loadAuth, saveAuth } from '../utils/authStorage.js'
import { AuthContext } from './AuthContext.js'

// Giữ trạng thái đăng nhập cho cả ứng dụng. Nguồn dữ liệu gốc là localStorage (xem utils/authStorage.js),
// state React chỉ là bản sao để giao diện tự vẽ lại khi đăng nhập / đăng xuất.
export default function AuthProvider({ children }) {
  // Đọc localStorage ngay ở lần render đầu: tải lại trang vẫn thấy mình đã đăng nhập, không bị "nháy" sang trạng thái khách.
  const [auth, setAuth] = useState(loadAuth)

  const logout = useCallback(() => {
    clearAuth()
    setAuth(null)
  }, [])

  // Mở lại trang: hỏi server xem token còn hợp lệ không và lấy vai trò mới nhất.
  // Token hết hạn / sai thì request trả 401 và interceptor của Axios phát sự kiện đăng xuất (xem hiệu ứng bên dưới).
  useEffect(() => {
    const saved = loadAuth()
    if (!saved) return undefined

    let ignore = false
    getMe()
      .then((user) => {
        const current = loadAuth()
        if (ignore || !current || current.token !== saved.token) return // đã đăng xuất / đăng nhập lại trong lúc chờ
        const next = { ...current, user }
        saveAuth(next)
        setAuth(next)
      })
      .catch(() => {}) // lỗi mạng: giữ nguyên phiên, thử lại ở lần gọi API sau
    return () => {
      ignore = true
    }
  }, [])

  // Đồng bộ: server báo hết phiên, hoặc người dùng đăng nhập / đăng xuất ở tab khác.
  useEffect(() => {
    const onExpired = () => setAuth(null)
    const onStorage = (event) => {
      if (event.key === AUTH_KEY || event.key === null) setAuth(loadAuth())
    }
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  // Tự đăng xuất đúng lúc token hết hạn khi người dùng vẫn mở trang.
  const expiresAt = auth?.expiresAt
  useEffect(() => {
    if (!expiresAt) return undefined
    const timer = setTimeout(logout, Math.max(new Date(expiresAt) - Date.now(), 0))
    return () => clearTimeout(timer)
  }, [expiresAt, logout])

  // Lưu phiên mới (từ đăng nhập hoặc đăng ký) vào localStorage và state.
  const startSession = useCallback((response) => {
    const next = { token: response.token, expiresAt: response.expiresAt, user: response.user }
    saveAuth(next)
    setAuth(next)
    return response.user
  }, [])

  const login = useCallback(
    async (email, password) => startSession(await loginRequest({ email, password })),
    [startSession],
  )

  const register = useCallback(
    async (email, password) => startSession(await registerRequest({ email, password })),
    [startSession],
  )

  const value = useMemo(
    () => ({
      user: auth?.user ?? null,
      isAuthenticated: auth !== null,
      isAdmin: auth?.user.role === 'Admin',
      login,
      register,
      logout,
    }),
    [auth, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
