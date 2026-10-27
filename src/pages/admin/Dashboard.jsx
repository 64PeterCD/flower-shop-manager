import { Link } from 'react-router'
import { getOrders } from '../../api/orders.js'
import { getProducts } from '../../api/products.js'
import ApiState from '../../components/ApiState.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { LOW_STOCK, orderStatusLabels } from '../../data/shop.js'
import useApi from '../../hooks/useApi.js'
import usePageTitle from '../../hooks/usePageTitle.js'
import { formatPrice } from '../../utils/format.js'
import './Admin.css'

export default function Dashboard() {
  usePageTitle('Quản lý · Tổng quan')

  const ordersApi = useApi(() => getOrders(), [])
  const productsApi = useApi(() => getProducts(), [])
  const orders = ordersApi.data
  const products = productsApi.data

  if (!orders || !products) {
    const failed = ordersApi.error ? ordersApi : productsApi
    return (
      <>
        <header className="admin-head">
          <h1>Tổng quan</h1>
        </header>
        <ApiState
          loading={ordersApi.loading || productsApi.loading}
          error={ordersApi.error ?? productsApi.error}
          onRetry={() => {
            ordersApi.reload()
            productsApi.reload()
            failed.reload()
          }}
        />
      </>
    )
  }

  const newOrders = orders.filter((order) => order.status === 'New').length
  const inProgress = orders.filter((order) => order.status === 'Preparing' || order.status === 'Delivering').length
  const revenue = orders.filter((order) => order.status === 'Completed').reduce((sum, order) => sum + order.total, 0)
  const lowStock = products.filter((product) => product.stock <= LOW_STOCK)

  const stats = [
    { label: 'Đơn mới', value: newOrders },
    { label: 'Đang xử lý', value: inProgress },
    { label: 'Doanh thu (đơn hoàn thành)', value: formatPrice(revenue) },
    { label: 'Sản phẩm sắp hết', value: lowStock.length },
  ]

  return (
    <>
      <header className="admin-head">
        <h1>Tổng quan</h1>
        <p className="muted">Số liệu lấy trực tiếp từ API back-end.</p>
      </header>

      <div className="stats">
        {stats.map((stat) => (
          <article key={stat.label} className="stat">
            <p className="stat__value">{stat.value}</p>
            <p className="stat__label">{stat.label}</p>
          </article>
        ))}
      </div>

      <div className="admin-grid">
        <section className="panel">
          <div className="panel__head">
            <h3>Đơn gần đây</h3>
            <Link to="/admin/orders">Xem tất cả</Link>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Mã đơn</th><th>Khách</th><th>Tổng</th><th>Trạng thái</th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td>{order.code}</td>
                    <td>{order.customerName}</td>
                    <td>{formatPrice(order.total)}</td>
                    <td><StatusBadge label={orderStatusLabels[order.status]} /></td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="4" className="muted">Chưa có đơn nào.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <div className="panel__head">
            <h3>Cần nhập thêm</h3>
            <Link to="/admin/products">Xem kho</Link>
          </div>
          <ul className="stock-list">
            {lowStock.map((product) => (
              <li key={product.id}>
                <span>{product.name}</span>
                <span className="stock-list__qty">còn {product.stock}</span>
              </li>
            ))}
            {lowStock.length === 0 && <li className="muted">Tồn kho đều ổn.</li>}
          </ul>
        </section>
      </div>
    </>
  )
}
