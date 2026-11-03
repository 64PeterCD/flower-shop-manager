import './Cards.css'

// Khung xương chờ tải: giữ đúng kích thước thẻ sản phẩm nên trang không bị giật khi dữ liệu về.
export default function ProductSkeletons({ count = 4 }) {
  return (
    <div className="grid grid--4" aria-busy="true">
      <span className="visually-hidden" role="status">
        Đang tải sản phẩm...
      </span>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="skeleton-card" aria-hidden="true">
          <div className="skeleton skeleton--arch" />
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--line skeleton--short" />
        </div>
      ))}
    </div>
  )
}
