import { useState } from 'react'
import { getErrorMessage } from '../api/client.js'

const EMPTY = {
  name: '',
  categoryId: '',
  price: '',
  stock: '',
  flowers: '',
  description: '',
  petalColor: '#d9506f',
  featured: false,
}

// Form dùng chung cho thêm mới (initial = null) và chỉnh sửa (initial = sản phẩm).
// onSubmit nhận dữ liệu đã chuẩn hóa và trả Promise (gọi POST hoặc PUT ở trang cha).
export default function ProductForm({ categories, initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(
    initial ? { ...EMPTY, ...initial, categoryId: String(initial.categoryId), price: String(initial.price), stock: String(initial.stock) } : EMPTY,
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({
        name: values.name.trim(),
        categoryId: Number(values.categoryId),
        price: Number(values.price),
        stock: Number(values.stock),
        flowers: values.flowers.trim(),
        description: values.description.trim(),
        petalColor: values.petalColor,
        featured: values.featured,
      })
    } catch (err) {
      setError(getErrorMessage(err))
      setSubmitting(false)
    }
  }

  return (
    <form className="form panel product-form" onSubmit={handleSubmit}>
      <h3>{initial ? `Sửa sản phẩm #${initial.id}` : 'Thêm sản phẩm mới'}</h3>

      <div className="form__row">
        <div className="field">
          <label htmlFor="pf-name">Tên sản phẩm</label>
          <input id="pf-name" name="name" value={values.name} onChange={handleChange} required maxLength={120} />
        </div>
        <div className="field">
          <label htmlFor="pf-category">Danh mục</label>
          <select id="pf-category" name="categoryId" value={values.categoryId} onChange={handleChange} required>
            <option value="">— Chọn danh mục —</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor="pf-price">Giá (đồng)</label>
          <input id="pf-price" name="price" type="number" min="0" step="1000" value={values.price} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="pf-stock">Tồn kho</label>
          <input id="pf-stock" name="stock" type="number" min="0" step="1" value={values.stock} onChange={handleChange} required />
        </div>
        <div className="field">
          <label htmlFor="pf-color">Màu hoa</label>
          <input id="pf-color" name="petalColor" type="color" value={values.petalColor} onChange={handleChange} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="pf-flowers">Thành phần</label>
        <input id="pf-flowers" name="flowers" value={values.flowers} onChange={handleChange} maxLength={200} />
      </div>

      <div className="field">
        <label htmlFor="pf-description">Mô tả</label>
        <textarea id="pf-description" name="description" value={values.description} onChange={handleChange} maxLength={1000} />
      </div>

      <label className="check">
        <input type="checkbox" name="featured" checked={values.featured} onChange={handleChange} />
        Hiện ở mục "Sản phẩm nổi bật" trên trang chủ
      </label>

      {error && <p className="field__error" role="alert">{error}</p>}

      <div className="actions">
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          {submitting ? 'Đang lưu...' : initial ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
        </button>
        <button type="button" className="btn btn--outline" onClick={onCancel}>Hủy</button>
      </div>
    </form>
  )
}
