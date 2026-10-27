# Sắc Hoa — website và quản lý shop hoa

Bài thực hành môn Lập trình web (INT1334). Đề tài cuối môn: **quản lý shop hoa**.

Công nghệ: **React 19 + Vite + React Router 8** (JavaScript, không dùng back-end — dữ liệu là dữ liệu mẫu trong `src/data/shop.js`).

## Chạy project

Cần Node.js ≥ 20.19 (yêu cầu của Vite 8).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production vào dist/
npm run preview  # chạy thử bản build (cổng 3000)
npm run lint
```

## Các trang (route)

| URL | Trang | File |
|---|---|---|
| `/` | Trang chủ | `src/pages/Home.jsx` + `Home.css` |
| `/about-us` | Giới thiệu | `src/pages/About.jsx` |
| `/products` | Danh sách sản phẩm (lọc theo danh mục `?category=`, tìm kiếm) | `src/pages/Products.jsx` |
| `/products/:productId` | Chi tiết sản phẩm | `src/pages/ProductDetail.jsx` |
| `/order` | Đặt hoa online (form, `?product=` chọn sẵn sản phẩm) | `src/pages/Order.jsx` |
| `/contact` | Liên hệ | `src/pages/Contact.jsx` |
| `/admin` | Quản lý: tổng quan | `src/pages/admin/Dashboard.jsx` |
| `/admin/orders` | Quản lý: đơn hàng (lọc theo trạng thái) | `src/pages/admin/AdminOrders.jsx` |
| `/admin/products` | Quản lý: sản phẩm & tồn kho | `src/pages/admin/AdminProducts.jsx` |
| `*` | 404 | `src/pages/NotFound.jsx` |

Bảng định tuyến nằm ở `src/App.jsx`; `BrowserRouter` được bọc ở `src/main.jsx`. Menu dùng `<NavLink>` (tự thêm class `active`), vào thẳng URL vẫn hiển thị đúng trang vì Vite dev server / preview tự trả `index.html` cho mọi đường dẫn.

> Khi deploy lên hosting tĩnh (Netlify, Vercel, GitHub Pages...) cần cấu hình "rewrite mọi đường dẫn về `index.html`", nếu không vào thẳng `/about-us` sẽ bị 404.

## Cấu trúc thư mục

```
src/
  main.jsx            điểm vào, bọc BrowserRouter
  App.jsx             bảng route
  index.css           biến màu, reset, nút, form dùng chung
  data/shop.js        thông tin shop, danh mục, sản phẩm, đơn hàng mẫu
  components/         Header, Footer, Layout, AdminLayout, ProductCard, FlowerArt...
  pages/              các trang công khai (+ pages/admin/ cho khu quản lý)
  hooks/usePageTitle.js   đổi tiêu đề tab theo trang
  utils/format.js     định dạng tiền
```

## Chưa có

- Back-end / cơ sở dữ liệu: form đặt hoa và liên hệ chỉ hiện xác nhận, chưa gửi đi đâu.
- Đăng nhập: `/admin` đang mở cho mọi người, chỉ là giao diện quản lý mẫu.
- Thêm / sửa / xóa sản phẩm và đổi trạng thái đơn trong khu quản lý.
