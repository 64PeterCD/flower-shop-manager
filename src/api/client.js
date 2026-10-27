import axios from 'axios'

// Một "instance" Axios dùng chung: mọi request tự ghép baseURL và header JSON.
// Đổi địa chỉ API bằng biến môi trường VITE_API_URL (xem .env.example).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5080/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// Đưa lỗi của Axios về một câu tiếng Việt để hiện cho người dùng.
export function getErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (data) {
      // ASP.NET Core trả lỗi theo chuẩn ProblemDetails; lỗi kiểm tra dữ liệu có thêm "errors".
      const firstValidation = data.errors ? Object.values(data.errors).flat()[0] : null
      return firstValidation ?? data.detail ?? data.title ?? `Lỗi ${error.response.status}`
    }
    if (error.code === 'ECONNABORTED') return 'Máy chủ phản hồi quá lâu, vui lòng thử lại.'
    return 'Không kết nối được máy chủ API. Hãy kiểm tra back-end đã chạy chưa.'
  }
  return error instanceof Error ? error.message : 'Đã có lỗi xảy ra.'
}
