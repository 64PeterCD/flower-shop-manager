import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { getErrorMessage, getFieldErrors } from '../api/client.js'
import Field from '../components/Field.jsx'
import useAuth from '../hooks/useAuth.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { compactErrors, validateConfirmPassword, validateEmail, validateNewPassword } from '../utils/validators.js'
import './Auth.css'

export default function Register() {
  usePageTitle('Đăng ký')
  const { isAuthenticated, register } = useAuth()
  const location = useLocation()
  const from = location.state?.from?.pathname ?? '/'

  const [form, setForm] = useState({ email: '', password: '', confirm: '' })
  const [touched, setTouched] = useState({}) // ô đã được chạm vào (rời khỏi) -> bắt đầu hiện lỗi
  const [submitted, setSubmitted] = useState(false)
  const [serverErrors, setServerErrors] = useState({}) // lỗi do API trả về, theo từng ô
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) return <Navigate to={from} replace />

  // Kiểm tra dữ liệu ngay trên trình duyệt (cho phản hồi nhanh); API sẽ kiểm tra lại.
  const clientErrors = compactErrors({
    email: validateEmail(form.email.trim()),
    password: validateNewPassword(form.password),
    confirm: validateConfirmPassword(form.password, form.confirm),
  })

  const errorOf = (name) => ((submitted || touched[name]) && clientErrors[name]) || serverErrors[name]

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setServerErrors((current) => ({ ...current, [name]: undefined }))
  }

  function handleBlur(event) {
    setTouched((current) => ({ ...current, [event.target.name]: true }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
    setSubmitError('')
    if (Object.keys(clientErrors).length > 0) return

    setSubmitting(true)
    try {
      await register(form.email.trim(), form.password)
    } catch (error) {
      const fieldErrors = getFieldErrors(error)
      if (Object.keys(fieldErrors).length > 0) setServerErrors(fieldErrors)
      else if (error.response?.status === 409) setServerErrors({ email: getErrorMessage(error) })
      else setSubmitError(getErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <section className="section">
      <div className="container auth">
        <form className="form panel auth__card" onSubmit={handleSubmit} noValidate>
          <div>
            <p className="eyebrow">Tài khoản</p>
            <h1>Đăng ký</h1>
          </div>

          <Field id="email" label="Email" error={errorOf('email')}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>
          <Field id="password" label="Mật khẩu" error={errorOf('password')} hint="Từ 8 ký tự, gồm cả chữ và số.">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>
          <Field id="confirm" label="Nhập lại mật khẩu" error={errorOf('confirm')}>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          {submitError && (
            <p className="field__error" role="alert">
              {submitError}
            </p>
          )}

          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
          </button>

          <p className="auth__switch">
            Đã có tài khoản? <Link to="/login" state={location.state}>Đăng nhập</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
