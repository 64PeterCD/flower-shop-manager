// Đầu trang con: tiêu đề + một câu dẫn, căn trái (không dùng nhãn phụ phía trên tiêu đề).
export default function PageHeader({ title, children }) {
  return (
    <section className="page-header">
      <div className="container">
        <h1>{title}</h1>
        {children && <p className="page-header__lead">{children}</p>}
      </div>
    </section>
  )
}
