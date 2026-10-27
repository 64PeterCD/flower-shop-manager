// Dữ liệu mẫu cho bài thực hành (chưa có back-end / cơ sở dữ liệu).
// Tên shop, địa chỉ, số điện thoại... là thông tin giả lập, thay bằng thông tin thật khi cần.

export const shop = {
  name: 'Sắc Hoa',
  tagline: 'Gửi yêu thương qua từng cánh hoa',
  intro:
    'Hoa tươi nhập mỗi sáng, cắm tay theo yêu cầu và giao tận nơi trong ngày. Chọn mẫu có sẵn hoặc nhờ Sắc Hoa thiết kế riêng cho dịp của bạn.',
  address: '88 Lê Lợi, Quận 1, TP.HCM',
  phone: '0909 123 456',
  email: 'hello@sachoa.vn',
  hours: '07:00 – 21:00, mở cửa mỗi ngày',
}

export const categories = [
  { id: 'hoa-bo', name: 'Hoa bó', description: 'Bó hoa cho sinh nhật, kỷ niệm và những lời muốn nói.', petal: '#d9506f' },
  { id: 'gio-hop', name: 'Giỏ & hộp hoa', description: 'Hoa cắm sẵn, đặt lên bàn là đẹp.', petal: '#8fa8e8' },
  { id: 'khai-truong', name: 'Hoa khai trương', description: 'Kệ hoa chúc mừng, nổi bật trước cửa hàng.', petal: '#ee8a33' },
  { id: 'hoa-cuoi', name: 'Hoa cưới', description: 'Hoa cầm tay và phụ kiện cho ngày trọng đại.', petal: '#e9c9d2' },
]

export const products = [
  {
    id: 'hong-do-tinh-yeu',
    name: 'Bó hồng đỏ Tình Yêu',
    categoryId: 'hoa-bo',
    price: 450000,
    stock: 12,
    petal: '#c2274b',
    flowers: 'Hồng đỏ Ecuador, baby trắng, lá bạc',
    description: 'Mười một bông hồng đỏ gói giấy kraft, thích hợp tặng người thương nhân dịp kỷ niệm hoặc Valentine.',
    featured: true,
  },
  {
    id: 'huong-duong-nang-som',
    name: 'Bó hướng dương Nắng Sớm',
    categoryId: 'hoa-bo',
    price: 380000,
    stock: 8,
    petal: '#f2b01e',
    flowers: 'Hướng dương, cúc tana, lá bạc',
    description: 'Sắc vàng rực rỡ mang năng lượng tích cực, hợp tặng bạn bè, đồng nghiệp hoặc chúc mừng tốt nghiệp.',
    featured: true,
  },
  {
    id: 'tulip-hong-pastel',
    name: 'Bó tulip Hồng Pastel',
    categoryId: 'hoa-bo',
    price: 520000,
    stock: 4,
    petal: '#f09ab5',
    flowers: 'Tulip hồng, hoa mận, lá eucalyptus',
    description: 'Tulip nhập theo mùa, tông hồng phấn dịu dàng. Số lượng có hạn mỗi tuần.',
    featured: true,
  },
  {
    id: 'gio-cam-tu-cau',
    name: 'Giỏ hoa Cẩm Tú Cầu',
    categoryId: 'gio-hop',
    price: 650000,
    stock: 6,
    petal: '#8fa8e8',
    flowers: 'Cẩm tú cầu xanh, hồng phấn, cúc mẫu đơn',
    description: 'Giỏ mây cắm sẵn với cẩm tú cầu đầy đặn, thêm thiệp viết tay theo yêu cầu.',
    featured: true,
  },
  {
    id: 'hop-hoa-mua-xuan',
    name: 'Hộp hoa Mùa Xuân',
    categoryId: 'gio-hop',
    price: 590000,
    stock: 3,
    petal: '#e58bb8',
    flowers: 'Hồng spray, cát tường, hoa lan tỏi',
    description: 'Hộp tròn cắm hoa tươi nhiều tầng màu, gọn nhẹ, dễ mang đi tặng.',
    featured: false,
  },
  {
    id: 'ke-phat-tai',
    name: 'Kệ hoa Phát Tài',
    categoryId: 'khai-truong',
    price: 1200000,
    stock: 5,
    petal: '#ee8a33',
    flowers: 'Đồng tiền cam, hồng vàng, lan vũ nữ',
    description: 'Kệ hoa hai tầng cao 1,6 m chúc mừng khai trương. Giao và dựng tại cửa hàng.',
    featured: false,
  },
  {
    id: 'ke-thanh-cong',
    name: 'Kệ hoa Thành Công',
    categoryId: 'khai-truong',
    price: 1500000,
    stock: 2,
    petal: '#d63f3f',
    flowers: 'Hồng đỏ, lay ơn, hướng dương, lá phát tài',
    description: 'Kệ hoa lớn tông đỏ – vàng, cao 1,8 m, phù hợp lễ khai trương, kỷ niệm thành lập.',
    featured: false,
  },
  {
    id: 'hoa-cam-tay-thien-than',
    name: 'Hoa cầm tay Thiên Thần',
    categoryId: 'hoa-cuoi',
    price: 850000,
    stock: 7,
    petal: '#efd9de',
    flowers: 'Hồng trắng, lan Mokara, baby, lá bạc',
    description: 'Bó hoa cưới tông trắng kem, kèm hoa cài áo cho chú rể. Hẹn thử trước 3 ngày.',
    featured: false,
  },
]

