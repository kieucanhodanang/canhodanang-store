/**
 * Chuẩn hóa giá hiển thị từ CMS. priceValue lưu theo triệu đồng.
 * Không suy diễn đơn vị cho tin thuê nếu người đăng chưa ghi rõ.
 */
export function formatListingPrice(
  price: string | number | null | undefined,
  transaction?: string | null,
  priceValue?: number | null,
): string {
  const raw = String(price ?? '').trim();
  if (!raw) return 'Liên hệ';
  const normalized = raw.toLocaleLowerCase('vi-VN').replace(/\s+/g, ' ');
  if (/^(liên hệ|lien he|thỏa thuận|thoả thuận|thoa thuan|đang cập nhật)$/i.test(normalized)) return raw;
  // Đã ghi đơn vị, kỳ hạn hoặc mức giá dạng khoảng: giữ nguyên để không bổ sung trùng.
  if (/(tỷ|tỉ|ty\b|triệu|trieu|nghìn|ngàn|nghin|vnd|vnđ|đồng|\bđ\b|usd|\$|\/|–|—|\s-\s)/i.test(normalized)) return raw;
  // Chỉ tự bổ sung tỷ khi chắc chắn là tin bán và số nhập là giá tính bằng tỷ.
  if (transaction === 'ban' && /^\d+(?:[.,]\d+)?$/.test(raw)) {
    const numeric = Number(raw.replace(',', '.'));
    if (Number.isFinite(numeric) && numeric > 0) {
      // Nếu priceValue xác nhận giá bán tính bằng triệu, đối chiếu để tránh biến 850 thành 850 tỷ.
      if (typeof priceValue === 'number' && Number.isFinite(priceValue) && priceValue > 0) {
        if (Math.abs(priceValue - numeric) < 0.01) return `${raw} triệu`;
        if (Math.abs(priceValue / 1000 - numeric) > 0.01) return raw;
      }
      return `${raw} tỷ`;
    }
  }
  return raw;
}
