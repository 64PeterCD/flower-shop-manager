// Logo: khung vòm (cửa sổ tiệm hoa) + một bông hoa năm cánh.
export default function BrandMark({ size = 34 }) {
  return (
    <svg className="brand__mark" viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" focusable="false">
      <path d="M4 30V15a12 12 0 0 1 24 0v15z" fill="#e6f1e8" stroke="#2f6b45" strokeWidth="1.6" />
      <path d="M16 20v10" stroke="#2f6b45" strokeWidth="1.8" strokeLinecap="round" />
      <g transform="translate(16 14)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse key={angle} cy="-5.4" rx="3.1" ry="4.2" fill="#c2255c" transform={`rotate(${angle})`} />
        ))}
        <circle r="2.8" fill="#f4b73f" />
      </g>
    </svg>
  )
}
