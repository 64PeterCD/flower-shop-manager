import { api } from './client.js'

// GET /api/products?category=hoa-bo&search=hong&featured=true
export const getProducts = (params) => api.get('/products', { params }).then((res) => res.data)

// GET /api/products/3
export const getProduct = (id) => api.get(`/products/${id}`).then((res) => res.data)

// POST /api/products   (body: dữ liệu sản phẩm mới)
export const createProduct = (body) => api.post('/products', body).then((res) => res.data)

// PUT /api/products/3  (body: toàn bộ dữ liệu sau khi sửa)
export const updateProduct = (id, body) => api.put(`/products/${id}`, body).then((res) => res.data)

// DELETE /api/products/3
export const deleteProduct = (id) => api.delete(`/products/${id}`)
