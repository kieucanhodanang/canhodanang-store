/** URL giao dịch riêng, giữ dữ liệu trong collection CMS gốc. */
export function listingUrl(collection: string, id: string, transaction?: string | null): string {
  const slug = encodeURIComponent(id);
  const rental = transaction === 'cho-thue' || transaction === 'cho-thue-ngay';
  return rental
    ? `/cho-thue/${collection === 'can-ho' ? 'can-ho' : 'nha'}/${slug}/`
    : `/${collection}/${slug}/`;
}
