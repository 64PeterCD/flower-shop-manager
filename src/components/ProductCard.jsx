import { Link } from 'react-router'
import { LOW_STOCK } from '../data/shop.js'
import { formatPrice } from '../utils/format.js'
import Bouquet from './Bouquet.jsx'
import Icon from './Icon.jsx'
import './Cards.css'

export default function ProductCard({ product }) {
  const soldOut = product.stock === 0
  const low = !soldOut && product.stock <= LOW_STOCK
  const detail = `/products/${product.id}`

  return (
    <article className="product-card">
      {/* Khung ảnh chỉ là lối tắt cho chuột; bàn phím và trình đọc màn hình dùng liên kết ở tên sản phẩm */}
      <Link to={detail} className="product-card__frame" style={{ '--tone': product.petalColor }} tabIndex={-1} aria-hidden="true">
        <Bouquet color={product.petalColor} flowers={product.flowers} seed={product.id} />
        {soldOut && <span className="product-card__badge">Hết hàng</span>}
      </Link>

      <div className="product-card__info">
        <p className="product-card__category">{product.categoryName}</p>
        <h3>
          <Link to={detail}>{product.name}</Link>
        </h3>
        <div className="product-card__foot">
          <span className="price-tag">{formatPrice(product.price)}</span>
          {low && <span className="product-card__low">Chỉ còn {product.stock}</span>}
        </div>
        {soldOut ? (
          <Link to="/contact" className="product-card__cta">
            Liên hệ đặt trước <Icon name="arrow" size={18} />
          </Link>
        ) : (
          <Link to={`/order?product=${product.id}`} className="product-card__cta">
            Đặt hoa này <Icon name="arrow" size={18} />
          </Link>
        )}
      </div>
    </article>
  )
}
