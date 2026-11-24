import { getCollection } from 'astro:content';
import { formatListingPrice } from '../utils/formatListingPrice';
import { listingUrl } from '../utils/listingUrl';
import optimizedAssets from '../data/optimized-assets.json';
export const prerender = true;
export async function GET() {
const optimizedCardSrc = (source, size = 'small') => optimizedAssets[source]?.[size] || source;
const listingHighlightTags = (raw) => Array.isArray(raw)
  ? raw.map(value => typeof value === 'string' ? value : value?.label)
      .filter(value => typeof value === 'string' && value.trim())
      .map(value => value.trim().slice(0, 40)).slice(0, 3)
  : [];

const projects = (await getCollection('du-an')).filter(item => item.data.status !== 'draft');
const projectNames = new Map(projects.map(item => [item.id, item.data.title]));
const listingCollections = await Promise.all([getCollection('can-ho'), getCollection('nha-dat-tho-cu')]);
const listingTypes = ['can-ho', 'nha-dat-tho-cu'];
const searchableListings = listingCollections.flatMap((entries, index) =>
  entries.filter((item) => item.data.status === 'published' && item.data.listingStatus === 'available')
    .map((item) => {
      const d = item.data;
      const numeric = (value) => value === undefined || value === null || value === ''
        ? null : (Number.isFinite(Number(value)) ? Number(value) : null);
      const project = d.project || '';
      const type = listingTypes[index];
      const transaction = d.transaction || 'ban';
      const priceMillion = numeric(d.priceValue);
      return {
        title: d.title || item.id,
        publishedAt: d.date instanceof Date && !Number.isNaN(d.date.getTime()) ? d.date.getTime() : 0,
        featured: Boolean(d.featured),
        highlightTags: listingHighlightTags(d.highlightTags),
        featuredOrder: numeric(d.featuredOrder),
        description: d.description || '',
        project,
        projectName: projectNames.get(project) || '',
        district: d.district || '',
        ward: d.ward || '',
        address: d.address || '',
        url: listingUrl(type, item.id, transaction),
        type,
        propertyType: d.propertyType || type,
        transaction,
        // Giá chuẩn hóa trong CMS là triệu đồng; bộ lọc bán dùng tỷ, thuê dùng triệu.
        price: transaction === 'ban' && priceMillion !== null ? priceMillion / 1000 : null,
        rent: transaction !== 'ban' ? priceMillion : null,
        priceText: formatListingPrice(d.price, transaction, priceMillion),
        area: numeric(d.areaValue),
        areaText: d.area || '',
        bedrooms: numeric(d.bedrooms),
        direction: d.direction || '',
        image: typeof d.image === 'string' && d.image.startsWith('/') ? optimizedCardSrc(d.image) : '',
      };
    })
);

return new Response(JSON.stringify(searchableListings), {headers: {'Content-Type':'application/json; charset=utf-8'}});
}
