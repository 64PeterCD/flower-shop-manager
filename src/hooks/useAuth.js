import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.js'

// const { user, isAuthenticated, isAdmin, login, register, logout } = useAuth()
export default function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth phải được dùng bên trong <AuthProvider>.')
  return value
}
