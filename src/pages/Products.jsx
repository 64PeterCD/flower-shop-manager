import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { getCategories } from '../api/categories.js'
import { getProducts } from '../api/products.js'
import ApiState from '../components/ApiState.jsx'
import ProductCard from '../components/ProductCard.jsx'
import useApi from '../hooks/useApi.js'
import usePageTitle from '../hooks/usePageTitle.js'
import './Pages.css'

export default function Products() {
  usePageTitle('Sản phẩm')

  // Danh mục nằm trên URL (/products?category=hoa-bo) nên chia sẻ / tải lại trang vẫn giữ bộ lọc.
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'all'
  const [query, setQuery] = useState('')

  const categoriesApi = useApi(() => getCategories(), [])
  // Lọc danh mục do server làm: GET /api/products?category=hoa-bo
  const productsApi = useApi(() => getProducts(category === 'all' ? undefined : { category }), [category])

  const keyword = query.trim().toLowerCase()
  const visible = (productsApi.data ?? []).filter((product) => product.name.toLowerCase().includes(keyword))

  function selectCategory(slug) {
    setSearchParams(slug === 'all' ? {} : { category: slug })
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">Sản phẩm</p>
          <h1>Chọn hoa cho dịp của bạn</h1>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="chips" role="group" aria-label="Lọc theo danh mục">
              <button type="button" className="chip" aria-pressed={category === 'all'} onClick={() => selectCategory('all')}>
                Tất cả
              </button>
              {(categoriesApi.data ?? []).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="chip"
                  aria-pressed={category === item.slug}
                  onClick={() => selectCategory(item.slug)}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="field toolbar__search">
              <label htmlFor="product-search">Tìm sản phẩm</label>
              <input
                id="product-search"
                type="search"
                placeholder="Ví dụ: hồng, tulip..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          <ApiState loading={productsApi.loading} error={productsApi.error} onRetry={productsApi.reload} />

          {productsApi.data && (
            <>
              <p className="muted" aria-live="polite">Hiển thị {visible.length} sản phẩm</p>
              {visible.length > 0 ? (
                <div className="grid grid--4">
                  {visible.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <p className="empty">Không có sản phẩm phù hợp. Thử đổi danh mục hoặc từ khóa khác nhé.</p>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
