import { api } from './client.js'

// GET /api/categories
export const getCategories = () => api.get('/categories').then((res) => res.data)
