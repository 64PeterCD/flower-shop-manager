import { Link } from 'react-router'
import StatusBadge from '../../components/StatusBadge.jsx'
import { LOW_STOCK, orderTotal, orders, products } from '../../data/shop.js'
import usePageTitle from '../../hooks/usePageTitle.js'
import { formatPrice } from '../../utils/format.js'
import './Admin.css'

export default function Dashboard() {
  usePageTitle('Quản lý · Tổng quan')

  const newOrders = orders.filter((order) => order.status === 'Mới').length
  const inProgress = orders.filter((order) => order.status === 'Đang chuẩn bị' || order.status === 'Đang giao').length
  const revenue = orders.filter((order) => order.status === 'Hoàn thành').reduce((sum, order) => sum + orderTotal(order), 0)
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
        <p className="muted">Số liệu tính từ dữ liệu mẫu trong <code>src/data/shop.js</code>.</p>
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
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{formatPrice(orderTotal(order))}</td>
                    <td><StatusBadge label={order.status} /></td>
                  </tr>
                ))}
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
          </ul>
        </section>
      </div>
    </>
  )
}
