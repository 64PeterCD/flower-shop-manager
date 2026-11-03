import { cloneElement } from 'react'

// Một ô nhập có nhãn và thông báo lỗi. `children` là <input>, <select>, <textarea> hoặc <PasswordInput> (id phải trùng `id`).
// Field tự nối lỗi / gợi ý với ô nhập (aria-describedby, aria-invalid) để trình đọc màn hình đọc được lỗi.
export default function Field({ id, label, error, hint, children }) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={`field ${error ? 'field--invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {cloneElement(children, { 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': describedBy })}
      {hint && !error && (
        <span id={`${id}-hint`} className="field__hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
