/** URLs for sales and rentals, independent from the collection used by Decap CMS.
 * Project houses/villas/shop-houses belong to the project URL hierarchy.
 * Existing standalone houses keep their /nha-dat-tho-cu/ URLs.
 */
export function listingUrl(collection: string, id: string, transaction?: string | null, project?: string | null): string {
  const slug = encodeURIComponent(id);
  const rental = transaction === 'cho-thue' || transaction === 'cho-thue-ngay';

  if (!rental && collection === 'nha-dat-tho-cu' && project && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project)) {
    return `/du-an/${encodeURIComponent(project)}/${slug}/`;
  }
  return rental
    ? `/cho-thue/${collection === 'can-ho' ? 'can-ho' : 'nha'}/${slug}/`
    : `/${collection}/${slug}/`;
}
