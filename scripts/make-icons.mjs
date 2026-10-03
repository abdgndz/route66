// Renders favicon PNGs, logo.png and the 1200x630 social image from public/favicon.svg.
// Run: node scripts/make-icons.mjs
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';

const svg = readFileSync('public/favicon.svg', 'utf8');
// Fonts inlined as data URLs: setContent pages cannot load file:// URLs.
const dataUrl = (path) => `data:font/woff2;base64,${readFileSync(path).toString('base64')}`;
const font = (w) => dataUrl(`node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-${w}-normal.woff2`);
const body = dataUrl('node_modules/@fontsource/barlow/files/barlow-latin-500-normal.woff2');
const fonts = `
  @font-face{font-family:'Barlow Condensed';font-weight:800;src:url(${font(800)})}
  @font-face{font-family:'Barlow Condensed';font-weight:700;src:url(${font(700)})}
  @font-face{font-family:'Barlow';font-weight:500;src:url(${body})}`;

const browser = await chromium.launch();
const page = await browser.newPage();

async function shot(html, w, h, out) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><style>${fonts}html,body{margin:0}</style>${html}`);
  await page.evaluate(() => document.fonts.ready);
  const buf = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
  if (out) writeFileSync(out, buf);
  return buf;
}

const mark = (size, pad = 0, bg = 'transparent') =>
  `<div style="width:${size}px;height:${size}px;display:grid;place-items:center;background:${bg}">
     <div style="width:${size - pad * 2}px">${svg.replace('<svg ', '<svg width="100%" ')}</div></div>`;

const png32 = await shot(mark(32), 32, 32);
await shot(mark(180, 14, '#faf8f4'), 180, 180, 'public/apple-touch-icon.png');
await shot(mark(192, 14, '#faf8f4'), 192, 192, 'public/icon-192.png');
await shot(mark(512, 40, '#faf8f4'), 512, 512, 'public/icon-512.png');
await shot(mark(512), 512, 512, 'public/logo.png');

// ICO wrapping a single 32x32 PNG.
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6);
header.writeUInt8(32, 7);
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14);
header.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([header, png32]));

const checker = `background:conic-gradient(#fff 25%,transparent 0 50%,#fff 0 75%,transparent 0) 0 0/16px 16px;opacity:.18`;
await shot(
  `<div style="width:1200px;height:630px;background:#0b2545;color:#fff;display:flex;flex-direction:column;font-family:Barlow">
     <div style="height:16px;${checker}"></div>
     <div style="flex:1;display:flex;align-items:center;gap:56px;padding:0 80px">
       <div style="width:300px;flex:none">${svg.replace('<svg ', '<svg width="100%" ')}</div>
       <div>
         <div style="font:800 40px 'Barlow Condensed';letter-spacing:.14em;color:#ff9aa9;text-transform:uppercase">Route 66 Driving School</div>
         <div style="font:800 76px/1 'Barlow Condensed';margin-top:14px">Driving lessons in Hadlow, Tonbridge &amp; Tunbridge Wells</div>
         <div style="font:500 30px Barlow;margin-top:22px;color:#c9d4e6">Manual &amp; automatic · Female instructor · WhatsApp to book</div>
       </div>
     </div>
     <div style="height:16px;${checker}"></div>
   </div>`,
  1200,
  630,
  'public/og.png',
);

await browser.close();
console.log('icons written');
