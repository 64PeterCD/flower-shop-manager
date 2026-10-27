# Sắc Hoa — website và quản lý shop hoa

Bài thực hành môn Lập trình web (INT1334). Đề tài cuối môn: **quản lý shop hoa**.

Công nghệ: **React 19 + Vite + React Router 8 + Axios** (JavaScript). Dữ liệu sản phẩm, danh mục, đơn hàng lấy từ API ASP.NET Core ở project `flower-shop-api` (lab 2); thông tin tĩnh của shop nằm ở `src/data/shop.js`.

## Chạy project

Cần Node.js ≥ 20.19 (yêu cầu của Vite 8) và **back-end `flower-shop-api` đang chạy** ở `http://localhost:5080` (xem README của project đó). Nếu API ở địa chỉ khác, sao chép `.env.example` thành `.env` và sửa `VITE_API_URL`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production vào dist/
npm run preview  # chạy thử bản build (cổng 3000)
npm run lint
```

## Gọi API bằng Axios (`src/api/`)

`client.js` tạo một instance Axios dùng chung (baseURL, header JSON, timeout, hàm đổi lỗi thành câu tiếng Việt). Mỗi nhóm endpoint có một file:

| Phương thức | Hàm | Dùng ở |
|---|---|---|
| GET | `getProducts`, `getProduct`, `getCategories`, `getOrders` | Trang chủ, Sản phẩm, Chi tiết, Quản lý |
| POST | `createOrder`, `createProduct` | Form Đặt hoa; Quản lý → Thêm sản phẩm |
| PUT | `updateOrder`, `updateProduct` | Quản lý → đổi trạng thái đơn; Sửa sản phẩm |
| DELETE | `deleteOrder`, `deleteProduct` | Quản lý → Xóa đơn đã hủy; Xóa sản phẩm |

Hook `src/hooks/useApi.js` gọi API khi trang mở và trả `{ data, loading, error, status, reload }`; component `ApiState` hiện trạng thái đang tải / lỗi kèm nút "Thử lại".

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
  api/                Axios: client.js + products.js, orders.js, categories.js
  data/shop.js        thông tin tĩnh của shop, nhãn trạng thái đơn, khung giờ giao
  components/         Header, Footer, Layout, AdminLayout, ProductCard, ProductForm, ApiState...
  pages/              các trang công khai (+ pages/admin/ cho khu quản lý)
  hooks/              usePageTitle (đổi tiêu đề tab), useApi (gọi API + trạng thái tải)
  utils/format.js     định dạng tiền, ngày
```

## Chưa có

- Đăng nhập: `/admin` và các endpoint ghi của API đang mở cho mọi người.
- Form Liên hệ chỉ hiện xác nhận, chưa có endpoint để gửi đi.
