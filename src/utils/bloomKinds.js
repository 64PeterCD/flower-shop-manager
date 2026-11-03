// Đoán loại hoa vẽ trong tranh bó hoa từ mô tả "Thành phần" của sản phẩm.
const KIND_BY_PREFIX = [
  [/^hồng(?! phấn| pastel)/, 'rose'], // "Hồng đỏ" là hoa hồng, còn "hồng phấn" chỉ là màu
  [/^hướng dương/, 'sunflower'],
  [/^tulip/, 'tulip'],
  [/^cẩm tú cầu/, 'hydrangea'],
  [/^(cúc|đồng tiền|cát tường|lay ơn|lan|mẫu đơn|hoa mận)/, 'daisy'],
]

// "Tulip hồng, hoa mận, lá eucalyptus" -> ['tulip', 'daisy']; không nhận ra gì thì dùng hồng + cúc.
export function bloomKinds(flowers = '') {
  const kinds = []
  for (const item of flowers.toLowerCase().split(',')) {
    const rule = KIND_BY_PREFIX.find(([pattern]) => pattern.test(item.trim()))
    if (rule && !kinds.includes(rule[1])) kinds.push(rule[1])
  }
  return kinds.length > 0 ? kinds : ['rose', 'daisy']
}
