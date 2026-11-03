// Sau khi gửi form bị lỗi: đưa con trỏ về ô lỗi đầu tiên để người dùng bàn phím / đọc màn hình biết chỗ cần sửa.
// `order` là danh sách id ô theo thứ tự hiện trên trang; `errors` là { idÔ: thôngBáoLỗi }.
export function focusFirstInvalid(errors, order) {
  const firstId = order.find((id) => errors[id])
  if (firstId) document.getElementById(firstId)?.focus()
}
