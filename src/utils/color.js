// Tiện ích màu: pha màu cho tranh bó hoa và gom màu cánh hoa thành các "sắc" để chọn / lọc.

function parse(hex) {
  const value = hex.replace('#', '')
  const full = value.length === 3 ? [...value].map((c) => c + c).join('') : value
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function toHex({ r, g, b }) {
  return `#${[r, g, b].map((n) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0')).join('')}`
}

// Pha màu `hex` với `other` theo tỉ lệ 0..1 (0 = giữ nguyên hex, 1 = hoàn toàn là other).
export function mix(hex, other, ratio) {
  const a = parse(hex)
  const b = parse(other)
  return toHex({ r: a.r + (b.r - a.r) * ratio, g: a.g + (b.g - a.g) * ratio, b: a.b + (b.b - a.b) * ratio })
}

// amount > 0: sáng hơn (pha trắng); amount < 0: tối hơn (pha đen).
export function shade(hex, amount) {
  return mix(hex, amount < 0 ? '#000000' : '#ffffff', Math.abs(amount))
}

function toHsl(hex) {
  const { r, g, b } = parse(hex)
  const [rn, gn, bn] = [r / 255, g / 255, b / 255]
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  const d = max - min
  if (d === 0) return { h: 0, s: 0, l }
  const s = d / (1 - Math.abs(2 * l - 1))
  let h
  if (max === rn) h = ((gn - bn) / d) % 6
  else if (max === gn) h = (bn - rn) / d + 2
  else h = (rn - gn) / d + 4
  return { h: (h * 60 + 360) % 360, s, l }
}

// Các "sắc hoa" khách hay chọn theo; `swatch` là màu đại diện để vẽ ô chọn và bó hoa minh họa.
export const COLOR_FAMILIES = [
  { id: 'do', label: 'Đỏ', swatch: '#c2274b' },
  { id: 'hong', label: 'Hồng', swatch: '#ec7fa6' },
  { id: 'cam', label: 'Cam', swatch: '#ee8a33' },
  { id: 'vang', label: 'Vàng', swatch: '#f2b01e' },
  { id: 'tim-xanh', label: 'Xanh tím', swatch: '#8fa8e8' },
  { id: 'trang', label: 'Trắng', swatch: '#efe9e4' },
]

export function getColorFamily(id) {
  return COLOR_FAMILIES.find((family) => family.id === id)
}

// Xếp một mã màu cánh hoa vào một sắc.
export function colorFamily(hex) {
  const { h, s, l } = toHsl(hex)
  if (l > 0.86 || s < 0.12) return 'trang'
  if (h >= 200 && h < 290) return 'tim-xanh'
  if (h >= 15 && h < 38) return 'cam'
  if (h >= 38 && h < 70) return 'vang'
  // Hồng / đỏ nằm quanh vòng 290°–15°: đậm thì là đỏ, nhạt hơn là hồng.
  if ((h >= 335 || h < 15) && l < 0.55) return 'do'
  return 'hong'
}
