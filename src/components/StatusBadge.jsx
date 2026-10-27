import './Cards.css'

const TONES = {
  Mới: 'info',
  'Đang chuẩn bị': 'warn',
  'Đang giao': 'warn',
  'Hoàn thành': 'ok',
  'Đã hủy': 'bad',
  'Còn hàng': 'ok',
  'Sắp hết': 'warn',
  'Hết hàng': 'bad',
}

export default function StatusBadge({ label }) {
  return <span className={`badge badge--${TONES[label] ?? 'info'}`}>{label}</span>
}
