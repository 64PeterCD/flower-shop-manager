import { useState } from 'react'
import { Link } from 'react-router'
import { getCategories } from '../api/categories.js'
import { getProducts } from '../api/products.js'
import ApiState from '../components/ApiState.jsx'
import Bouquet from '../components/Bouquet.jsx'
import Icon from '../components/Icon.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductSkeletons from '../components/ProductSkeletons.jsx'
import { shop } from '../data/shop.js'
import useApi from '../hooks/useApi.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { COLOR_FAMILIES, colorFamily, getColorFamily } from '../utils/color.js'
import './Home.css'

// Loại hoa vẽ trong bó minh họa ở hero theo sắc đang chọn.
const TONE_KINDS = {
  do: ['rose', 'daisy'],
  hong: ['rose', 'tulip'],
  cam: ['daisy', 'rose'],
  vang: ['sunflower', 'daisy'],
  'tim-xanh': ['hydrangea', 'daisy'],
  trang: ['rose', 'daisy'],
}

const CATEGORY_KINDS = {
  'hoa-bo': ['rose', 'tulip'],
  'gio-hop': ['hydrangea', 'daisy'],
  'khai-truong': ['sunflower', 'rose'],
  'hoa-cuoi': ['rose', 'daisy'],
}

// Màu nền khối danh mục (mặc định lấy màu cánh hoa của danh mục); hoa cưới nhạt quá nên cho nền tím nhạt để khác khối "Hoa bó".
const BLOCK_TONES = { 'hoa-cuoi': '#b9a2e8' }

const TRUST = [
  { icon: 'truck', title: 'Giao nội thành trong 2 giờ', text: 'Chọn khung giờ ngay khi đặt hoa.' },
  { icon: 'gift', title: 'Thiệp viết tay miễn phí', text: 'Lời nhắn của bạn, nét chữ của shop.' },
  { icon: 'leaf', title: 'Tươi ít nhất 48 giờ', text: 'Héo sớm hơn thì shop đổi bó khác.' },
]

const CARE = [
  { icon: 'scissors', title: 'Cắt chéo cuống', text: 'Cắt chéo khoảng 2 cm trước khi cắm để hoa hút nước tốt hơn.' },
  { icon: 'droplet', title: 'Thay nước mỗi ngày', text: 'Rửa sạch bình và dùng nước mát để cuống không bị tắc.' },
  { icon: 'sun', title: 'Tránh nắng và gió', text: 'Đặt nơi thoáng mát, xa nắng gắt và luồng gió từ quạt, máy lạnh.' },
  { icon: 'leaf', title: 'Tỉa lá chìm trong nước', text: 'Lá ngâm nước sẽ úng, làm nước nhanh đục và hoa chóng héo.' },
]

const STEPS = [
  { title: 'Chọn hoa', text: 'Xem mẫu theo dịp, màu sắc và ngân sách.' },
  { title: 'Điền thông tin', text: 'Người nhận, địa chỉ, ngày giờ và lời nhắn trên thiệp.' },
  { title: 'Shop xác nhận', text: 'Bạn nhận mã đơn, shop gọi lại để xác nhận.' },
  { title: 'Nhận hoa', text: 'Hoa được giao tận nơi, đúng khung giờ đã hẹn.' },
]

