/**
 * Quy tắc sắp xếp và phân trang dùng chung cho các danh mục canhodanang.store.
 * Không phụ thuộc Astro, không làm thay đổi dữ liệu đầu vào.
 */

export type ListingForSort = {
  id?: string;
  data: {
    title?: string | null;
    featured?: boolean | null;
    featuredOrder?: number | string | null;
    date?: Date | string | number | null;
    updatedAt?: Date | string | number | null;
  };
};

const priority = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined || value === '') return Number.POSITIVE_INFINITY;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : Number.POSITIVE_INFINITY;
};

const timestamp = (value: Date | string | number | null | undefined): number => {
  if (value === null || value === undefined || value === '') return 0;
  const parsed = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Bài ghim trước (featuredOrder nhỏ trước), sau đó bài mới nhất.
 * Nếu các tiêu chí bằng nhau, so theo tên rồi ID để thứ tự ổn định.
 */
export function sortFeaturedFirst<T extends ListingForSort>(items: readonly T[]): T[] {
  return [...items].sort((a, b) => {
    const aPinned = a.data.featured === true;
    const bPinned = b.data.featured === true;
    if (aPinned !== bPinned) return aPinned ? -1 : 1;

    if (aPinned && bPinned) {
      const orderDifference = priority(a.data.featuredOrder) - priority(b.data.featuredOrder);
      // Infinity - Infinity là NaN, vì vậy cần kiểm tra riêng.
      if (Number.isFinite(orderDifference) && orderDifference !== 0) return orderDifference;
      if (priority(a.data.featuredOrder) !== priority(b.data.featuredOrder)) {
        return priority(a.data.featuredOrder) < priority(b.data.featuredOrder) ? -1 : 1;
      }
    }

    const dateDifference = timestamp(b.data.date) - timestamp(a.data.date);
    if (dateDifference !== 0) return dateDifference;

    const nameDifference = (a.data.title || '').localeCompare(b.data.title || '', 'vi');
    return nameDifference || (a.id || '').localeCompare(b.id || '', 'vi');
  });
}

/** Chia danh sách thành từng trang; mặc định 12 mục/trang. */
export function paginateListings<T>(items: readonly T[], page = 1, pageSize = 12) {
  const safeSize = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 12;
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / safeSize));
  const requestedPage = Number.isFinite(page) ? Math.floor(page) : 1;
  const currentPage = Math.min(totalPages, Math.max(1, requestedPage));
  const start = (currentPage - 1) * safeSize;

  return {
    items: items.slice(start, start + safeSize),
    currentPage,
    pageSize: safeSize,
    totalItems,
    totalPages,
    hasPrevious: currentPage > 1,
    hasNext: currentPage < totalPages,
  };
}
