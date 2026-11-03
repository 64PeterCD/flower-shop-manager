# Sắc Hoa — website và quản lý shop hoa

Bài thực hành môn Lập trình web (INT1334). Đề tài cuối môn: **quản lý shop hoa**.

Công nghệ: **React 19 + Vite + React Router 8 + Axios** (JavaScript). Dữ liệu sản phẩm, danh mục, đơn hàng, người dùng lấy từ API ASP.NET Core ở project `flower-shop-api` (lab 2, lab 3); thông tin tĩnh của shop nằm ở `src/data/shop.js`.

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

## Đăng ký / đăng nhập (lab 3)

Luồng: **form → kiểm tra dữ liệu → API lưu / truy vấn user trong PostgreSQL → trả JWT → lưu bằng Context + localStorage**.

| Thành phần | File | Vai trò |
|---|---|---|
| Form + kiểm tra dữ liệu | `pages/Register.jsx`, `pages/Login.jsx`, `utils/validators.js` | Email đúng dạng; mật khẩu 8–100 ký tự có chữ và số; nhập lại mật khẩu phải khớp. Lỗi hiện ngay dưới từng ô, lỗi từ API (vd. email đã có) cũng hiện đúng ô. Quy tắc khớp với API vì API vẫn kiểm tra lại. |
| Gọi API | `api/auth.js` | `register`, `login`, `getMe` |
| Lưu phiên | `utils/authStorage.js` | Đọc / ghi / xóa `{ token, expiresAt, user }` ở localStorage (khóa `sachoa.auth`), có `try/catch` phòng khi bị chặn và tự bỏ phiên đã hết hạn |
| **Context** | `context/AuthContext.js`, `context/AuthProvider.jsx`, `hooks/useAuth.js` | `AuthProvider` bọc ngoài `App` (ở `main.jsx`), giữ `user`, `isAuthenticated`, `isAdmin` và các hàm `login`, `register`, `logout`. Mọi component đọc bằng `useAuth()` |
| Gắn token | `api/client.js` | Request interceptor tự thêm `Authorization: Bearer <token>`; response interceptor gặp 401 (token hết hạn / sai) thì xóa phiên và báo cho `AuthProvider` đăng xuất |
| Chặn trang | `components/RequireAdmin.jsx` | `/admin` yêu cầu đăng nhập: chưa đăng nhập → `/login` (đăng nhập xong quay lại đúng trang); không phải Admin → trang 403 |

`AuthProvider` đọc localStorage ngay khi khởi tạo nên tải lại trang vẫn còn đăng nhập, rồi gọi `GET /api/auth/me` để xác nhận token và lấy vai trò mới nhất. Phiên cũng được đồng bộ giữa các tab và tự đăng xuất đúng lúc token hết hạn.

> Việc chặn ở giao diện chỉ để người dùng dễ hiểu; người sửa được code trình duyệt vẫn không vượt được API vì API tự kiểm tra token và vai trò (401 / 403). Token trong localStorage có thể bị lấy nếu trang dính lỗi XSS; cách an toàn hơn là cookie `HttpOnly`.

Để dùng khu `/admin`, đặt email của bạn ở `Auth:AdminEmails` trong API (xem README của `flower-shop-api`) rồi đăng ký tài khoản bằng email đó.

## Các trang (route)

| URL | Trang | File |
|---|---|---|
| `/` | Trang chủ | `src/pages/Home.jsx` + `Home.css` |
| `/about-us` | Giới thiệu | `src/pages/About.jsx` |
| `/products` | Danh sách sản phẩm (lọc theo danh mục `?category=`, tìm kiếm) | `src/pages/Products.jsx` |
| `/products/:productId` | Chi tiết sản phẩm | `src/pages/ProductDetail.jsx` |
| `/order` | Đặt hoa online (form, `?product=` chọn sẵn sản phẩm) | `src/pages/Order.jsx` |
| `/contact` | Liên hệ | `src/pages/Contact.jsx` |
| `/login` | Đăng nhập | `src/pages/Login.jsx` |
| `/register` | Đăng ký | `src/pages/Register.jsx` |
| `/admin` | Quản lý: tổng quan (chỉ Admin) | `src/pages/admin/Dashboard.jsx` |
| `/admin/orders` | Quản lý: đơn hàng (chỉ Admin) | `src/pages/admin/AdminOrders.jsx` |
| `/admin/products` | Quản lý: sản phẩm & tồn kho (chỉ Admin) | `src/pages/admin/AdminProducts.jsx` |
| `*` | 404 | `src/pages/NotFound.jsx` |

Bảng định tuyến nằm ở `src/App.jsx`; `BrowserRouter` được bọc ở `src/main.jsx`. Menu dùng `<NavLink>` (tự thêm class `active`), vào thẳng URL vẫn hiển thị đúng trang vì Vite dev server / preview tự trả `index.html` cho mọi đường dẫn.

> Khi deploy lên hosting tĩnh (Netlify, Vercel, GitHub Pages...) cần cấu hình "rewrite mọi đường dẫn về `index.html`", nếu không vào thẳng `/about-us` sẽ bị 404.

## Cấu trúc thư mục

```
src/
  main.jsx            điểm vào, bọc BrowserRouter
  App.jsx             bảng route
  index.css           biến màu, reset, nút, form dùng chung
  api/                Axios: client.js (+ interceptor token) và auth.js, products.js, orders.js, categories.js
  context/            AuthContext, AuthProvider (trạng thái đăng nhập)
  data/shop.js        thông tin tĩnh của shop, nhãn trạng thái đơn, khung giờ giao
  components/         Header, Footer, Layout, AdminLayout, RequireAdmin, Field, ProductCard, ProductForm, ApiState...
  pages/              các trang công khai (+ pages/admin/ cho khu quản lý)
  hooks/              usePageTitle, useApi (gọi API + trạng thái tải), useAuth
  utils/              format.js (tiền, ngày), validators.js, authStorage.js (localStorage)
```

## Chưa có

- Quên / đổi mật khẩu, xác minh email, trang "đơn của tôi" cho khách.
- Form Liên hệ chỉ hiện xác nhận, chưa có endpoint để gửi đi.
