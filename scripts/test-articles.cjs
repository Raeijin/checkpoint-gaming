const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { loadContent, root, origin } = require('./build-articles.cjs');
const items = loadContent();
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const parse = html => new JSDOM(html); // Scripts disabled: checks initial page source.
const text = html => {
  const dom = parse(`<body><div>${html}</div></body>`);
  const result = dom.window.document.body.textContent;
  dom.window.close();
  return result;
};
let affiliateCount = 0;
for (const item of items) {
  const file = path.join(root, 'articles', item.slug, 'index.html');
  const source = fs.readFileSync(file, 'utf8');
  const dom = parse(source);
  const doc = dom.window.document;
  const url = `${origin}/articles/${item.slug}/`;
  assert.equal(doc.title, `${item.title} — Checkpoint Loadout`);
  assert.equal(doc.querySelector('h1').textContent, item.title);
  assert.equal(doc.querySelectorAll('h1').length, 1);
  assert.equal(doc.querySelector('meta[name="description"]').content, item.excerpt || item.quick);
  assert.equal(doc.querySelector('link[rel="canonical"]').getAttribute('href'), url);
  assert.equal(doc.querySelector('#articleIntro').textContent, item.excerpt || '');
  assert.equal(doc.querySelector('#main').textContent, text(item.body));
  assert.equal(doc.querySelector('#quickText').textContent, item.quick || '');
  assert.equal(doc.querySelectorAll('script[src]').length, 0);
  assert(!source.includes('article.html?slug='), item.slug);
  assert(sitemap.includes(`<loc>${url}</loc>`));
  for (const el of doc.querySelectorAll('[href], [src]')) {
    for (const attr of ['href', 'src']) {
      const value = el.getAttribute(attr);
      if (!value || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(value)) continue;
      const target = path.resolve(path.dirname(file), value.split(/[?#]/)[0]);
      assert(fs.existsSync(target), `${item.slug}: missing ${value}`);
    }
  }
  for (const rec of item.recommendations || []) {
    const card = [...doc.querySelectorAll('.recommendation-card')].find(el => el.querySelector('h3').textContent === rec.name);
    assert(card, `${item.slug}: missing recommendation ${rec.name}`);
    assert.equal(card.querySelector('a.btn').getAttribute('href'), rec.url);
    assert.equal(card.querySelector('a.btn').getAttribute('rel'), 'sponsored nofollow');
    assert(!card.closest('[hidden]'));
    affiliateCount++;
  }
  if (!item.recommendations?.length && !item.hideProduct && item.affiliate_url && item.affiliate_url !== '#') {
    assert.equal(doc.querySelector('#affiliateBtn').getAttribute('href'), item.affiliate_url);
    assert(!doc.querySelector('#affiliateBtn').closest('[hidden]'));
    affiliateCount++;
  }
  for (const [label, url] of item.sources || []) {
    assert([...doc.querySelectorAll('#sourcesList a')].some(a => a.textContent === label && a.getAttribute('href') === url));
  }
  const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent));
  assert.equal(schemas.find(s => s['@type'] === 'Article').headline, item.title);
  assert.equal(schemas.find(s => s['@type'] === 'Article').mainEntityOfPage, url);
  assert.equal(doc.querySelectorAll('.faq-item').length, item.faq?.length || 0);
  for (const [question, answer] of item.faq || []) {
    assert(doc.querySelector('#faqList').textContent.includes(text(question)));
    assert(doc.querySelector('#faqList').textContent.includes(text(answer)));
  }
  assert.equal(schemas.find(s => s['@type'] === 'FAQPage')?.mainEntity.length || 0, item.faq?.length || 0);
  dom.window.close();
}
assert(!sitemap.includes('article.html'));
const home = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), { runScripts: 'outside-only' });
home.window.eval(fs.readFileSync(path.join(root, 'content.js'), 'utf8'));
home.window.eval(fs.readFileSync(path.join(root, 'app.js'), 'utf8'));
for (const link of home.window.document.querySelectorAll('a[href]')) {
  const href = link.getAttribute('href');
  assert(!href.includes('article.html'), `Homepage still links to legacy URL: ${href}`);
  if (href.startsWith('articles/')) assert(fs.existsSync(path.join(root, href, 'index.html')));
}
home.window.close();
console.log(`Verified initial HTML, full bodies, schemas, sources, FAQs, local paths and ${affiliateCount} recommendation/affiliate buttons across ${items.length} articles.`);