export const LOW_STOCK = 5

export const orderStatuses = ['Mới', 'Đang chuẩn bị', 'Đang giao', 'Hoàn thành', 'Đã hủy']

export const orders = [
  { id: 'HOA-1042', customer: 'Nguyễn Thu Hà', phone: '0900 000 001', items: [{ productId: 'hong-do-tinh-yeu', qty: 1 }], delivery: '27/10/2026 · 15:00', status: 'Mới' },
  { id: 'HOA-1041', customer: 'Trần Minh Quân', phone: '0900 000 002', items: [{ productId: 'ke-phat-tai', qty: 2 }], delivery: '27/10/2026 · 10:00', status: 'Đang giao' },
  { id: 'HOA-1040', customer: 'Lê Bảo Châu', phone: '0900 000 003', items: [{ productId: 'tulip-hong-pastel', qty: 1 }, { productId: 'gio-cam-tu-cau', qty: 1 }], delivery: '27/10/2026 · 17:30', status: 'Đang chuẩn bị' },
  { id: 'HOA-1039', customer: 'Phạm Gia Hân', phone: '0900 000 004', items: [{ productId: 'hoa-cam-tay-thien-than', qty: 1 }], delivery: '26/10/2026 · 08:00', status: 'Hoàn thành' },
  { id: 'HOA-1038', customer: 'Võ Anh Tuấn', phone: '0900 000 005', items: [{ productId: 'huong-duong-nang-som', qty: 3 }], delivery: '26/10/2026 · 14:00', status: 'Hoàn thành' },
  { id: 'HOA-1037', customer: 'Đặng Khánh Linh', phone: '0900 000 006', items: [{ productId: 'hop-hoa-mua-xuan', qty: 1 }], delivery: '25/10/2026 · 19:00', status: 'Đã hủy' },
  { id: 'HOA-1036', customer: 'Hoàng Đức Long', phone: '0900 000 007', items: [{ productId: 'ke-thanh-cong', qty: 1 }], delivery: '25/10/2026 · 09:00', status: 'Hoàn thành' },
]

export const deliverySlots = ['08:00 – 10:00', '10:00 – 12:00', '13:00 – 15:00', '15:00 – 17:00', '17:00 – 19:00', '19:00 – 21:00']

export function getCategory(id) {
  return categories.find((c) => c.id === id)
}

export function getProduct(id) {
  return products.find((p) => p.id === id)
}

export function orderTotal(order) {
  return order.items.reduce((sum, item) => sum + getProduct(item.productId).price * item.qty, 0)
}
