import { createContext } from 'react'

// "Hộp chứa" dùng chung cho toàn ứng dụng; giá trị do <AuthProvider> cung cấp, đọc bằng useAuth().
export const AuthContext = createContext(null)
