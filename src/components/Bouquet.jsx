import { bloomKinds } from '../utils/bloomKinds.js'
import { mix, shade } from '../utils/color.js'
import './Bouquet.css'

// Tranh bó hoa vẽ bằng SVG, không cần file ảnh. Màu lấy từ màu cánh hoa của sản phẩm,
// loại hoa lấy từ mô tả "Thành phần" (vd. "Hồng đỏ, baby trắng, lá bạc" -> hoa hồng).

/* ---------- Các loại hoa: vẽ quanh gốc (0,0), bán kính khoảng 23 ---------- */

function Rose({ color }) {
  const dark = shade(color, -0.25)
  const mid = shade(color, -0.1)
  return (
    <g>
      {[0, 72, 144, 216, 288].map((angle) => (
        <ellipse key={angle} cy="-11" rx="11" ry="12" fill={mid} stroke={dark} strokeWidth="0.8" transform={`rotate(${angle})`} />
      ))}
      <circle r="11" fill={color} stroke={dark} strokeWidth="0.8" />
      <path
        d="M-6 -2C-6 -9 6 -9 6 -2C6 5 -3 6 -3 0C-3 -3 2 -3 2 -1"
        fill="none"
        stroke={dark}
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </g>
  )
}

function Daisy({ color, petals = 12, length = 10, center = '#f2b632', ring = '#b9831a' }) {
  const edge = shade(color, -0.3)
  return (
    <g>
      {Array.from({ length: petals }, (_, i) => (
        <ellipse
          key={i}
          cy={-(23 - length)}
          rx={petals > 14 ? 3.4 : 4.4}
          ry={length}
          fill={color}
          stroke={edge}
          strokeWidth="0.6"
          transform={`rotate(${(360 / petals) * i})`}
        />
      ))}
      <circle r={petals > 14 ? 8.5 : 6} fill={center} stroke={ring} strokeWidth="0.8" />
      {petals > 14 && <circle r="4" fill="none" stroke={ring} strokeWidth="0.8" strokeDasharray="1.5 2" />}
    </g>
  )
}

function Tulip({ color }) {
  const dark = shade(color, -0.28)
  const mid = shade(color, -0.12)
  return (
    <g transform="translate(0 14)">
      <path d="M-14 -4C-16 -20 -9 -30 -2 -34C-2 -22 -4 -10 0 6C-6 6 -12 4 -14 -4Z" fill={mid} stroke={dark} strokeWidth="0.8" />
      <path d="M14 -4C16 -20 9 -30 2 -34C2 -22 4 -10 0 6C6 6 12 4 14 -4Z" fill={mid} stroke={dark} strokeWidth="0.8" />
      <path d="M-8 4C-12 -14 -4 -28 0 -36C4 -28 12 -14 8 4C4 8 -4 8 -8 4Z" fill={color} stroke={dark} strokeWidth="0.8" />
    </g>
  )
}

const FLORETS = [
  [0, 0], [11, 0], [-11, 0], [5.5, 10], [-5.5, 10], [5.5, -10], [-5.5, -10],
  [16.5, 10], [-16.5, 10], [16.5, -10], [-16.5, -10], [0, 20], [0, -20], [11, 20], [-11, 20], [11, -20], [-11, -20],
]

function Hydrangea({ color }) {
  const dark = shade(color, -0.25)
  return (
    <g>
      {FLORETS.map(([x, y], i) => {
        const tone = shade(color, i % 3 === 0 ? 0.14 : i % 3 === 1 ? -0.06 : 0.04)
        return (
          <g key={`${x},${y}`} transform={`translate(${x} ${y})`}>
            {[0, 90, 180, 270].map((angle) => (
              <circle key={angle} cy="-3.6" r="4.2" fill={tone} stroke={dark} strokeWidth="0.5" transform={`rotate(${angle})`} />
            ))}
            <circle r="1.6" fill={shade(color, 0.55)} />
          </g>
        )
      })}
    </g>
  )
}

function Bloom({ kind, color }) {
  switch (kind) {
    case 'sunflower':
      return <Daisy color={color} petals={18} length={11} center="#5a3a1b" ring="#3a230e" />
    case 'tulip':
      return <Tulip color={color} />
    case 'hydrangea':
      return <Hydrangea color={color} />
    case 'daisy':
      return <Daisy color={color} />
    default:
      return <Rose color={color} />
  }
}

/* ---------- Bố cục bó hoa (khung 240 x 300) ---------- */

const LEAF = 'M0 0C-9 -12 -9 -32 0 -52C9 -32 9 -12 0 0Z'
const LEAVES = [[-78, 1.15], [-56, 1.4], [-34, 1.6], [-12, 1.5], [12, 1.5], [34, 1.6], [56, 1.4], [78, 1.15]]
const GREENS = ['#2f6b45', '#3d8355', '#245a39']

