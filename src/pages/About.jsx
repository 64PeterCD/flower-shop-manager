import { Link } from 'react-router'
import FlowerArt from '../components/FlowerArt.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { shop } from '../data/shop.js'
import usePageTitle from '../hooks/usePageTitle.js'
import './Pages.css'

const VALUES = [
  { title: 'Tươi là trên hết', text: 'Hoa về trong ngày, nhận ra hoa chưa đạt là loại ngay, không cố bán.' },
  { title: 'Thiết kế có câu chuyện', text: 'Mỗi bó hoa bắt đầu từ việc hỏi: bạn muốn gửi điều gì đến người nhận?' },
  { title: 'Minh bạch giá và đơn hàng', text: 'Giá niêm yết rõ ràng, đơn nào cũng có mã để tra cứu trạng thái.' },
]

export default function About() {
  usePageTitle('Giới thiệu')

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Giới thiệu</p>
          <h1>Về {shop.name}</h1>
          <p className="muted page-hero__lead">{shop.intro}</p>
        </div>
      </section>

      <section className="section">
        <div className="container about">
          <div className="about__text">
            <SectionHeading eyebrow="Câu chuyện" title="Một tiệm hoa nhỏ, làm việc cẩn thận" />
            <p>
              {shop.name} bắt đầu từ một quầy hoa nhỏ ở Quận 1. Chúng mình chọn làm ít mẫu nhưng làm kỹ: mỗi sáng
              chọn hoa, buổi trưa cắm, buổi chiều giao.
            </p>
            <p>
              Bên cạnh bán hàng, shop dùng một hệ thống quản lý riêng để theo dõi <strong>đơn hàng</strong> và{' '}
              <strong>tồn kho</strong>, giúp báo đúng tình trạng hoa còn hay hết cho khách.
            </p>
            <Link to="/admin" className="btn btn--outline">Xem trang quản lý shop</Link>
          </div>
          <div className="about__art" aria-hidden="true">
            <FlowerArt petal="#d9506f" />
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeading eyebrow="Giá trị" title="Chúng mình làm việc như thế nào" />
          <div className="grid grid--3">
            {VALUES.map((value) => (
              <article key={value.title} className="panel">
                <h3>{value.title}</h3>
                <p className="muted">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel panel--wide">
            <h3>Ghé shop</h3>
            <dl className="info-list">
              <div><dt>Địa chỉ</dt><dd>{shop.address}</dd></div>
              <div><dt>Giờ mở cửa</dt><dd>{shop.hours}</dd></div>
              <div><dt>Điện thoại</dt><dd>{shop.phone}</dd></div>
            </dl>
          </div>
        </div>
      </section>
    </>
  )
}
