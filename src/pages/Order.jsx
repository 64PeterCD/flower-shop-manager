import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { getErrorMessage } from '../api/client.js'
import { createOrder } from '../api/orders.js'
import { getProducts } from '../api/products.js'
import ApiState from '../components/ApiState.jsx'
import { deliverySlots } from '../data/shop.js'
import useApi from '../hooks/useApi.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { formatDate, formatPrice } from '../utils/format.js'
import './Pages.css'

const PHONE_PATTERN = /^(0|\+84)\d{9}$/

// "YYYY-MM-DD" theo giờ máy (toISOString sẽ lệch múi giờ)
const today = () => new Date().toLocaleDateString('sv-SE')

function validate(form, product) {
  const errors = {}
  if (!form.customer.trim()) errors.customer = 'Vui lòng nhập họ tên.'
  if (!PHONE_PATTERN.test(form.phone.replace(/[\s.]/g, ''))) errors.phone = 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0).'
  if (!form.address.trim()) errors.address = 'Vui lòng nhập địa chỉ giao hoa.'
  if (!form.productId) errors.productId = 'Vui lòng chọn sản phẩm.'
  const qty = Number(form.quantity)
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

  // /order?product=3 -> chọn sẵn sản phẩm có id 3
  const [searchParams] = useSearchParams()
  const productsApi = useApi(() => getProducts(), [])
  const products = productsApi.data ?? []

  const [form, setForm] = useState({
    customer: '',
    phone: '',
    address: '',
    productId: searchParams.get('product') ?? '',
    quantity: '1',
    date: '',
    slot: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [confirmation, setConfirmation] = useState(null)

  const product = products.find((item) => String(item.id) === form.productId)
  const total = product ? product.price * (Number(form.quantity) || 0) : 0

  // Một hàm cập nhật dùng chung cho mọi ô nhập (đặt tên ô trong thuộc tính name)
  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validate(form, product)
    setErrors(found)
    setSubmitError('')
    if (Object.keys(found).length > 0) return

    setSubmitting(true)
    try {
      // POST /api/orders
      const order = await createOrder({
        customerName: form.customer.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        deliveryDate: form.date,
        deliverySlot: form.slot,
        message: form.message.trim() || null,
        items: [{ productId: Number(form.productId), quantity: Number(form.quantity) }],
      })
      setConfirmation(order)
    } catch (error) {
      setSubmitError(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmation) {
    return (
      <section className="section">
        <div className="container">
          <div className="panel panel--wide confirmation">
            <p className="eyebrow">Đã nhận yêu cầu</p>
            <h1>Cảm ơn {confirmation.customerName}!</h1>
            <p>Mã đơn của bạn là <strong className="confirmation__code">{confirmation.code}</strong>. Shop sẽ gọi xác nhận qua số {confirmation.phone}.</p>
            <dl className="info-list">
              <div>
                <dt>Sản phẩm</dt>
                <dd>{confirmation.items.map((item) => `${item.productName} × ${item.quantity}`).join(', ')}</dd>
              </div>
              <div><dt>Tạm tính</dt><dd>{formatPrice(confirmation.total)}</dd></div>
              <div><dt>Giao đến</dt><dd>{confirmation.address}</dd></div>
              <div><dt>Thời gian</dt><dd>{formatDate(confirmation.deliveryDate)} · {confirmation.deliverySlot}</dd></div>
            </dl>
            <p className="muted">Đơn đã được lưu vào cơ sở dữ liệu; chủ shop xem được trong trang quản lý.</p>
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
        <div className="container">
          <ApiState loading={productsApi.loading} error={productsApi.error} onRetry={productsApi.reload} />
          <div className="order">
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

              {submitError && <p className="field__error" role="alert">{submitError}</p>}

              <button type="submit" className="btn btn--primary" disabled={submitting}>
                {submitting ? 'Đang gửi...' : 'Gửi yêu cầu đặt hoa'}
              </button>
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
        </div>
      </section>
    </>
  )
}
