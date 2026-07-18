// Scan media/<slug>/ and emit media.json for the landing gallery.
// Re-run whenever you add/swap files: `node scan-media.mjs`
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const COMPANIES = [
  { slug: 'fitcheck',   co: 'FitCheck',           url: 'tryfitcheck.co',        href: 'https://tryfitcheck.co' },
  { slug: 'heuron',     co: 'Heuron',             url: 'heuron.news',           href: 'https://heuron.news' },
  { slug: 'numberthon', co: 'Numberthon',         url: 'numberthon.com',        href: 'https://numberthon.com' },
  { slug: 'pyngo',      co: 'Pyngo',              url: 'pyngo.co',              href: 'https://pyngo.co' },
  { slug: 'running',    co: 'myTrainingForecast', url: 'mytrainingforecast.run',href: 'https://mytrainingforecast.run' },
  { slug: 'satro',      co: 'Satro',              url: 'satro.app',             href: 'https://satro.app' },
  { slug: 'capitalcurve', co: 'CapitalCurve',     url: 'capitalcurve.app',      href: 'https://capitalcurve.app' },
];

const numsort = (a, b) => a.localeCompare(b, undefined, { numeric: true });
const label = (f) => f.startsWith('green-screen') ? 'Green screen'
  : f.startsWith('wall-of-text') ? 'Wall of text' : 'Video';

const out = COMPANIES.map((c) => {
  const dir = join('media', c.slug);
  const entries = readdirSync(dir);
  const media = [];
  // slideshows first (they read as the "premium" format), then videos
  entries.filter((e) => e.startsWith('slideshow-') && statSync(join(dir, e)).isDirectory())
    .sort(numsort)
    .forEach((ss) => {
      const slides = readdirSync(join(dir, ss)).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f)).sort(numsort)
        .map((f) => `media/${c.slug}/${ss}/${f}`);
      if (slides.length) media.push({ type: 'slideshow', label: 'Slideshow', slides });
    });
  entries.filter((e) => e.toLowerCase().endsWith('.mp4')).sort(numsort)
    .forEach((v) => media.push({ type: 'video', label: label(v), src: `media/${c.slug}/${v}` }));
  return { ...c, media };
});

writeFileSync('media.json', JSON.stringify(out, null, 2));
console.log('media.json written:');
out.forEach((c) => console.log(`  ${c.co}: ${c.media.length} items`));
