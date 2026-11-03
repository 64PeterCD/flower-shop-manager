// Kiểm tra dữ liệu phía trình duyệt cho form đăng ký / đăng nhập.
// Quy tắc phải khớp với API (RegisterRequest) — API vẫn kiểm tra lại vì không thể tin dữ liệu từ client.

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export function validateEmail(value) {
  if (!value) return 'Vui lòng nhập email.'
  if (value.length > 254) return 'Email tối đa 254 ký tự.'
  if (!EMAIL_PATTERN.test(value)) return 'Email không hợp lệ.'
  return ''
}

export function validateNewPassword(value) {
  if (!value) return 'Vui lòng nhập mật khẩu.'
  if (value.length < 8 || value.length > 100) return 'Mật khẩu phải từ 8 đến 100 ký tự.'
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Mật khẩu cần có ít nhất một chữ cái và một chữ số.'
  return ''
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return 'Vui lòng nhập lại mật khẩu.'
  if (confirm !== password) return 'Mật khẩu nhập lại chưa khớp.'
  return ''
}

// Bỏ các lỗi rỗng để dễ kiểm tra "form có hợp lệ không": Object.keys(errors).length === 0
export function compactErrors(errors) {
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message))
}
