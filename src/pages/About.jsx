import { Link } from 'react-router'
import Bouquet from '../components/Bouquet.jsx'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { shop } from '../data/shop.js'
import usePageTitle from '../hooks/usePageTitle.js'
import './Pages.css'

const VALUES = [
  { title: 'Tươi là trên hết', text: 'Hoa về trong ngày. Bông nào chưa đạt là loại ngay, shop không cố bán.' },
  { title: 'Mỗi bó có một câu chuyện', text: 'Shop luôn hỏi trước: bạn muốn gửi điều gì đến người nhận?' },
  { title: 'Giá và đơn hàng rõ ràng', text: 'Giá niêm yết minh bạch, đơn nào cũng có mã để theo dõi trạng thái.' },
]

export default function About() {
  usePageTitle('Giới thiệu')

  return (
    <>
      <PageHeader title={`Về ${shop.name}`}>{shop.intro}</PageHeader>

      <section className="section">
        <div className="container about">
          <div className="about__text">
            <h2>Một tiệm hoa nhỏ, làm việc cẩn thận</h2>
            <p>
              {shop.name} bắt đầu từ một quầy hoa nhỏ ở Quận 1. Shop chọn làm ít mẫu nhưng làm kỹ: sáng chọn hoa, trưa cắm, chiều giao.
            </p>
            <p>
              Phía sau cửa hàng là một hệ thống quản lý riêng để theo dõi <strong>đơn hàng</strong> và <strong>tồn kho</strong>, nhờ đó
              shop báo đúng với khách mẫu nào còn, mẫu nào hết.
            </p>
            <div className="actions">
              <Link to="/products" className="btn btn--primary">Xem sản phẩm</Link>
              <Link to="/contact" className="btn btn--outline">Liên hệ shop</Link>
            </div>
          </div>

          <div className="about__stage" aria-hidden="true">
            <div className="about__window">
              <Bouquet color="#ec7fa6" kinds={['rose', 'daisy']} seed={1} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section__head">
            <h2>Shop làm việc như thế nào</h2>
          </div>
          <dl className="values">
            {VALUES.map((value) => (
              <div key={value.title}>
                <dt>{value.title}</dt>
                <dd>{value.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel panel--wide">
            <h2 className="panel__title">Ghé tiệm</h2>
            <ul className="contact-list">
              <li><Icon name="pin" size={22} /><span>{shop.address}</span></li>
              <li><Icon name="clock" size={22} /><span>{shop.hours}</span></li>
              <li><Icon name="phone" size={22} /><a href={`tel:${shop.phone.replace(/\s/g, '')}`}>{shop.phone}</a></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
