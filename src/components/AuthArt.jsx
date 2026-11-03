import { shop } from '../data/shop.js'
import Bouquet from './Bouquet.jsx'

// Hình minh họa bên trái trang đăng nhập / đăng ký (ẩn trên màn hình hẹp).
export default function AuthArt() {
  return (
    <div className="auth__art" aria-hidden="true">
      <div className="auth__window">
        <Bouquet color="#ec7fa6" kinds={['rose', 'tulip']} seed={2} />
      </div>
      <p className="auth__tagline">{shop.tagline}</p>
    </div>
  )
}
