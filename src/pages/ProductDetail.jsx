import { Link, useParams } from 'react-router'
import FlowerArt from '../components/FlowerArt.jsx'
import ProductCard from '../components/ProductCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { LOW_STOCK, getCategory, getProduct, products } from '../data/shop.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { formatPrice } from '../utils/format.js'
import './Pages.css'

export default function ProductDetail() {
  // :productId trong route "products/:productId" -> useParams()
  const { productId } = useParams()
  const product = getProduct(productId)
  usePageTitle(product ? product.name : 'Không tìm thấy sản phẩm')

  if (!product) {
    return (
      <section className="section">
        <div className="container notfound">
          <h1>Không tìm thấy sản phẩm</h1>
          <p className="muted">Mã sản phẩm "{productId}" không tồn tại hoặc đã ngừng bán.</p>
          <Link to="/products" className="btn btn--primary">Về danh sách sản phẩm</Link>
        </div>
      </section>
    )
  }

  const category = getCategory(product.categoryId)
  const stockLabel = product.stock === 0 ? 'Hết hàng' : product.stock <= LOW_STOCK ? 'Sắp hết' : 'Còn hàng'
  const related = products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id)

  return (
    <>
      <section className="section">
        <div className="container">
          <nav className="breadcrumb" aria-label="Đường dẫn">
            <Link to="/products">Sản phẩm</Link> / <Link to={`/products?category=${category.id}`}>{category.name}</Link> /{' '}
            <span>{product.name}</span>
          </nav>

          <div className="detail">
            <div className="detail__visual" style={{ '--petal': product.petal }}>
              <FlowerArt petal={product.petal} />
            </div>
            <div>
              <p className="eyebrow">{category.name}</p>
              <h1>{product.name}</h1>
              <p className="detail__price">{formatPrice(product.price)}</p>
              <p>{product.description}</p>
              <dl className="info-list">
                <div><dt>Thành phần</dt><dd>{product.flowers}</dd></div>
                <div><dt>Tình trạng</dt><dd><StatusBadge label={stockLabel} /></dd></div>
              </dl>
              {product.stock > 0 ? (
                <Link to={`/order?product=${product.id}`} className="btn btn--primary">Đặt hoa này</Link>
              ) : (
                <Link to="/contact" className="btn btn--outline">Liên hệ để đặt trước</Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--alt">
          <div className="container">
            <h2>Sản phẩm cùng danh mục</h2>
            <div className="grid grid--4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
