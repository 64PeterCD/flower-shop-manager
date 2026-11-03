// Một ô nhập có nhãn và thông báo lỗi; `children` là <input>, <select> hoặc <textarea> (cần id trùng với `id` ở đây).
export default function Field({ id, label, error, hint, children }) {
  return (
    <div className={`field ${error ? 'field--invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && (
        <span className="field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  )
}
