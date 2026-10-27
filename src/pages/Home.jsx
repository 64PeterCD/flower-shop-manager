import { Link } from 'react-router'
import FlowerArt from '../components/FlowerArt.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { categories, products, shop } from '../data/shop.js'
import usePageTitle from '../hooks/usePageTitle.js'
import './Home.css'

const FEATURES = [
  { icon: '🌿', title: 'Hoa tươi mỗi sáng', text: 'Nhập hoa từ vườn mỗi ngày, cắm tại shop và bảo đảm độ tươi tối thiểu 48 giờ.' },
  { icon: '🚚', title: 'Giao nhanh nội thành', text: 'Chọn khung giờ giao trong ngày, shop báo trạng thái đơn qua điện thoại.' },
  { icon: '🎀', title: 'Thiết kế theo yêu cầu', text: 'Chọn màu, loại hoa và thiệp viết tay cho đúng dịp bạn muốn gửi gắm.' },
  { icon: '💳', title: 'Thanh toán linh hoạt', text: 'Thanh toán khi nhận hoa hoặc chuyển khoản trước, có xác nhận rõ ràng.' },
]

const STEPS = [
  { title: 'Chọn hoa', text: 'Xem mẫu có sẵn theo dịp và ngân sách.' },
  { title: 'Điền thông tin', text: 'Người nhận, địa chỉ, khung giờ và lời nhắn.' },
  { title: 'Shop xác nhận', text: 'Nhận mã đơn, shop chuẩn bị và gọi xác nhận.' },
  { title: 'Nhận hoa', text: 'Hoa được giao tận nơi đúng giờ hẹn.' },
]

export default function Home() {
  usePageTitle('')
  const featured = products.filter((p) => p.featured)

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="eyebrow">Shop hoa tươi · TP.HCM</p>
            <h1>{shop.tagline}</h1>
            <p className="hero__lead">{shop.intro}</p>
            <div className="actions">
              <Link to="/products" className="btn btn--primary">Xem sản phẩm</Link>
              <Link to="/order" className="btn btn--outline">Đặt hoa ngay</Link>
            </div>
            <ul className="hero__stats">
              <li><strong>{products.length}</strong> mẫu hoa theo dịp</li>
              <li><strong>2 giờ</strong> giao nội thành</li>
              <li><strong>48 giờ</strong> bảo hành độ tươi</li>
            </ul>
          </div>
          <div className="hero__art" aria-hidden="true">
            <FlowerArt petal="#d9506f" className="hero__flower hero__flower--main" />
            <FlowerArt petal="#f2b01e" className="hero__flower hero__flower--left" />
            <FlowerArt petal="#8fa8e8" className="hero__flower hero__flower--right" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Danh mục" title="Hoa cho mọi dịp">
            Từ bó hoa nhỏ tặng người thương đến kệ hoa khai trương.
          </SectionHeading>
          <div className="grid grid--4">
            {categories.map((category) => (
              <Link key={category.id} to={`/products?category=${category.id}`} className="category-card" style={{ '--petal': category.petal }}>
                <FlowerArt petal={category.petal} className="category-card__art" />
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Bán chạy" title="Sản phẩm nổi bật">
            Những mẫu được khách chọn nhiều nhất trong tuần.
          </SectionHeading>
          <div className="grid grid--4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <p className="section__more">
            <Link to="/products" className="btn btn--outline">Xem tất cả sản phẩm</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Vì sao chọn Sắc Hoa" title="Tươi, đẹp và đúng hẹn" />
          <div className="grid grid--4">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="feature">
                <span className="feature__icon" aria-hidden="true">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p className="muted">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Cách đặt hoa" title="Bốn bước đơn giản" />
          <ol className="steps">
            {STEPS.map((step) => (
              <li key={step.title} className="steps__item">
                <h3>{step.title}</h3>
                <p className="muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta">
            <h2>Sắp đến một dịp đặc biệt?</h2>
            <p>Để lại lời nhắn, Sắc Hoa sẽ gọi tư vấn mẫu hoa phù hợp trong vòng 30 phút.</p>
            <Link to="/order" className="btn btn--light">Đặt hoa online</Link>
          </div>
        </div>
      </section>
    </>
  )
}
