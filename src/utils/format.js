// 450000 -> "450.000đ"
export function formatPrice(value) {
  return `${value.toLocaleString('vi-VN')}đ`
}

// "2026-10-27" -> "27/10/2026"
export function formatDate(isoDate) {
  return isoDate.split('-').reverse().join('/')
}
