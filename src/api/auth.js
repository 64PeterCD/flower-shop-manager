import { api } from './client.js'

// POST /api/auth/register  { email, password } -> { token, expiresAt, user }
export const register = (body) => api.post('/auth/register', body).then((res) => res.data)

// POST /api/auth/login     { email, password } -> { token, expiresAt, user }
export const login = (body) => api.post('/auth/login', body).then((res) => res.data)

// GET /api/auth/me (cần token) -> { id, email, role }
export const getMe = () => api.get('/auth/me').then((res) => res.data)
