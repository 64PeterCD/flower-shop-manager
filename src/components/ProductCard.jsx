import { Link } from 'react-router'
import { formatPrice } from '../utils/format.js'
import FlowerArt from './FlowerArt.jsx'
import './Cards.css'

export default function ProductCard({ product }) {
  const soldOut = product.stock === 0

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__visual" style={{ '--petal': product.petalColor }}>
        <FlowerArt petal={product.petalColor} />
        {soldOut && <span className="product-card__flag">Hết hàng</span>}
      </Link>
      <div className="product-card__body">
        <p className="product-card__category">{product.categoryName}</p>
        <h3>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card__price">{formatPrice(product.price)}</p>
        {soldOut ? (
          <Link to="/contact" className="btn btn--outline btn--sm">Liên hệ đặt trước</Link>
        ) : (
          <Link to={`/order?product=${product.id}`} className="btn btn--outline btn--sm">Đặt hoa này</Link>
        )}
      </div>
    </article>
  )
}
