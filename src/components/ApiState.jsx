import './Cards.css'

// Hiện "đang tải" hoặc lỗi cho các khối dữ liệu lấy từ API; có dữ liệu thì trả null để trang tự vẽ.
export default function ApiState({ loading, error, onRetry }) {
  if (loading) {
    return (
      <p className="api-state" role="status">
        Đang tải dữ liệu...
      </p>
    )
  }
  if (error) {
    return (
      <div className="api-state api-state--error" role="alert">
        <p>{error}</p>
        {onRetry && (
          <button type="button" className="btn btn--outline btn--sm" onClick={onRetry}>
            Thử lại
          </button>
        )}
      </div>
    )
  }
  return null
}
