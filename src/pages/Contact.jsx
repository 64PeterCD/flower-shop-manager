import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
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
      <PageHeader title="Liên hệ">Cần tư vấn mẫu hoa, đặt số lượng lớn hoặc hoa sự kiện? Cứ nhắn cho shop.</PageHeader>

      <section className="section section--compact">
        <div className="container grid grid--2">
          <div className="panel">
            <h2 className="panel__title">Thông tin cửa hàng</h2>
            <ul className="contact-list">
              <li><Icon name="pin" size={22} /><span>{shop.address}</span></li>
              <li><Icon name="phone" size={22} /><a href={`tel:${shop.phone.replace(/\s/g, '')}`}>{shop.phone}</a></li>
              <li><Icon name="mail" size={22} /><a href={`mailto:${shop.email}`}>{shop.email}</a></li>
              <li><Icon name="clock" size={22} /><span>{shop.hours}</span></li>
            </ul>
          </div>

          <div className="panel">
            <h2 className="panel__title">Gửi lời nhắn</h2>
            {sent ? (
              <p role="status">Shop đã nhận lời nhắn và sẽ phản hồi trong vòng 24 giờ. (Bản demo: lời nhắn chưa được gửi đi.)</p>
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
