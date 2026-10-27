import { api } from './client.js'

// GET /api/orders?status=New
export const getOrders = (params) => api.get('/orders', { params }).then((res) => res.data)

// POST /api/orders  (đặt hoa: người đặt, địa chỉ, ngày/khung giờ giao, danh sách sản phẩm)
export const createOrder = (body) => api.post('/orders', body).then((res) => res.data)

// PUT /api/orders/12  (đổi trạng thái, địa chỉ, ngày/khung giờ giao)
export const updateOrder = (id, body) => api.put(`/orders/${id}`, body).then((res) => res.data)

// DELETE /api/orders/12  (chỉ xóa được đơn đã hủy)
export const deleteOrder = (id) => api.delete(`/orders/${id}`)
