import { Link, useParams } from 'react-router'
import { getProduct, getProducts } from '../api/products.js'
import ApiState from '../components/ApiState.jsx'
import Bouquet from '../components/Bouquet.jsx'
import Icon from '../components/Icon.jsx'
import ProductCard from '../components/ProductCard.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { LOW_STOCK } from '../data/shop.js'
import useApi from '../hooks/useApi.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { formatPrice } from '../utils/format.js'
import './Pages.css'

const CARE_TIPS = ['Cắt chéo 2 cm cuống trước khi cắm.', 'Thay nước mát mỗi ngày.', 'Để nơi thoáng mát, tránh nắng gắt.']

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
  const { data: sameCategory } = useApi(
    () => (categorySlug ? getProducts({ category: categorySlug }) : Promise.resolve([])),
    [categorySlug],
  )
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
      <section className="section section--compact">
        <div className="container">
          <nav className="breadcrumb" aria-label="Đường dẫn">
            <Link to="/products">Sản phẩm</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/products?category=${product.categorySlug}`}>{product.categoryName}</Link>
          </nav>

          <div className="detail">
            <div className="detail__stage" style={{ '--tone': product.petalColor }}>
              <div className="detail__window">
                <Bouquet color={product.petalColor} flowers={product.flowers} seed={product.id} className="detail__bouquet" />
              </div>
            </div>

            <div className="detail__info">
              <h1>{product.name}</h1>
              <p>
                <span className="price-tag price-tag--lg">{formatPrice(product.price)}</span>
              </p>
              <p className="detail__desc">{product.description}</p>

              <dl className="info-list">
                <div><dt>Thành phần</dt><dd>{product.flowers}</dd></div>
                <div>
                  <dt>Tình trạng</dt>
                  <dd>
                    <StatusBadge label={stockLabel} />
                    {product.stock > 0 && product.stock <= LOW_STOCK && <span className="detail__stock"> Chỉ còn {product.stock} bó</span>}
                  </dd>
                </div>
                <div><dt>Giao hàng</dt><dd>Chọn khung giờ khi đặt; nội thành giao trong 2 giờ.</dd></div>
              </dl>

              <div className="actions">
                {product.stock > 0 ? (
                  <Link to={`/order?product=${product.id}`} className="btn btn--primary">Đặt hoa này</Link>
                ) : (
                  <Link to="/contact" className="btn btn--outline">Liên hệ để đặt trước</Link>
                )}
              </div>

              <aside className="care-card" aria-label="Cách giữ hoa tươi">
                <h2 className="care-card__title">Giữ hoa tươi lâu hơn</h2>
                <ul>
                  {CARE_TIPS.map((tip) => (
                    <li key={tip}>
                      <Icon name="check" size={18} /> {tip}
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section section--tint">
          <div className="container">
            <div className="section__head">
              <h2>Cùng danh mục</h2>
            </div>
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
