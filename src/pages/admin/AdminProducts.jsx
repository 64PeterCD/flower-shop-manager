import { useState } from 'react'
import { Link } from 'react-router'
import StatusBadge from '../../components/StatusBadge.jsx'
import { LOW_STOCK, getCategory, products } from '../../data/shop.js'
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

  const keyword = query.trim().toLowerCase()
  const visible = products.filter((product) => product.name.toLowerCase().includes(keyword))

  return (
    <>
      <header className="admin-head">
        <h1>Sản phẩm &amp; kho</h1>
        <p className="muted">Sắp hết khi tồn kho từ {LOW_STOCK} trở xuống.</p>
      </header>

      <div className="field admin-search">
        <label htmlFor="admin-search">Tìm sản phẩm</label>
        <input id="admin-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>

      <div className="panel table-wrap">
        <table className="table">
          <thead>
            <tr><th>Sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th>Tình trạng</th></tr>
          </thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product.id}>
                <td><Link to={`/products/${product.id}`}>{product.name}</Link></td>
                <td>{getCategory(product.categoryId).name}</td>
                <td>{formatPrice(product.price)}</td>
                <td>{product.stock}</td>
                <td><StatusBadge label={stockLabel(product.stock)} /></td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan="5" className="muted">Không tìm thấy sản phẩm.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
