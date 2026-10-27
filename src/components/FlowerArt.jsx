const PETAL_ANGLES = [0, 60, 120, 180, 240, 300]

// Hình bông hoa vẽ bằng SVG (không cần file ảnh); đổi màu qua props.
export default function FlowerArt({ petal = '#d9506f', center = '#f5c542', className = '' }) {
  return (
    <svg className={`flower-art ${className}`} viewBox="0 0 120 170" aria-hidden="true">
      <path d="M60 80 C57 112 63 138 60 166" stroke="#4f7a5a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M60 124 C42 114 32 120 26 132 C42 138 54 134 60 124Z" fill="#6a9a76" />
      <path d="M60 140 C78 130 90 136 96 146 C80 152 68 150 60 140Z" fill="#5a8a66" />
      <g transform="translate(60 54)">
        {PETAL_ANGLES.map((angle) => (
          <ellipse key={angle} cx="0" cy="-22" rx="13" ry="22" fill={petal} transform={`rotate(${angle})`} />
        ))}
        <circle r="11" fill={center} />
      </g>
    </svg>
  )
}
