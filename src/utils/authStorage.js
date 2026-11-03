// Lưu phiên đăng nhập trong localStorage để tải lại trang vẫn còn đăng nhập.
// Giá trị lưu: { token, expiresAt, user: { id, email, role } }
const KEY = 'sachoa.auth'

export const AUTH_KEY = KEY

export function loadAuth() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    // Dữ liệu hỏng hoặc token đã hết hạn thì bỏ luôn.
    if (!data?.token || !data?.user || !(new Date(data.expiresAt) > new Date())) {
      localStorage.removeItem(KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

export function saveAuth(auth) {
  try {
    localStorage.setItem(KEY, JSON.stringify(auth))
  } catch {
    // localStorage bị chặn (chế độ riêng tư...): phiên hiện tại vẫn dùng được, chỉ không nhớ sau khi tải lại.
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // bỏ qua, xem ghi chú ở saveAuth
  }
}
