import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { getErrorMessage } from '../api/client.js'
import AuthArt from '../components/AuthArt.jsx'
import Field from '../components/Field.jsx'
import PasswordInput from '../components/PasswordInput.jsx'
import useAuth from '../hooks/useAuth.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { focusFirstInvalid } from '../utils/focus.js'
import { compactErrors, validateEmail } from '../utils/validators.js'
import './Auth.css'

export default function Login() {
  usePageTitle('Đăng nhập')
  const { isAuthenticated, login } = useAuth()
  const location = useLocation()
  // Nếu bị chuyển tới đây từ trang cần đăng nhập (RequireAdmin) thì sau khi đăng nhập quay lại đúng trang đó.
  const from = location.state?.from?.pathname ?? '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Đăng nhập xong (hoặc đã đăng nhập từ trước) thì rời khỏi trang này.
  if (isAuthenticated) return <Navigate to={from} replace />

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const email = form.email.trim()
    const found = compactErrors({
      email: validateEmail(email),
      password: form.password ? '' : 'Vui lòng nhập mật khẩu.',
    })
    setErrors(found)
    setSubmitError('')
    if (Object.keys(found).length > 0) {
      focusFirstInvalid(found, ['email', 'password'])
      return
    }

    setSubmitting(true)
    try {
      await login(email, form.password)
    } catch (error) {
      setSubmitError(getErrorMessage(error))
      setSubmitting(false)
    }
  }

  return (
    <section className="section">
      <div className="container auth">
        <AuthArt />

        <form className="form auth__card" onSubmit={handleSubmit} noValidate>
          <div>
            <h1>Đăng nhập</h1>
            <p className="muted">Dùng email và mật khẩu bạn đã đăng ký.</p>
          </div>

          <Field id="email" label="Email" error={errors.email}>
            <input id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} />
          </Field>
          <Field id="password" label="Mật khẩu" error={errors.password}>
            <PasswordInput id="password" name="password" autoComplete="current-password" value={form.password} onChange={handleChange} />
          </Field>

          {submitError && (
            <p className="field__error" role="alert">
              {submitError}
            </p>
          )}

          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          <p className="auth__switch">
            Chưa có tài khoản? <Link to="/register" state={location.state}>Đăng ký</Link>
          </p>
        </form>
      </div>
    </section>
  )
}
