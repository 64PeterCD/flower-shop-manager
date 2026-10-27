// Thông tin tĩnh của shop. Sản phẩm, danh mục và đơn hàng lấy từ API back-end (src/api/).
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

// Tồn kho từ mức này trở xuống được coi là "sắp hết".
export const LOW_STOCK = 5

// Trạng thái đơn: khóa là giá trị API trả về (enum OrderStatus), giá trị là nhãn hiển thị.
export const orderStatusLabels = {
  New: 'Mới',
  Preparing: 'Đang chuẩn bị',
  Delivering: 'Đang giao',
  Completed: 'Hoàn thành',
  Cancelled: 'Đã hủy',
}

export const orderStatuses = Object.keys(orderStatusLabels)

export const deliverySlots = ['08:00 – 10:00', '10:00 – 12:00', '13:00 – 15:00', '15:00 – 17:00', '17:00 – 19:00', '19:00 – 21:00']
