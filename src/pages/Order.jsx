import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { deliverySlots, getProduct, products } from '../data/shop.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { formatPrice } from '../utils/format.js'
import './Pages.css'

const PHONE_PATTERN = /^(0|\+84)\d{9}$/

// "YYYY-MM-DD" theo giờ máy (toISOString sẽ lệch múi giờ)
const today = () => new Date().toLocaleDateString('sv-SE')

function validate(form) {
  const errors = {}
  if (!form.customer.trim()) errors.customer = 'Vui lòng nhập họ tên.'
  if (!PHONE_PATTERN.test(form.phone.replace(/[\s.]/g, ''))) errors.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).'
  if (!form.address.trim()) errors.address = 'Vui lòng nhập địa chỉ giao hoa.'
  if (!form.productId) errors.productId = 'Vui lòng chọn sản phẩm.'
  const qty = Number(form.quantity)
  const product = getProduct(form.productId)
  if (!Number.isInteger(qty) || qty < 1) errors.quantity = 'Số lượng tối thiểu là 1.'
  else if (product && qty > product.stock) errors.quantity = `Shop chỉ còn ${product.stock} sản phẩm này.`
  if (!form.date) errors.date = 'Vui lòng chọn ngày giao.'
  else if (form.date < today()) errors.date = 'Ngày giao không được ở quá khứ.'
  if (!form.slot) errors.slot = 'Vui lòng chọn khung giờ.'
  return errors
}

function Field({ id, label, error, children }) {
  return (
    <div className={`field ${error ? 'field--invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <span className="field__error" role="alert">{error}</span>}
    </div>
  )
}

export default function Order() {
  usePageTitle('Đặt hoa')

  // /order?product=hong-do-tinh-yeu -> chọn sẵn sản phẩm
  const [searchParams] = useSearchParams()
  const preselected = getProduct(searchParams.get('product'))?.id ?? ''

  const [form, setForm] = useState({
    customer: '',
    phone: '',
    address: '',
    productId: preselected,
    quantity: '1',
    date: '',
    slot: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [confirmation, setConfirmation] = useState(null)

  const product = getProduct(form.productId)
  const total = product ? product.price * (Number(form.quantity) || 0) : 0

  // Một hàm cập nhật dùng chung cho mọi ô nhập (đặt tên ô trong thuộc tính name)
  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setConfirmation({
      code: `HOA-${Date.now().toString(36).slice(-5).toUpperCase()}`,
      product,
      quantity: Number(form.quantity),
      total,
      form,
    })
  }

  if (confirmation) {
    const { code, product: ordered, quantity, total: amount, form: data } = confirmation
    return (
      <section className="section">
        <div className="container">
          <div className="panel panel--wide confirmation">
            <p className="eyebrow">Đã nhận yêu cầu</p>
            <h1>Cảm ơn {data.customer}!</h1>
            <p>Mã đơn của bạn là <strong className="confirmation__code">{code}</strong>. Shop sẽ gọi xác nhận qua số {data.phone}.</p>
            <dl className="info-list">
              <div><dt>Sản phẩm</dt><dd>{ordered.name} × {quantity}</dd></div>
              <div><dt>Tạm tính</dt><dd>{formatPrice(amount)}</dd></div>
              <div><dt>Giao đến</dt><dd>{data.address}</dd></div>
              <div><dt>Thời gian</dt><dd>{data.date.split('-').reverse().join('/')} · {data.slot}</dd></div>
            </dl>
            <p className="muted">Đây là bản demo giao diện: đơn chưa được gửi lên máy chủ.</p>
            <div className="actions">
              <Link to="/" className="btn btn--primary">Về trang chủ</Link>
              <button type="button" className="btn btn--outline" onClick={() => setConfirmation(null)}>
                Đặt thêm đơn khác
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Đặt hoa online</p>
          <h1>Gửi yêu cầu đặt hoa</h1>
          <p className="muted page-hero__lead">Điền thông tin bên dưới, shop sẽ gọi xác nhận trước khi chuẩn bị hoa.</p>
        </div>
      </section>

      <section className="section">
        <div className="container order">
          <form className="form panel" onSubmit={handleSubmit} noValidate>
            <div className="form__row">
              <Field id="customer" label="Họ tên người đặt" error={errors.customer}>
                <input id="customer" name="customer" value={form.customer} onChange={handleChange} autoComplete="name" />
              </Field>
              <Field id="phone" label="Số điện thoại" error={errors.phone}>
                <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} autoComplete="tel" />
              </Field>
            </div>

            <Field id="address" label="Địa chỉ giao hoa" error={errors.address}>
              <input id="address" name="address" value={form.address} onChange={handleChange} autoComplete="street-address" />
            </Field>

            <div className="form__row">
              <Field id="productId" label="Sản phẩm" error={errors.productId}>
                <select id="productId" name="productId" value={form.productId} onChange={handleChange}>
                  <option value="">— Chọn sản phẩm —</option>
                  {products.map((item) => (
                    <option key={item.id} value={item.id} disabled={item.stock === 0}>
                      {item.name} — {formatPrice(item.price)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="quantity" label="Số lượng" error={errors.quantity}>
                <input id="quantity" name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} />
              </Field>
            </div>

            <div className="form__row">
              <Field id="date" label="Ngày giao" error={errors.date}>
                <input id="date" name="date" type="date" min={today()} value={form.date} onChange={handleChange} />
              </Field>
              <Field id="slot" label="Khung giờ" error={errors.slot}>
                <select id="slot" name="slot" value={form.slot} onChange={handleChange}>
                  <option value="">— Chọn khung giờ —</option>
                  {deliverySlots.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field id="message" label="Lời nhắn trên thiệp (không bắt buộc)">
              <textarea id="message" name="message" value={form.message} onChange={handleChange} />
            </Field>

            <button type="submit" className="btn btn--primary">Gửi yêu cầu đặt hoa</button>
          </form>

          <aside className="panel order__summary" aria-label="Tóm tắt đơn">
            <h3>Tóm tắt đơn</h3>
            {product ? (
              <>
                <p><strong>{product.name}</strong></p>
                <p className="muted">{product.flowers}</p>
                <p>{formatPrice(product.price)} × {Number(form.quantity) || 0}</p>
                <p className="order__total">{formatPrice(total)}</p>
                <p className="muted">Chưa gồm phí giao hàng (shop báo khi xác nhận).</p>
              </>
            ) : (
              <p className="muted">Chọn sản phẩm để xem giá tạm tính.</p>
            )}
          </aside>
        </div>
      </section>
    </>
  )
}
