import { useState } from 'react'
import Icon from './Icon.jsx'

// Ô mật khẩu có nút hiện / ẩn (giúp gõ đúng trên điện thoại); vẫn cho dán và dùng trình quản lý mật khẩu.
export default function PasswordInput({ id, name, value, onChange, onBlur, autoComplete, ...aria }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password">
      <input
        id={id}
        name={name}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        {...aria}
      />
      <button
        type="button"
        className="password__toggle"
        aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        <Icon name={visible ? 'eyeOff' : 'eye'} size={20} />
      </button>
    </div>
  )
}
