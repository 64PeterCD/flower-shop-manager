import { useState } from 'react'
import { getErrorMessage } from '../../api/client.js'
import { deleteOrder, getOrders, updateOrder } from '../../api/orders.js'
import ApiState from '../../components/ApiState.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import { orderStatusLabels, orderStatuses } from '../../data/shop.js'
import useApi from '../../hooks/useApi.js'
import usePageTitle from '../../hooks/usePageTitle.js'
import { formatDate, formatPrice } from '../../utils/format.js'
import './Admin.css'

const FINAL_STATUSES = ['Completed', 'Cancelled']

export default function AdminOrders() {
  usePageTitle('Quản lý · Đơn hàng')
  const [status, setStatus] = useState('all')
  const [actionError, setActionError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const { data, loading, error, reload } = useApi(() => getOrders(), [])
  const orders = data ?? []
  const visible = status === 'all' ? orders : orders.filter((order) => order.status === status)

  // PUT /api/orders/{id}: gửi lại đủ thông tin đơn, chỉ đổi trạng thái.
  async function changeStatus(order, newStatus) {
    setBusyId(order.id)
    setActionError('')
    try {
      await updateOrder(order.id, {
        status: newStatus,
        address: order.address,
        deliveryDate: order.deliveryDate,
        deliverySlot: order.deliverySlot,
      })
      reload()
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  // DELETE /api/orders/{id}: back-end chỉ cho xóa đơn đã hủy.
  async function removeOrder(order) {
    if (!window.confirm(`Xóa đơn ${order.code}? Thao tác này không hoàn tác được.`)) return
    setBusyId(order.id)
    setActionError('')
    try {
      await deleteOrder(order.id)
      reload()
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

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
            {orderStatusLabels[item]} ({orders.filter((order) => order.status === item).length})
          </button>
        ))}
      </div>

      <ApiState loading={loading && !data} error={error} onRetry={reload} />
      {actionError && <p className="api-state api-state--error" role="alert">{actionError}</p>}

      {data && (
        <div className="panel table-wrap">
          <table className="table">
            <thead>
              <tr><th>Mã đơn</th><th>Khách hàng</th><th>Sản phẩm</th><th>Giao lúc</th><th>Tổng</th><th>Trạng thái</th><th></th></tr>
            </thead>
            <tbody>
              {visible.map((order) => (
                <tr key={order.id}>
                  <td>{order.code}</td>
                  <td>{order.customerName}<br /><span className="muted">{order.phone}</span></td>
                  <td>
                    {order.items.map((item) => (
                      <div key={item.productId}>{item.productName} × {item.quantity}</div>
                    ))}
                  </td>
                  <td>{formatDate(order.deliveryDate)} · {order.deliverySlot}</td>
                  <td>{formatPrice(order.total)}</td>
                  <td>
                    {FINAL_STATUSES.includes(order.status) ? (
                      <StatusBadge label={orderStatusLabels[order.status]} />
                    ) : (
                      <select
                        className="status-select"
                        aria-label={`Trạng thái đơn ${order.code}`}
                        value={order.status}
                        disabled={busyId === order.id}
                        onChange={(event) => changeStatus(order, event.target.value)}
                      >
                        {orderStatuses.map((item) => (
                          <option key={item} value={item}>{orderStatusLabels[item]}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td>
                    {order.status === 'Cancelled' && (
                      <button type="button" className="btn btn--outline btn--sm" disabled={busyId === order.id} onClick={() => removeOrder(order)}>
                        Xóa
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan="7" className="muted">Không có đơn nào ở trạng thái này.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
