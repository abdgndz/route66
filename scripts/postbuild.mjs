// While the site is a draft, tell crawlers not to index any response.
import { readFileSync, writeFileSync } from 'node:fs';

const isDraft = /export const DRAFT = true/.test(readFileSync('src/data/site.ts', 'utf8'));
const file = 'dist/_headers';
let headers = readFileSync(file, 'utf8');
if (isDraft) {
  headers = headers.replace('/*\n', '/*\n  X-Robots-Tag: noindex, nofollow\n');
  writeFileSync(file, headers);
}
console.log(`postbuild: draft=${isDraft}`);
