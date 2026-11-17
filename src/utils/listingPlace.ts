/** Consistent card address: street/address first, then ward (district fallback).
 * Avoid appending the same locality twice when the CMS address already includes it.
 * Never infer a ward from the street or project.
 */
export function listingPlace(
  address?: string | null,
  ward?: string | null,
  district?: string | null,
): string {
  const street = String(address || '').trim();
  const locality = String(ward || district || '').trim();
  const normalize = (value: string) => value.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .replace(/^(phuong|xa|quan|huyen)\s+/i, '')
    .toLowerCase().trim();
  const hasLocality = locality && street && normalize(street).includes(normalize(locality));
  return [street, hasLocality ? '' : locality].filter(Boolean).join(', ');
}
