import { useState } from 'react'
import StatusBadge from '../../components/StatusBadge.jsx'
import { getProduct, orderStatuses, orderTotal, orders } from '../../data/shop.js'
import usePageTitle from '../../hooks/usePageTitle.js'
import { formatPrice } from '../../utils/format.js'
import './Admin.css'

export default function AdminOrders() {
  usePageTitle('Quản lý · Đơn hàng')
  const [status, setStatus] = useState('all')

  const visible = status === 'all' ? orders : orders.filter((order) => order.status === status)

  return (
    <>
      <header className="admin-head">
        <h1>Đơn hàng</h1>
        <p className="muted">{visible.length} đơn</p>
      </header>

      <div className="chips" role="group" aria-label="Lọc theo trạng thái">
        <button type="button" className="chip" aria-pressed={status === 'all'} onClick={() => setStatus('all')}>
          Tất cả ({orders.length})
        </button>
        {orderStatuses.map((item) => (
          <button key={item} type="button" className="chip" aria-pressed={status === item} onClick={() => setStatus(item)}>
            {item} ({orders.filter((order) => order.status === item).length})
          </button>
        ))}
      </div>

      <div className="panel table-wrap">
        <table className="table">
          <thead>
            <tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Giao lúc</th><th>Tổng</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            {visible.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}<br /><span className="muted">{order.phone}</span></td>
                <td>
                  {order.items.map((item) => (
                    <div key={item.productId}>{getProduct(item.productId).name} × {item.qty}</div>
                  ))}
                </td>
                <td>{order.delivery}</td>
                <td>{formatPrice(orderTotal(order))}</td>
                <td><StatusBadge label={order.status} /></td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan="6" className="muted">Không có đơn nào ở trạng thái này.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
