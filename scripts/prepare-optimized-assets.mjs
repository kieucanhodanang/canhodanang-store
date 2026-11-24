import sharp from 'sharp';
import { readFile, readdir, mkdir, access, writeFile } from 'node:fs/promises';
import { join, basename } from 'node:path';

const root = process.cwd();
const uploadRoot = join(root, 'public', 'uploads');
const optimizedRoot = join(root, 'public', 'optimized');
const manifestPath = join(root, 'src', 'data', 'optimized-assets.json');
const supported = /^\/uploads\/[^/?#]+\.(?:png|jpe?g|jfif|webp|avif)$/i;
const entries = new Set();
const bannerEntries = new Set();
const logoEntries = new Set();
const collect = (value, banner = false) => {
  if (typeof value === 'string' && supported.test(value)) {
    entries.add(value);
    if (banner) bannerEntries.add(value);
  } else if (Array.isArray(value)) value.forEach((item) => collect(item, banner));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([key, item]) => collect(item, banner || /^(bannerImage|bannerSlides|bannerVideoPoster|mobileImage)$/.test(key)));
};
const cms = JSON.parse(await readFile(join(root, 'src', 'data', 'homepage.json'), 'utf8'));
collect(cms);
for (const value of [cms.siteLogo,cms.siteFavicon]) if (typeof value === 'string' && supported.test(value)) logoEntries.add(value);
for (const group of ['du-an', 'can-ho', 'nha-dat-tho-cu', 'bai-viet']) {
  const folder = join(root, 'src', 'content', group);
  const files = await readdir(folder, { withFileTypes: true });
  for (const file of files) {
    if (!file.isFile() || !/\.md$/i.test(file.name)) continue;
    const body = await readFile(join(folder, file.name), 'utf8');
    const meta = body.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
    if (!meta) continue;
    for (const match of meta[1].matchAll(/^(?:image|coverImage|thumbnail|logo):\s*(.+)$/gm)) {
      const value = match[1].trim().replace(/^["']|["']$/g, '');
      collect(value);
      if (match[0].startsWith('logo:') && supported.test(value)) logoEntries.add(value);
    }
  }
}
const manifest = {};
async function generate(source) {
  const name = source.slice('/uploads/'.length);
  if (name !== basename(name) || name.includes('..')) return;
  const file = join(uploadRoot, name);
  try { await access(file); } catch { console.warn('Optimize: missing file', source); return; }
  const variants = {tiny:240,small:480,medium:720,large:960};
  if (logoEntries.has(source)) Object.assign(variants,{logo:144,logoLarge:320,favicon:96});
  if (bannerEntries.has(source)) { variants.mobile=760; variants.desktop=1600; }
  const result = {};
  const textHeavy = /mat-bang|so-do|gia-ban|bang-gia|layout|brochure|infographic|site-plan/i.test(name);
  for (const [type, width] of Object.entries(variants)) {
    const folder = type === 'desktop' || type === 'mobile' ? 'banner' : ['logo','logoLarge','favicon'].includes(type) ? 'logos' : 'cards';
    const route = '/optimized/' + folder + '/' + type + '/' + name + '.webp';
    const out = join(optimizedRoot, folder, type, name + '.webp');
    await mkdir(join(optimizedRoot, folder, type), { recursive:true });
    try {
      await sharp(file, {limitInputPixels:80000000}).rotate()
        .resize({width,withoutEnlargement:true})
        .webp(['logo','logoLarge','favicon'].includes(type) ? {quality:85,alphaQuality:95,effort:4} : {quality:textHeavy ? 76 : 70,effort:4})
        .toFile(out);
      result[type]=route;
    } catch (error) {
      console.warn('Optimize: using original for', source, String(error));
    }
  }
  if (Object.keys(result).length) manifest[source]=result;
}
const queue=[...entries];const workers=Array.from({length:3},async()=>{while(queue.length)await generate(queue.pop())});
await Promise.all(workers);
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
console.log('Optimized CMS images:',Object.keys(manifest).length,'/',entries.size);
