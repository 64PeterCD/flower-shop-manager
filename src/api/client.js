import axios from 'axios'
import { clearAuth, loadAuth } from '../utils/authStorage.js'

// Phát ra khi server từ chối token (hết hạn / bị thu hồi) để AuthContext đăng xuất người dùng.
export const AUTH_EXPIRED_EVENT = 'sachoa:auth-expired'

// Một "instance" Axios dùng chung: mọi request tự ghép baseURL và header JSON.
// Đổi địa chỉ API bằng biến môi trường VITE_API_URL (xem .env.example).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Request interceptor: nếu đang đăng nhập thì tự gắn "Authorization: Bearer <token>" vào mọi request.
api.interceptors.request.use((config) => {
  const auth = loadAuth()
  if (auth) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

// Response interceptor: 401 trên request có gửi token nghĩa là phiên đã hết hạn -> xóa phiên và báo cho ứng dụng.
// (Đăng nhập sai mật khẩu cũng trả 401 nhưng request đó không mang token nên không bị tính.)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      clearAuth()
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
    }
    return Promise.reject(error)
  },
)

// Đưa lỗi của Axios về một câu tiếng Việt để hiện cho người dùng.
export function getErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data
    if (data && typeof data === 'object') {
      // ASP.NET Core trả lỗi theo chuẩn ProblemDetails; lỗi kiểm tra dữ liệu có thêm "errors".
      const firstValidation = data.errors ? Object.values(data.errors).flat()[0] : null
      const message = firstValidation ?? data.detail ?? data.title
      if (message) return message
    }
    if (status === 401) return 'Bạn cần đăng nhập để thực hiện thao tác này.'
    if (status === 403) return 'Tài khoản của bạn không có quyền thực hiện thao tác này.'
    if (status) return `Lỗi ${status}`
    if (error.code === 'ECONNABORTED') return 'Máy chủ phản hồi quá lâu, vui lòng thử lại.'
    return 'Không kết nối được máy chủ API. Hãy kiểm tra back-end đã chạy chưa.'
  }
  return error instanceof Error ? error.message : 'Đã có lỗi xảy ra.'
}

// Lỗi kiểm tra dữ liệu theo từng ô: { Email: ["..."] } -> { email: "..." } để hiện ngay dưới ô nhập tương ứng.
export function getFieldErrors(error) {
  const errors = axios.isAxiosError(error) ? error.response?.data?.errors : null
  if (!errors) return {}
  return Object.fromEntries(
    Object.entries(errors).map(([key, messages]) => [key.charAt(0).toLowerCase() + key.slice(1), messages[0]]),
  )
}
