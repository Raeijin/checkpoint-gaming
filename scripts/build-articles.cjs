// Run the existing browser renderer in a DOM at build time. No second template.
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const template = read('article.html');
const content = read('content.js');
const renderer = read('article.js');
const origin = 'https://' + read('CNAME').trim();

function loadContent() {
  const dom = new JSDOM('', { runScripts: 'outside-only' });
  dom.window.eval(content);
  const data = dom.window.CHECKPOINT_CONTENT;
  dom.window.close();
  return [...data.reviews, ...data.guides, ...(data.gameGuides || [])];
}

function render(item) {
  // External resources and inline event handlers are never executed by JSDOM.
  const dom = new JSDOM(template, {
    url: `${origin}/article.html?slug=${encodeURIComponent(item.slug)}`,
    runScripts: 'outside-only'
  });
  dom.window.eval(content);
  dom.window.eval(renderer);
  const doc = dom.window.document;
  doc.querySelectorAll('script[src]').forEach(el => el.remove());
  // Preserve fragment anchors and external/affiliate URLs verbatim. Relative
  // paths also support previews under a GitHub Pages project subdirectory.
  const nested = value => value && !/^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(value)
    ? '../../' + value : value;
  doc.querySelectorAll('[href], [src]').forEach(el => {
    for (const attr of ['href', 'src']) {
      if (el.hasAttribute(attr)) el.setAttribute(attr, nested(el.getAttribute(attr)));
    }
  });
  doc.querySelectorAll('[onerror]').forEach(el => {
    el.setAttribute('onerror', el.getAttribute('onerror').replace(
      /this\.src=(['"])(.*?)\1/g, (_, quote, url) => `this.src=${quote}${nested(url)}${quote}`
    ));
  });
  const html = dom.serialize();
  dom.window.close();
  return html;
}

function build() {
  const items = loadContent();
  const slugs = new Set();
  const descriptions = new Set();
  for (const item of items) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || slugs.has(item.slug)) {
      throw new Error(`Invalid or duplicate slug: ${item.slug}`);
    }
    const description = item.excerpt || item.quick;
    if (!item.title || !item.body || !description || descriptions.has(description)) {
      throw new Error(`Missing content or duplicate description: ${item.slug}`);
    }
    slugs.add(item.slug);
    descriptions.add(description);
  }
  for (const item of items) {
    const dir = path.join(root, 'articles', item.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), render(item));
  }
  // Only remove obsolete generated index files, never arbitrary directories.
  for (const entry of fs.readdirSync(path.join(root, 'articles'), { withFileTypes: true })) {
    if (entry.isDirectory() && !slugs.has(entry.name)) {
      const file = path.join(root, 'articles', entry.name, 'index.html');
      if (fs.existsSync(file)) fs.unlinkSync(file);
      const staged = path.join(root, '_site', 'articles', entry.name, 'index.html');
      if (fs.existsSync(staged)) fs.unlinkSync(staged);
    }
  }
  const pages = ['', 'about.html', 'contact.html', 'methodology.html', 'affiliate-disclosure.html', 'privacy.html'];
  const urls = [...pages, ...items.map(item => `articles/${item.slug}/`)];
  fs.writeFileSync(path.join(root, 'sitemap.xml'),
    '<?xml version="1.0" encoding="utf-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map(url => `  <url><loc>${origin}/${url}</loc></url>`).join('\n') + '\n</urlset>\n');
  // Stage only public site files; never publish node_modules or build tooling.
  const output = path.join(root, '_site');
  fs.mkdirSync(output, { recursive: true });
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.isFile() && (/\.(html|css|js|xml|webmanifest)$/.test(entry.name) || ['CNAME', 'robots.txt'].includes(entry.name))) {
      fs.copyFileSync(path.join(root, entry.name), path.join(output, entry.name));
    }
  }
  for (const dir of ['assets', 'admin', 'content']) {
    fs.cpSync(path.join(root, dir), path.join(output, dir), { recursive: true });
  }
  for (const item of items) {
    const dest = path.join(output, 'articles', item.slug);
    fs.mkdirSync(dest, { recursive: true });
    fs.copyFileSync(path.join(root, 'articles', item.slug, 'index.html'), path.join(dest, 'index.html'));
  }
  console.log(`Generated ${items.length} static articles and sitemap; deployment files in _site/.`);
}

if (require.main === module) build();
module.exports = { loadContent, render, root, origin };
