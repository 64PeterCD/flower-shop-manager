import { Link } from 'react-router'
import { getCategory } from '../data/shop.js'
import { formatPrice } from '../utils/format.js'
import FlowerArt from './FlowerArt.jsx'
import './Cards.css'

export default function ProductCard({ product }) {
  const category = getCategory(product.categoryId)
  const soldOut = product.stock === 0

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__visual" style={{ '--petal': product.petal }}>
        <FlowerArt petal={product.petal} />
        {soldOut && <span className="product-card__flag">Hết hàng</span>}
      </Link>
      <div className="product-card__body">
        <p className="product-card__category">{category?.name}</p>
        <h3>
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-card__price">{formatPrice(product.price)}</p>
        <Link to={`/order?product=${product.id}`} className="btn btn--outline btn--sm">
          Đặt hoa này
        </Link>
      </div>
    </article>
  )
}
