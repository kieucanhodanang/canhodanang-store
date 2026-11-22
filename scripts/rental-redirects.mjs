import { readdir, readFile, writeFile } from 'node:fs/promises';

/**
 * Generate Cloudflare Pages 301 redirects for legacy rental URLs on every build.
 * Legacy pages are excluded from static generation, so old rental paths redirect
 * instead of returning duplicate HTML with a noindex tag.
 */
export function rentalRedirects() {
  return {
    name: 'rental-legacy-redirects',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const rules = [];
        const collections = [
          ['nha-dat-tho-cu', 'nha'],
          ['can-ho', 'can-ho']
        ];

        for (const [collection, rentalType] of collections) {
          const folder = new URL('../src/content/' + collection + '/', import.meta.url);
          const filenames = (await readdir(folder)).filter((name) => name.endsWith('.md'));

          for (const filename of filenames) {
            const markdown = await readFile(new URL(filename, folder), 'utf8');
            const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] || '';
            const transaction = frontmatter.match(/^transaction:\s*['"]?(cho-thue(?:-ngay)?)['"]?\s*$/m)?.[1];
            const status = frontmatter.match(/^status:\s*['"]?([a-z-]+)['"]?\s*$/m)?.[1];
            if (!transaction || status === 'draft') continue;

            const slug = encodeURIComponent(filename.slice(0, -3));
            const legacyPath = '/' + collection + '/' + slug;
            const canonicalPath = '/cho-thue/' + rentalType + '/' + slug + '/';
            rules.push(legacyPath + '/ ' + canonicalPath + ' 301');
            rules.push(legacyPath + ' ' + canonicalPath + ' 301');
          }
        }

        // Cloudflare Pages allows up to 2,000 static redirects in _redirects.
        if (rules.length > 2000) {
          throw new Error('Too many rental redirects: ' + rules.length + ' (limit 2000)');
        }

        await writeFile(new URL('_redirects', dir), rules.sort().join('\n') + '\n');
      }
    }
  };
}
