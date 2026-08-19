
const params = new URLSearchParams(location.search);
const slug = params.get('slug');
const kind = params.get('kind');
const type = params.get('type');
const all = [...window.CHECKPOINT_CONTENT.reviews, ...window.CHECKPOINT_CONTENT.guides, ...(window.CHECKPOINT_CONTENT.gameGuides || [])];
const item = all.find(x => x.slug === slug);
const fallbackSlug = type === 'sim'
  ? 'beginner-sim-racing-setup-2026'
  : 'best-budget-gaming-monitors-uk';
const model = item || all.find(x => x.slug === fallbackSlug);

document.title = model.title + ' — Checkpoint Loadout';

function ensureMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k,v));
  return el;
}

const canonical = document.createElement('link');
canonical.rel = 'canonical';
canonical.href = 'https://checkpointloadout.com/article.html?slug=' + encodeURIComponent(model.slug || slug || '');
document.head.appendChild(canonical);

ensureMeta('meta[name="description"]', {name:'description', content:model.excerpt || model.quick || ''});
ensureMeta('meta[property="og:title"]', {property:'og:title', content:model.title + ' — Checkpoint Loadout'});
ensureMeta('meta[property="og:description"]', {property:'og:description', content:model.excerpt || model.quick || ''});
ensureMeta('meta[property="og:type"]', {property:'og:type', content:'article'});
ensureMeta('meta[property="og:url"]', {property:'og:url', content:canonical.href});
ensureMeta('meta[name="twitter:card"]', {name:'twitter:card', content:'summary_large_image'});
const socialImage = model.heroImages?.[0] || model.productImage || model.image;
if (socialImage) {
  const absoluteImage = new URL(socialImage, 'https://checkpointloadout.com/').href;
  ensureMeta('meta[property="og:image"]', {property:'og:image', content:absoluteImage});
  ensureMeta('meta[name="twitter:image"]', {name:'twitter:image', content:absoluteImage});
}

document.getElementById('crumbType').textContent = model.category;
document.getElementById('articleTag').textContent = model.category;
document.getElementById('articleTitle').textContent = model.title;
document.getElementById('articleIntro').textContent = model.excerpt || '';
document.getElementById('articleUpdated').textContent = 'Updated August 2026';
document.getElementById('articleRead').textContent = model.score || (kind === 'review' ? '11 min read' : '10 min read');
document.getElementById('quickText').textContent = model.quick || '';
document.getElementById('main').innerHTML = model.body || '<h2>Main guide</h2>';

const heroGallery = document.getElementById('articleHeroGallery');
const heroImages = (model.heroImages && model.heroImages.length)
  ? model.heroImages
  : [model.productImage || model.image].filter(Boolean);

if (heroImages.length) {
  heroGallery.innerHTML = heroImages.map((src, i) =>
    `<figure class="article-product-shot"><img src="${src}" alt="${model.title} product image ${i + 1}"></figure>`
  ).join('');
  heroGallery.dataset.count = String(heroImages.length);
  heroGallery.hidden = false;
}

document.getElementById('productName').textContent = model.product || 'Related product';
document.getElementById('productWhy').textContent = model.productWhy || '';
const affiliateBtn = document.getElementById('affiliateBtn');
affiliateBtn.href = model.affiliate_url || '#';
const url = model.affiliate_url || '';
const affiliateNote = document.getElementById('affiliateNote');
const isAffiliate = url.includes('amazon.co.uk') || (url.includes('uk.mozaracing.com') && url.includes('ref=AIDANKING'));
if (affiliateNote) {
  affiliateNote.textContent = isAffiliate
    ? 'Affiliate link — we may earn a commission'
    : 'Official product page';
}

if (url.includes('amazon.co.uk')) {
  affiliateBtn.textContent = 'Check price on Amazon UK →';
} else if (url.includes('uk.mozaracing.com')) {
  affiliateBtn.textContent = 'View at MOZA UK →';
} else if (url.includes('fanatec.com')) {
  affiliateBtn.textContent = 'View at Fanatec →';
} else {
  affiliateBtn.textContent = 'View product →';
}

const productImage = document.getElementById('productImage');
const placeholder = document.getElementById('productPlaceholder');
const displayProductImage = model.productImage || model.image;
if (displayProductImage) {
  productImage.src = displayProductImage;
  productImage.alt = model.product || model.title;
  productImage.hidden = false;
  placeholder.hidden = true;
}

const pickSection = document.getElementById('pick');
const pickToc = document.querySelector('.toc a[href="#pick"]');
if (model.hideProduct || !model.affiliate_url || model.affiliate_url === '#') {
  if (pickSection) pickSection.hidden = true;
  if (pickToc) pickToc.hidden = true;
}

const relatedGrid = document.getElementById('relatedGrid');
const gameGuides = window.CHECKPOINT_CONTENT.gameGuides || [];
const isGameGuide = x => gameGuides.some(g => g.slug === x.slug);
const isSim = x => (x.category || '').toUpperCase().includes('SIM RACING');
const isMonitor = x => (x.category || '').toUpperCase().includes('MONITOR');
const candidates = all.filter(x => x.slug !== model.slug);
let relatedPool;
if (isGameGuide(model)) {
  relatedPool = [...candidates.filter(isGameGuide), ...candidates.filter(x => !isGameGuide(x))];
} else if (isSim(model)) {
  relatedPool = [...candidates.filter(isSim), ...candidates.filter(x => !isSim(x))];
} else if (isMonitor(model)) {
  relatedPool = [...candidates.filter(isMonitor), ...candidates.filter(x => !isMonitor(x))];
} else {
  relatedPool = candidates;
}
const explicitRelated = (model.relatedSlugs || [])
  .map(slug => all.find(x => x.slug === slug))
  .filter(Boolean);
const related = explicitRelated.length
  ? [...explicitRelated, ...relatedPool.filter(x => !explicitRelated.some(r => r.slug === x.slug))].slice(0,3)
  : relatedPool.slice(0,3);
if (relatedGrid) {
  relatedGrid.innerHTML = related.map(x => `
    <a class="related-card" href="article.html?slug=${x.slug}">
      <div class="related-thumb">${(x.heroImages?.[0] || x.productImage || x.image) ? `<img src="${x.heroImages?.[0] || x.productImage || x.image}" alt="">` : ''}</div>
      <div><span class="pill">${x.category}</span><h3>${x.title}</h3><span class="more">Read next →</span></div>
    </a>`).join('');
}

// Primary/reference sources used for researched articles.
const sourcesSection = document.getElementById('sourcesSection');
const sourcesList = document.getElementById('sourcesList');
if (model.sources?.length && sourcesSection && sourcesList) {
  sourcesList.innerHTML = model.sources.map(([label,url]) =>
    `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></li>`
  ).join('');
  sourcesSection.hidden = false;
} else {
  document.querySelector('.toc a[href="#sourcesSection"]')?.remove();
}

// Basic structured data so search engines can understand the article.
const schema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": model.title,
  "description": model.excerpt || model.quick || "",
  "dateModified": "2026-08-19",
  "mainEntityOfPage": canonical.href,
  "publisher": {
    "@type": "Organization",
    "name": "Checkpoint Loadout",
    "url": "https://checkpointloadout.com"
  }
};
if (socialImage) schema.image = [new URL(socialImage, 'https://checkpointloadout.com/').href];
const schemaScript = document.createElement('script');
schemaScript.type = 'application/ld+json';
schemaScript.textContent = JSON.stringify(schema);
document.head.appendChild(schemaScript);
