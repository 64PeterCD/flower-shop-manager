import { useState } from 'react'
import { shop } from '../data/shop.js'
import usePageTitle from '../hooks/usePageTitle.js'
import './Pages.css'

export default function Contact() {
  usePageTitle('Liên hệ')
  const [sent, setSent] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Liên hệ</p>
          <h1>Trò chuyện cùng Sắc Hoa</h1>
          <p className="muted page-hero__lead">Cần tư vấn mẫu hoa, đặt số lượng lớn hay hoa sự kiện? Cứ nhắn cho shop.</p>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid--2">
          <div className="panel">
            <h3>Thông tin cửa hàng</h3>
            <dl className="info-list">
              <div><dt>Địa chỉ</dt><dd>{shop.address}</dd></div>
              <div><dt>Điện thoại</dt><dd>{shop.phone}</dd></div>
              <div><dt>Email</dt><dd>{shop.email}</dd></div>
              <div><dt>Giờ mở cửa</dt><dd>{shop.hours}</dd></div>
            </dl>
          </div>

          <div className="panel">
            <h3>Gửi lời nhắn</h3>
            {sent ? (
              <p role="status">Cảm ơn bạn! Shop sẽ phản hồi trong vòng 24 giờ. (Bản demo: lời nhắn chưa được gửi đi.)</p>
            ) : (
              <form className="form" onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="contact-name">Họ tên</label>
                  <input id="contact-name" name="name" required autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="contact-email">Email</label>
                  <input id="contact-email" name="email" type="email" required autoComplete="email" />
                </div>
                <div className="field">
                  <label htmlFor="contact-message">Nội dung</label>
                  <textarea id="contact-message" name="message" required />
                </div>
                <button type="submit" className="btn btn--primary">Gửi lời nhắn</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
