
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Cấu hình tương ứng với public/admin/config.yml.
// Các trường không bắt buộc có thể để trống trong Decap CMS.
const optionalText = z.string().nullish();
const optionalNumber = z.coerce.number().nullish();
const optionalDate = z.coerce.date().nullish();

const seoFields = {
  title: z.string(),
  description: z.string(),
  seoTitle: optionalText,
  image: optionalText,
  imageAlt: optionalText,
  ogImage: optionalText,
  date: optionalDate,
  updatedAt: optionalDate,
  status: z.enum(['published', 'draft']).default('published'),
  showOnHome: z.boolean().default(false),
  featured: z.boolean().default(false),
  featuredOrder: optionalNumber,
};

const propertyFields = {
  ...seoFields,
  project: optionalText,
  transaction: z.enum(['ban', 'cho-thue', 'cho-thue-ngay']).default('ban'),
  listingStatus: z.enum(['available', 'closed', 'paused']).default('available'),

  // Giá và diện tích dạng văn bản.
  price: optionalText,
  area: optionalText,

  // Giá trị số dùng để lọc.
  // priceValue: triệu đồng; areaValue: mét vuông.
  priceValue: optionalNumber,
  areaValue: optionalNumber,

  bedrooms: optionalNumber,
  district: optionalText,
  ward: optionalText,
  address: optionalText,
  legal: optionalText,
  direction: optionalText,
  gallery: z.array(z.string()).nullish(),
};

const canHo = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/can-ho' }),
  schema: z.object({
    ...propertyFields,
    price: z.string(),
    area: z.string(),
    address: z.string(),
    image: z.string(),
    bathrooms: optionalNumber,

    // Thông số căn hộ bổ sung.
    balconyDirection: optionalText,
    interior: optionalText,
  }),
});

const duAn = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/du-an' }),
  schema: z.object({
    ...seoFields,
    location: z.string(),
    image: z.string(),
    developer: optionalText,
    propertyTypes: z.array(z.string()).nullish(),
    gallery: z.array(z.string()).nullish(),
    logo: optionalText,
    logoAlt: optionalText,
    distributionStatus: z.enum([
      'dang-phan-phoi',
      'sap-mo-ban',
      'ngung-phan-phoi',
    ]).default('dang-phan-phoi'),
    showLogoInFooter: z.boolean().default(true),
    logoOrder: optionalNumber,
    showInMenu: z.boolean().default(true),
  }),
});

const bietThu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/biet-thu' }),
  schema: z.object({
    ...propertyFields,
    image: z.string(),
    propertyType: z.string(),
    floors: optionalNumber,

    // Thông số biệt thự / shophouse bổ sung.
    frontage: optionalText,
    roadWidth: optionalText,
    interior: optionalText,
    bathrooms: optionalNumber,
  }),
});

const thoCu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tho-cu' }),
  schema: z.object({
    ...propertyFields,
    image: z.string(),
    propertyType: z.string(),
    district: z.string(),
    address: z.string(),
    price: z.string(),
    area: z.string(),
    frontage: optionalText,
    floors: optionalNumber,

    // Thông số nhà đất bổ sung.
    roadWidth: optionalText,
    interior: optionalText,
    bathrooms: optionalNumber,
  }),
});

const baiViet = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/bai-viet' }),
  schema: z.object({
    ...seoFields,
    date: z.coerce.date(),
    category: optionalText,
  }),
});

export const collections = {
  'can-ho': canHo,
  'du-an': duAn,
  'biet-thu': bietThu,
  'tho-cu': thoCu,
  'bai-viet': baiViet,
};
