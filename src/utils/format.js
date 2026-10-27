// 450000 -> "450.000đ"
export function formatPrice(value) {
  return `${value.toLocaleString('vi-VN')}đ`
}
