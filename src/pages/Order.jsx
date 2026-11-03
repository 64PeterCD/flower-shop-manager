import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { getErrorMessage } from '../api/client.js'
import { createOrder } from '../api/orders.js'
import { getProducts } from '../api/products.js'
import ApiState from '../components/ApiState.jsx'
import Bouquet from '../components/Bouquet.jsx'
import Field from '../components/Field.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { deliverySlots } from '../data/shop.js'
import useApi from '../hooks/useApi.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { focusFirstInvalid } from '../utils/focus.js'
import { formatDate, formatPrice } from '../utils/format.js'
import './Pages.css'

const PHONE_PATTERN = /^(0|\+84)\d{9}$/
const MESSAGE_MAX = 500
const FIELD_ORDER = ['customer', 'phone', 'address', 'productId', 'quantity', 'date', 'slot']

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
    if (Object.keys(found).length > 0) {
      focusFirstInvalid(found, FIELD_ORDER)
      return
    }

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
            <h1>Cảm ơn {confirmation.customerName}!</h1>
            <p>
              Shop đã nhận đơn <strong className="confirmation__code">{confirmation.code}</strong> và sẽ gọi xác nhận qua số{' '}
              {confirmation.phone}.
            </p>
            <dl className="info-list">
              <div>
                <dt>Sản phẩm</dt>
                <dd>{confirmation.items.map((item) => `${item.productName} × ${item.quantity}`).join(', ')}</dd>
              </div>
              <div><dt>Tạm tính</dt><dd>{formatPrice(confirmation.total)}</dd></div>
              <div><dt>Giao đến</dt><dd>{confirmation.address}</dd></div>
              <div><dt>Thời gian</dt><dd>{formatDate(confirmation.deliveryDate)}, {confirmation.deliverySlot}</dd></div>
            </dl>
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
      <PageHeader title="Đặt hoa online">Điền thông tin giao hoa, shop sẽ gọi xác nhận trước khi chuẩn bị.</PageHeader>

      <section className="section section--compact">
        <div className="container">
          <ApiState loading={productsApi.loading && !productsApi.data} error={productsApi.error} onRetry={productsApi.reload} />
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
                    <option value="">Chọn sản phẩm</option>
                    {products.map((item) => (
                      <option key={item.id} value={item.id} disabled={item.stock === 0}>
                        {item.name} ({formatPrice(item.price)})
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
                <Field id="slot" label="Khung giờ giao" error={errors.slot}>
                  <select id="slot" name="slot" value={form.slot} onChange={handleChange}>
                    <option value="">Chọn khung giờ</option>
                    {deliverySlots.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field id="message" label="Lời nhắn trên thiệp (không bắt buộc)" hint={`${form.message.length}/${MESSAGE_MAX} ký tự. Shop viết tay giúp bạn.`}>
                <textarea id="message" name="message" maxLength={MESSAGE_MAX} value={form.message} onChange={handleChange} />
              </Field>

              {submitError && <p className="field__error" role="alert">{submitError}</p>}

              <button type="submit" className="btn btn--primary" disabled={submitting}>
                {submitting ? 'Đang gửi...' : 'Gửi yêu cầu đặt hoa'}
              </button>
            </form>

            <div className="order__side">
              <aside className="panel order__summary" aria-label="Tóm tắt đơn">
                <h2>Đơn của bạn</h2>
                {product ? (
                  <>
                    <div className="order__preview" style={{ '--tone': product.petalColor }}>
                      <Bouquet color={product.petalColor} flowers={product.flowers} seed={product.id} />
                    </div>
                    <p className="order__name">{product.name}</p>
                    <p className="muted">{product.flowers}</p>
                    <p className="order__line">
                      {formatPrice(product.price)} × {Number(form.quantity) || 0}
                    </p>
                    <p className="order__total">{formatPrice(total)}</p>
                    <p className="muted order__note">Chưa gồm phí giao hàng; shop báo khi xác nhận.</p>
                  </>
                ) : (
                  <p className="muted">Chọn sản phẩm để xem hình và giá tạm tính.</p>
                )}
              </aside>

              <div className="gift-card" aria-label="Xem trước thiệp">
                <p className="gift-card__label">Thiệp kèm hoa</p>
                <div className="gift-card__paper">
                  <p className="gift-card__message">{form.message.trim() || 'Lời nhắn của bạn sẽ hiện ở đây.'}</p>
                  {form.customer.trim() && <p className="gift-card__sign">{form.customer.trim()}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
