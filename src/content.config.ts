
import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const canHo = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/can-ho"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    price: z.string(),
    area: z.string(),
    bedrooms: z.number().optional(),
    address: z.string(),
    image: z.string()
  })
});

const duAn = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/du-an"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    developer: z.string().optional(),
    location: z.string(),
    image: z.string()
  })
});

const baiViet = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/bai-viet"
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    image: z.string().optional()
  })
});

export const collections = {
  "can-ho": canHo,
  "du-an": duAn,
  "bai-viet": baiViet
};
