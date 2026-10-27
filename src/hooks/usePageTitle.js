import { useEffect } from 'react'
import { shop } from '../data/shop.js'

// Đổi tiêu đề tab theo trang, để vào thẳng bằng URL vẫn thấy đúng tên trang.
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${shop.name}` : shop.name
  }, [title])
}