export default function Home() {
  usePageTitle('')
  const [toneId, setToneId] = useState('hong')
  const tone = getColorFamily(toneId)

  const productsApi = useApi(() => getProducts(), [])
  const categoriesApi = useApi(() => getCategories(), [])
  const products = productsApi.data
  const featured = (products ?? []).filter((product) => product.featured)

  // Số mẫu hoa thật sự có theo sắc đang chọn (tính từ dữ liệu API).
  const toneCount = products ? products.filter((product) => colorFamily(product.petalColor) === toneId).length : null
  const toneName = tone.label.toLowerCase()
  const toneLink = toneCount === 0 ? '/products' : `/products?color=${toneId}`
  const toneAction =
    toneCount === null ? `Xem hoa màu ${toneName}` : toneCount > 0 ? `Xem ${toneCount} mẫu hoa màu ${toneName}` : 'Xem tất cả sản phẩm'

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__copy">
            <h1>Hoa tươi cắm tay, giao đúng khung giờ bạn chọn</h1>
            <p className="hero__lead">
              Chọn mẫu có sẵn hoặc nhờ {shop.name} cắm theo dịp. Hoa nhập mỗi sáng, giao trong ngày ở nội thành TP.HCM.
            </p>

            <fieldset className="tones">
              <legend>Bạn thích hoa màu gì?</legend>
              <div className="tones__list">
                {COLOR_FAMILIES.map((family) => (
                  <label key={family.id} className="tone">
                    <input
                      type="radio"
                      name="tone"
                      value={family.id}
                      checked={family.id === toneId}
                      onChange={() => setToneId(family.id)}
                    />
                    <span className="tone__dot" style={{ background: family.swatch }} />
                    <span className="visually-hidden">{family.label}</span>
                  </label>
                ))}
                <span className="tones__name" aria-live="polite">
                  {tone.label}
                </span>
              </div>
            </fieldset>

            <div className="actions">
              <Link to={toneLink} className="btn btn--primary">
                {toneAction}
              </Link>
              <Link to="/order" className="btn btn--outline">
                Đặt hoa ngay
              </Link>
            </div>
          </div>

          <div className="hero__stage" style={{ '--tone': tone.swatch }}>
            <div className="hero__window">
              <Bouquet color={tone.swatch} kinds={TONE_KINDS[toneId]} seed={0} grow className="hero__bouquet" />
            </div>
          </div>
        </div>
      </section>

      <section className="trust" aria-label="Cam kết của shop">
        <div className="container">
          <ul className="trust__list">
            {TRUST.map((item) => (
              <li key={item.title}>
                <Icon name={item.icon} size={28} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>Hoa cho từng dịp</h2>
            <p>Từ bó hoa nhỏ tặng người thương đến kệ hoa khai trương.</p>
          </div>
          <ApiState loading={false} error={categoriesApi.error} onRetry={categoriesApi.reload} />
          <div className="blocks">
            {(categoriesApi.data ?? []).map((category, index) => (
              <Link key={category.id} to={`/products?category=${category.slug}`} className="block" style={{ '--tone': BLOCK_TONES[category.slug] ?? category.petalColor }}>
                <span className="block__text">
                  <h3>{category.name}</h3>
                  <span className="block__desc">{category.description}</span>
                  <span className="block__more">
                    Xem hoa <Icon name="arrow" size={18} />
                  </span>
                </span>
                <Bouquet
                  className="block__art"
                  color={category.petalColor}
                  kinds={CATEGORY_KINDS[category.slug] ?? ['rose', 'daisy']}
                  seed={index + 1}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section__head section__head--row">
            <div>
              <h2>Sản phẩm nổi bật</h2>
              <p>Những mẫu shop gợi ý cho tuần này.</p>
            </div>
            <Link to="/products" className="btn btn--outline">
              Xem tất cả sản phẩm
            </Link>
          </div>
          {productsApi.loading && !products && <ProductSkeletons count={4} />}
          <ApiState loading={false} error={productsApi.error} onRetry={productsApi.reload} />
          <div className="grid grid--4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="season">
        <div className="container season__inner">
          <div>
            <h2>20/11 đang đến gần</h2>
            <p>
              Đặt hoa tặng thầy cô trước một ngày để chọn được khung giờ giao vừa ý. Shop gọi xác nhận và viết thiệp tay giúp bạn.
            </p>
            <div className="actions">
              <Link to="/products?category=hoa-bo" className="btn btn--dark">
                Chọn hoa tặng thầy cô
              </Link>
            </div>
          </div>
          <div className="season__window" aria-hidden="true">
            <Bouquet color="#f2b01e" kinds={['sunflower', 'daisy']} seed={1} className="season__bouquet" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>Giữ hoa tươi lâu hơn</h2>
            <p>Bốn việc nhỏ giúp bó hoa đẹp thêm vài ngày.</p>
          </div>
          <ul className="care">
            {CARE.map((tip) => (
              <li key={tip.title}>
                <span className="care__icon">
                  <Icon name={tip.icon} size={26} />
                </span>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section__head">
            <h2>Đặt hoa trong bốn bước</h2>
          </div>
          <ol className="steps">
            {STEPS.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <div>
              <h2>Cần hoa cho hôm nay?</h2>
              <p>Chọn khung giờ giao ở bước đặt hoa, shop sẽ gọi xác nhận trong vòng 30 phút.</p>
            </div>
            <div className="cta__actions">
              <Link to="/order" className="btn btn--primary">
                Đặt hoa online
              </Link>
              <a href={`tel:${shop.phone.replace(/\s/g, '')}`} className="btn btn--outline">
                <Icon name="phone" size={18} /> {shop.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
