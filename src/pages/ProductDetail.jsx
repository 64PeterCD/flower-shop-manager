import { Link, useParams } from 'react-router'
import { getProduct, getProducts } from '../api/products.js'
import ApiState from '../components/ApiState.jsx'
import FlowerArt from '../components/FlowerArt.jsx'
import ProductCard from '../components/ProductCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { LOW_STOCK } from '../data/shop.js'
import useApi from '../hooks/useApi.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { formatPrice } from '../utils/format.js'
import './Pages.css'

function NotFoundBlock({ productId }) {
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

export default function ProductDetail() {
  // :productId trong route "products/:productId" -> useParams()
  const { productId } = useParams()
  const { data: product, loading, error, status, reload } = useApi(() => getProduct(productId), [productId])
  const categorySlug = product?.categorySlug
  const { data: sameCategory } = useApi(() => (categorySlug ? getProducts({ category: categorySlug }) : Promise.resolve([])), [categorySlug])
  usePageTitle(product ? product.name : 'Chi tiết sản phẩm')

  if (status === 404) return <NotFoundBlock productId={productId} />

  if (!product) {
    return (
      <section className="section">
        <div className="container">
          <ApiState loading={loading} error={error} onRetry={reload} />
        </div>
      </section>
    )
  }

  const stockLabel = product.stock === 0 ? 'Hết hàng' : product.stock <= LOW_STOCK ? 'Sắp hết' : 'Còn hàng'
  const related = (sameCategory ?? []).filter((item) => item.id !== product.id)

  return (
    <>
      <section className="section">
        <div className="container">
          <nav className="breadcrumb" aria-label="Đường dẫn">
            <Link to="/products">Sản phẩm</Link> / <Link to={`/products?category=${product.categorySlug}`}>{product.categoryName}</Link> /{' '}
            <span>{product.name}</span>
          </nav>

          <div className="detail">
            <div className="detail__visual" style={{ '--petal': product.petalColor }}>
              <FlowerArt petal={product.petalColor} />
            </div>
            <div>
              <p className="eyebrow">{product.categoryName}</p>
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
