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
  // Phân loại riêng cho sản phẩm thuộc Vinhomes Hải Vân Bay.
  subdivision: z.enum(['tinh-van', 'bach-van', 'dao-ngoc', 'vinh-may']).nullish(),
  projectPropertyType: z.enum([
    'biet-thu-don-lap',
    'biet-thu-song-lap',
    'biet-thu-lien-ke',
    'shophouse',
    'can-ho-cao-tang',
    'resort',
  ]).nullish(),
  productCode: optionalText,
  transaction: z.enum(['ban', 'cho-thue', 'cho-thue-ngay']).default('ban'),
  listingStatus: z.enum(['available', 'closed', 'paused']).default('available'),
  price: optionalText,
  area: optionalText,
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
    areaSlug: z.enum(['son-tra', 'ngu-hanh-son', 'hai-chau']).nullish(),
    price: z.string(),
    area: z.string(),
    address: z.string(),
    image: z.string(),
    bathrooms: optionalNumber,
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
    district: optionalText,
    totalArea: optionalText,
    towerCount: optionalText,
    unitCount: optionalText,
    handoverDate: optionalText,
    buildingDensity: optionalText,
    googleMapsEmbed: optionalText,
    showGoogleMap: z.boolean().default(true),
    introSlogan: z.object({
      firstLine: optionalText,
      highlight: optionalText,
      lastLine: optionalText,
    }).nullish(),
    nearbyAmenities: z.array(z.object({
      name: z.string(),
      distance: optionalText,
      travelTime: optionalText,
      note: optionalText,
    })).nullish(),
    floorPlanText: optionalText,
    floorPlanImages: z.array(z.string()).nullish(),
    // Bộ mặt bằng 2D: từng tab có ảnh và nội dung riêng.
    floorPlanItems: z.array(z.object({
      title: z.string(),
      image: z.string(),
      description: optionalText,
      imageAlt: optionalText,
    })).nullish(),
    // Các layer tùy chỉnh của giao diện dự án mới.
    contentLayers: z.array(z.object({
      // Legacy CMS layers retain their original layout; new layers use type.
      enabled: z.boolean().optional(),
      adminLabel: optionalText,
      type: z.enum(['split', 'text-gallery', 'four-images', 'full-image', 'rich-text', 'map-amenities', 'tabs', 'property-cards', 'related-cards']).optional(),
      heading: optionalText,
      subheading: optionalText,
      text: optionalText,
      layout: z.enum(['split', 'text-gallery', 'full-image']).optional(),
      imageSide: z.enum(['auto', 'left', 'right']).optional(),
      images: z.array(z.object({
        image: z.string(),
        captionTitle: optionalText,
        caption: optionalText,
        imageAlt: optionalText,
      })).nullish(),
      tabs: z.array(z.object({
        title: z.string(),
        image: optionalText,
        imageAlt: optionalText,
        text: optionalText,
      })).nullish(),
      mapEmbed: optionalText,
      amenities: z.array(z.object({
        name: z.string(),
        distance: optionalText,
        travelTime: optionalText,
        note: optionalText,
      })).nullish(),
      dataSource: z.enum(['sale', 'rent', 'news', 'related-projects']).optional(),
      initialCount: z.number().int().min(1).max(30).optional(),
    })).nullish(),
    progressText: optionalText,
    progressItems: z.array(z.object({
      title: z.string(),
      description: optionalText,
      image: optionalText,
      videoUrl: optionalText,
      videoFile: optionalText,
    })).nullish(),
    propertyTypes: z.array(z.string()).nullish(),
    // Ảnh đại diện riêng cho 4 phân khu Vinhomes Hải Vân Bay.
    haiVanZoneImages: z.object({
      tinhVan: optionalText,
      bachVan: optionalText,
      daoNgoc: optionalText,
      vinhMay: optionalText,
    }).nullish(),
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

const thoCu = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/nha-dat-tho-cu' }),
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
    roadWidth: z.union([z.string(), z.number()]).transform(String).nullish(),
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
    project: optionalText,
  }),
});

export const collections = {
  'can-ho': canHo,
  'du-an': duAn,
  'nha-dat-tho-cu': thoCu,
  'bai-viet': baiViet,
};