// [x, y, tỉ lệ, góc xoay] của 5 bông; bông đầu tiên là bông chính.
const LAYOUTS = [
  [[120, 88, 1.5, 0], [70, 120, 1.15, -12], [170, 118, 1.2, 10], [94, 154, 0.95, -6], [148, 156, 1, 8]],
  [[122, 82, 1.4, 6], [78, 108, 1.2, -10], [164, 106, 1.1, 12], [58, 144, 0.9, -14], [184, 146, 0.95, 14]],
  [[118, 94, 1.45, -6], [72, 126, 1.1, -8], [168, 130, 1.15, 12], [118, 150, 1, 0], [96, 66, 0.8, -18]],
]
const TONES = [0, -0.07, 0.07, -0.04, 0.05]
const FILLERS = [[52, 98], [186, 92], [122, 48]]
const TIE = [120, 214] // chỗ các cuống tụ lại

export default function Bouquet({ color = '#d9506f', flowers = '', kinds, seed = 0, grow = false, className = '' }) {
  const list = kinds ?? bloomKinds(flowers)
  const layout = LAYOUTS[Math.abs(seed) % LAYOUTS.length]
  const paperBack = mix(color, '#ffffff', 0.68)
  const paperFront = mix(color, '#ffffff', 0.82)
  const ribbon = shade(color, -0.22)
  const fold = shade(color, -0.12)

  return (
    <svg
      className={`bouquet ${grow ? 'bouquet--grow' : ''} ${className}`}
      viewBox="0 28 240 272"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      {/* lá phía sau */}
      <g transform="translate(120 192)">
        {LEAVES.map(([angle, scale], i) => (
          <path key={angle} d={LEAF} fill={GREENS[i % 3]} transform={`rotate(${angle}) scale(${scale})`} />
        ))}
      </g>

      {/* cuống */}
      <g fill="none" stroke="#2f6b45" strokeLinecap="round">
        {layout.map(([x, y], i) => (
          <path
            key={`stem-${i}`}
            className="stem"
            pathLength="1"
            strokeWidth="3"
            style={{ '--i': i }}
            d={`M${x} ${y} Q${(x + TIE[0]) / 2} ${(y + TIE[1]) / 2 + 10} ${TIE[0]} ${TIE[1]}`}
          />
        ))}
        {FILLERS.map(([x, y], i) => (
          <path
            key={`filler-${i}`}
            className="stem"
            pathLength="1"
            strokeWidth="1.6"
            style={{ '--i': i + 1 }}
            d={`M${x} ${y} Q${(x + TIE[0]) / 2} ${(y + TIE[1]) / 2} ${TIE[0]} ${TIE[1]}`}
          />
        ))}
      </g>

      {/* hoa baby */}
      {FILLERS.map(([x, y]) => (
        <g key={`dots-${x}`} fill="#ffffff" stroke="#c7d3cb" strokeWidth="0.6">
          {[[0, 0], [-6, 5], [6, 4], [-3, -6], [4, -7]].map(([dx, dy]) => (
            <circle key={`${dx},${dy}`} cx={x + dx} cy={y + dy} r="2.6" />
          ))}
        </g>
      ))}

      {/* các bông hoa: vẽ bông phụ trước, bông chính sau cùng cho nổi lên trên */}
      {[...layout.keys()]
        .reverse()
        .map((i) => {
          const [x, y, scale, angle] = layout[i]
          const kind = list[i % list.length]
          return (
            <g key={`bloom-${i}`} transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
              <g className="bloom" style={{ '--i': i }}>
                <Bloom kind={kind} color={shade(color, TONES[i])} />
              </g>
            </g>
          )
        })}

      {/* giấy gói và nơ */}
      <path d="M50 150Q120 176 190 150L130 296H110Z" fill={paperBack} stroke={fold} strokeWidth="0.8" />
      <path d="M50 150L150 186L128 296H112Z" fill={paperFront} stroke={fold} strokeWidth="0.8" />
      <path d="M150 186L122 296" stroke={fold} strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M77 210Q120 224 163 210L161 225Q120 239 79 225Z" fill={ribbon} />
      <path d="M120 218C100 198 82 212 98 226C108 232 116 226 120 218Z" fill={ribbon} />
      <path d="M120 218C140 198 158 212 142 226C132 232 124 226 120 218Z" fill={ribbon} />
      <path d="M118 224L106 258M122 224L134 258" stroke={ribbon} strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="120" cy="219" r="5" fill={shade(color, -0.32)} />
    </svg>
  )
}
