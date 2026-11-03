import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { getCategories } from '../api/categories.js'
import { getProducts } from '../api/products.js'
import ApiState from '../components/ApiState.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductSkeletons from '../components/ProductSkeletons.jsx'
import useApi from '../hooks/useApi.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { COLOR_FAMILIES, colorFamily } from '../utils/color.js'
import './Pages.css'

export default function Products() {
  usePageTitle('Sản phẩm')

  // Bộ lọc nằm trên URL (/products?category=hoa-bo&color=hong) nên chia sẻ hoặc tải lại trang vẫn giữ nguyên.
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category') ?? 'all'
  const color = searchParams.get('color') ?? 'all'
  const [query, setQuery] = useState('')

  const categoriesApi = useApi(() => getCategories(), [])
  // Danh mục do server lọc: GET /api/products?category=hoa-bo
  const productsApi = useApi(() => getProducts(category === 'all' ? undefined : { category }), [category])

  const keyword = query.trim().toLowerCase()
  const visible = (productsApi.data ?? []).filter(
    (product) =>
      (color === 'all' || colorFamily(product.petalColor) === color) && product.name.toLowerCase().includes(keyword),
  )
  const filtering = category !== 'all' || color !== 'all' || keyword !== ''

  function setFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value === 'all') next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  function resetFilters() {
    setSearchParams({})
    setQuery('')
  }

  return (
    <>
      <PageHeader title="Chọn hoa cho dịp của bạn">Lọc theo danh mục hoặc theo màu hoa bạn thích.</PageHeader>

      <section className="section section--compact">
        <div className="container">
          <div className="filters">
            <div className="filters__group">
              <p className="filters__label" id="filter-category">Danh mục</p>
              <div className="chips" role="group" aria-labelledby="filter-category">
                <button type="button" className="chip" aria-pressed={category === 'all'} onClick={() => setFilter('category', 'all')}>
                  Tất cả
                </button>
                {(categoriesApi.data ?? []).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="chip"
                    aria-pressed={category === item.slug}
                    onClick={() => setFilter('category', item.slug)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filters__group">
              <p className="filters__label" id="filter-color">Sắc hoa</p>
              <div className="chips" role="group" aria-labelledby="filter-color">
                <button type="button" className="chip" aria-pressed={color === 'all'} onClick={() => setFilter('color', 'all')}>
                  Mọi màu
                </button>
                {COLOR_FAMILIES.map((family) => (
                  <button
                    key={family.id}
                    type="button"
                    className="chip"
                    aria-pressed={color === family.id}
                    onClick={() => setFilter('color', family.id)}
                  >
                    <span className="chip__dot" style={{ background: family.swatch }} aria-hidden="true" />
                    {family.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="field filters__search">
              <label htmlFor="product-search">Tìm theo tên</label>
              <input
                id="product-search"
                type="search"
                placeholder="Ví dụ: hồng, tulip..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
          </div>

          {productsApi.loading && !productsApi.data && <ProductSkeletons count={8} />}
          <ApiState loading={false} error={productsApi.error} onRetry={productsApi.reload} />

          {productsApi.data && (
            <>
              <p className="muted result-count" aria-live="polite">
                {visible.length} sản phẩm
              </p>
              {visible.length > 0 ? (
                <div className="grid grid--4">
                  {visible.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <p>Chưa có sản phẩm khớp với bộ lọc này.</p>
                  {filtering && (
                    <button type="button" className="btn btn--outline" onClick={resetFilters}>
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
