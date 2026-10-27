import { useState } from 'react'
import { Link } from 'react-router'
import { getCategories } from '../../api/categories.js'
import { getErrorMessage } from '../../api/client.js'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../api/products.js'
import ApiState from '../../components/ApiState.jsx'
import ProductForm from '../../components/ProductForm.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { LOW_STOCK } from '../../data/shop.js'
import useApi from '../../hooks/useApi.js'
import usePageTitle from '../../hooks/usePageTitle.js'
import { formatPrice } from '../../utils/format.js'
import './Admin.css'

function stockLabel(stock) {
  if (stock === 0) return 'Hết hàng'
  return stock <= LOW_STOCK ? 'Sắp hết' : 'Còn hàng'
}

export default function AdminProducts() {
  usePageTitle('Quản lý · Sản phẩm & kho')
  const [query, setQuery] = useState('')
  // null = đóng form, 'new' = thêm mới, object = đang sửa sản phẩm đó
  const [editing, setEditing] = useState(null)
  const [actionError, setActionError] = useState('')

  const productsApi = useApi(() => getProducts(), [])
  const categoriesApi = useApi(() => getCategories(), [])

  const keyword = query.trim().toLowerCase()
  const visible = (productsApi.data ?? []).filter((product) => product.name.toLowerCase().includes(keyword))

  // POST /api/products khi thêm mới, PUT /api/products/{id} khi sửa.
  async function saveProduct(values) {
    if (editing === 'new') await createProduct(values)
    else await updateProduct(editing.id, values)
    setEditing(null)
    productsApi.reload()
  }

  // DELETE /api/products/{id}: back-end trả 409 nếu sản phẩm đã nằm trong đơn hàng.
  async function removeProduct(product) {
    if (!window.confirm(`Xóa sản phẩm "${product.name}"?`)) return
    setActionError('')
    try {
      await deleteProduct(product.id)
      productsApi.reload()
    } catch (error) {
      setActionError(getErrorMessage(error))
    }
  }

  return (
    <>
      <header className="admin-head">
        <h1>Sản phẩm &amp; kho</h1>
        <p className="muted">Sắp hết khi tồn kho từ {LOW_STOCK} trở xuống.</p>
      </header>

      <div className="admin-toolbar">
        <div className="field admin-search">
          <label htmlFor="admin-search">Tìm sản phẩm</label>
          <input id="admin-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <button type="button" className="btn btn--primary" onClick={() => setEditing('new')} disabled={!categoriesApi.data}>
          Thêm sản phẩm
        </button>
      </div>

      {editing && categoriesApi.data && (
        <ProductForm
          key={editing === 'new' ? 'new' : editing.id}
          categories={categoriesApi.data}
          initial={editing === 'new' ? null : editing}
          onSubmit={saveProduct}
          onCancel={() => setEditing(null)}
        />
      )}

      <ApiState loading={productsApi.loading && !productsApi.data} error={productsApi.error} onRetry={productsApi.reload} />
      {actionError && <p className="api-state api-state--error" role="alert">{actionError}</p>}

      {productsApi.data && (
        <div className="panel table-wrap">
          <table className="table">
            <thead>
              <tr><th>Sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th>Tình trạng</th><th></th></tr>
            </thead>
            <tbody>
              {visible.map((product) => (
                <tr key={product.id}>
                  <td><Link to={`/products/${product.id}`}>{product.name}</Link></td>
                  <td>{product.categoryName}</td>
                  <td>{formatPrice(product.price)}</td>
                  <td>{product.stock}</td>
                  <td><StatusBadge label={stockLabel(product.stock)} /></td>
                  <td className="table__actions">
                    <button type="button" className="btn btn--outline btn--sm" onClick={() => setEditing(product)}>Sửa</button>
                    <button type="button" className="btn btn--outline btn--sm" onClick={() => removeProduct(product)}>Xóa</button>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan="6" className="muted">Không tìm thấy sản phẩm.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
