#!/usr/bin/env node
// Scrape iHeart news sitemap and extract per-article title/description/image/body/author/date
// into scraped/articles.json. Zero npm dependencies — uses Node's built-in fetch.
//
// Usage:
//   node scripts/scrape-iheart.js                # scrape all URLs in the sitemap
//   node scripts/scrape-iheart.js --limit 10     # only the first 10

const fs = require('node:fs');
const path = require('node:path');

const SITEMAP_URL = 'https://www.iheart.com/news_sitemap.xml';
const OUT_PATH = path.join(__dirname, '..', 'scraped', 'articles.json');
const DELAY_MS = 300;
const USER_AGENT = 'iheart-sitemap-scraper/0.1 (+local dev)';

function parseArgs(argv) {
    const args = { limit: null };
    for (let i = 2; i < argv.length; i++) {
        if (argv[i] === '--limit' && argv[i + 1]) {
            args.limit = Number(argv[++i]);
        }
    }
    return args;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function decodeEntities(s) {
    if (!s) return s;
    return s
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ');
}

async function fetchText(url) {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res.text();
}

function parseSitemap(xml) {
    const urls = [];
    const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];
    for (const block of urlBlocks) {
        const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
        const title = block.match(/<news:title>([\s\S]*?)<\/news:title>/)?.[1];
        const date = block.match(/<news:publication_date>([^<]+)<\/news:publication_date>/)?.[1];
        if (loc) urls.push({ url: loc.trim(), sitemapTitle: decodeEntities(title?.trim()), sitemapDate: date?.trim() });
    }
    return urls;
}

function extractNewsArticle(html) {
    const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
    for (const b of blocks) {
        try {
            const j = JSON.parse(b[1]);
            if (j['@type'] === 'NewsArticle') return j;
        } catch { /* skip non-JSON blocks */ }
    }
    return null;
}

function extractMeta(html, key, attr = 'property') {
    const re = new RegExp(`<meta[^>]+${attr}="${key}"[^>]*content="([^"]*)"|<meta[^>]+content="([^"]*)"[^>]+${attr}="${key}"`);
    const m = html.match(re);
    return m ? decodeEntities(m[1] || m[2]) : null;
}

function normalizeAuthor(a) {
    if (!a) return null;
    if (typeof a === 'string') return a;
    if (Array.isArray(a)) return a.map(normalizeAuthor).filter(Boolean).join(', ');
    if (typeof a === 'object') return a.name || null;
    return null;
}

function normalizeImage(img) {
    if (!img) return null;
    if (typeof img === 'string') return img;
    if (Array.isArray(img)) return normalizeImage(img[0]);
    if (typeof img === 'object') return img.url || null;
    return null;
}

function toIsoDate(d) {
    if (!d) return null;
    if (typeof d === 'number') return new Date(d).toISOString();
    const n = Number(d);
    if (!Number.isNaN(n) && String(n) === String(d)) return new Date(n).toISOString();
    return d;
}

function slugFromUrl(url) {
    const m = url.match(/\/content\/([^/]+)\/?$/);
    return m ? m[1] : url;
}

async function scrapeOne(entry) {
    const html = await fetchText(entry.url);
    const ld = extractNewsArticle(html);
    const title = ld?.headline || extractMeta(html, 'og:title') || entry.sitemapTitle;
    const description = extractMeta(html, 'og:description') || extractMeta(html, 'description', 'name');
    const image = normalizeImage(ld?.image) || extractMeta(html, 'og:image');
    const body = decodeEntities(ld?.articleBody || '').trim();
    const author = normalizeAuthor(ld?.author);
    const datePublished = toIsoDate(ld?.datePublished) || entry.sitemapDate;
    return {
        url: entry.url,
        slug: slugFromUrl(entry.url),
        title: title || null,
        description: description || null,
        image: image || null,
        author: author || null,
        datePublished,
        body: body || null,
    };
}

async function main() {
    const args = parseArgs(process.argv);
    console.log(`Fetching sitemap: ${SITEMAP_URL}`);
    const xml = await fetchText(SITEMAP_URL);
    let entries = parseSitemap(xml);
    console.log(`Found ${entries.length} article URLs.`);
    if (args.limit) entries = entries.slice(0, args.limit);
    console.log(`Scraping ${entries.length}...`);

    const articles = [];
    for (let i = 0; i < entries.length; i++) {
        const e = entries[i];
        process.stdout.write(`[${i + 1}/${entries.length}] ${e.url}\n`);
        try {
            const a = await scrapeOne(e);
            articles.push(a);
        } catch (err) {
            console.warn(`  FAILED: ${err.message}`);
            articles.push({ url: e.url, slug: slugFromUrl(e.url), error: err.message });
        }
        if (i < entries.length - 1) await sleep(DELAY_MS);
    }

    fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
    const out = { scrapedAt: new Date().toISOString(), source: SITEMAP_URL, count: articles.length, articles };
    fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
    console.log(`\nWrote ${articles.length} articles to ${path.relative(process.cwd(), OUT_PATH)}`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
