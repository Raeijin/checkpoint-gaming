
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

document.body.dataset.articleSlug = model.slug || '';
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
const socialImage = model.cardImage || model.heroImages?.[0] || model.productImage || model.image;
if (socialImage) {
  const absoluteImage = new URL(socialImage, 'https://checkpointloadout.com/').href;
  ensureMeta('meta[property="og:image"]', {property:'og:image', content:absoluteImage});
  ensureMeta('meta[name="twitter:image"]', {name:'twitter:image', content:absoluteImage});
}

document.getElementById('crumbType').textContent = model.category;
document.getElementById('articleTag').textContent = model.category;
document.getElementById('articleTitle').textContent = model.title;
document.getElementById('articleIntro').textContent = model.excerpt || '';
document.getElementById('articleUpdated').textContent = 'Checked ' + (model.lastChecked || 'August 2026');
document.getElementById('articleRead').textContent = model.score || (kind === 'review' ? '11 min read' : '10 min read');
document.getElementById('researchStatus').textContent = model.researchStatus || 'Research-backed';
document.getElementById('quickText').textContent = model.quick || '';

const categoryUpper = (model.category || '').toUpperCase();
const isGameGuidePage = (window.CHECKPOINT_CONTENT.gameGuides || []).some(g => g.slug === model.slug);
const isSetupGuidePage = categoryUpper.includes('SETUP GUIDE');
const isFaqPage = categoryUpper.includes('FAQ');
const articleMode = isSetupGuidePage ? 'setup' : isFaqPage ? 'faq' : isGameGuidePage ? 'game' : 'buyer';
document.body.dataset.articleMode = articleMode;

const buyIfLabel = document.getElementById('buyIfLabel');
const skipIfLabel = document.getElementById('skipIfLabel');
const decisionToc = document.querySelector('.toc a[href="#decision"]');

if (articleMode === 'setup') {
  buyIfLabel.textContent = 'START WITH';
  skipIfLabel.textContent = 'AVOID';
  if (decisionToc) decisionToc.textContent = 'Setup checklist';
} else if (articleMode === 'faq') {
  buyIfLabel.textContent = 'CHECK FIRST';
  skipIfLabel.textContent = 'AVOID';
  if (decisionToc) decisionToc.textContent = 'Troubleshooting checklist';
} else if (articleMode === 'game') {
  buyIfLabel.textContent = 'DO THIS';
  skipIfLabel.textContent = 'AVOID THIS';
  if (decisionToc) decisionToc.textContent = 'Key habits';
} else {
  buyIfLabel.textContent = 'BUY IF';
  skipIfLabel.textContent = 'SKIP IF';
  if (decisionToc) decisionToc.textContent = 'Who it suits';
}

const buyIfList = document.getElementById('buyIfList');
const skipIfList = document.getElementById('skipIfList');
const decisionSection = document.getElementById('decision');
const buyIf = model.buyIf || [];
const skipIf = model.skipIf || [];
if (buyIf.length || skipIf.length) {
  buyIfList.innerHTML = buyIf.map(x => `<li>${x}</li>`).join('');
  skipIfList.innerHTML = skipIf.map(x => `<li>${x}</li>`).join('');
} else {
  decisionSection.hidden = true;
  decisionToc?.remove();
}

const specsSection = document.getElementById('specsSection');
const specBody = document.getElementById('specTableBody');
const specsKicker = specsSection?.querySelector('.kicker');
const specsTitle = specsSection?.querySelector('h2');
if (articleMode === 'setup') {
  if (specsKicker) specsKicker.textContent = 'STARTING POINT';
  if (specsTitle) specsTitle.textContent = 'Settings & checks at a glance';
} else if (articleMode === 'faq') {
  if (specsKicker) specsKicker.textContent = 'DIAGNOSIS';
  if (specsTitle) specsTitle.textContent = 'Quick troubleshooting checks';
} else if (articleMode === 'game') {
  if (specsKicker) specsKicker.textContent = 'AT A GLANCE';
  if (specsTitle) specsTitle.textContent = 'Key facts';
}
if (model.specs?.length) {
  specBody.innerHTML = model.specs.map(([k,v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('');
  specsSection.hidden = false;
} else {
  document.querySelector('.toc a[href="#specsSection"]')?.remove();
}
document.getElementById('main').innerHTML = model.body || '<h2>Main guide</h2>';

const faqSection = document.getElementById('faqSection');
const faqList = document.getElementById('faqList');
const faqItems = model.faq || [];
if (faqItems.length && faqSection && faqList) {
  faqList.innerHTML = faqItems.map(([question, answer], i) => `
    <details class="faq-item"${i === 0 ? ' open' : ''}>
      <summary>${question}</summary>
      <div class="faq-answer"><p>${answer}</p></div>
    </details>`).join('');
  faqSection.hidden = false;
} else {
  document.querySelector('.toc a[href="#faqSection"]')?.remove();
}


const heroGallery = document.getElementById('articleHeroGallery');
const heroImages = (model.heroImages && model.heroImages.length)
  ? model.heroImages
  : [model.productImage || model.image].filter(Boolean);

if (heroImages.length) {
  heroGallery.innerHTML = heroImages.map((src, i) =>
    `<figure class="article-product-shot"><img src="${src}" alt="${model.title} visual ${i + 1}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\'${model.image}\'"></figure>`
  ).join('');
  heroGallery.dataset.count = String(heroImages.length);
  heroGallery.hidden = false;
}

const recommendationGrid = document.getElementById('recommendationGrid');
const legacyProductBox = document.getElementById('legacyProductBox');
const amazonPriceNote = document.getElementById('amazonPriceNote');
const pickKicker = pickSection?.querySelector('.kicker');
const pickTitle = pickSection?.querySelector('h2');
const recs = model.recommendations || [];

if (articleMode === 'setup' && recs.length) {
  if (pickKicker) pickKicker.textContent = 'HARDWARE COVERED';
  if (pickTitle) pickTitle.textContent = 'Wheelbases used in this guide';
  if (pickToc) pickToc.textContent = 'Hardware covered';
} else if (articleMode === 'game' && recs.length) {
  if (pickKicker) pickKicker.textContent = 'USEFUL EXTRAS';
  if (pickTitle) pickTitle.textContent = 'Optional gear & extras';
  if (pickToc) pickToc.textContent = 'Useful extras';
} else if (articleMode === 'faq' && recs.length) {
  if (pickKicker) pickKicker.textContent = 'USEFUL HARDWARE';
  if (pickTitle) pickTitle.textContent = 'Relevant hardware';
  if (pickToc) pickToc.textContent = 'Relevant hardware';
}
function buttonText(url){
  if (url.includes('amazon.co.uk')) return 'Check on Amazon UK →';
  if (url.includes('uk.mozaracing.com')) return 'View at MOZA UK →';
  if (url.includes('fanatec.com')) return 'View at Fanatec →';
  return 'View product →';
}
function affiliateLabel(url){
  return (url.includes('amazon.co.uk') || (url.includes('uk.mozaracing.com') && url.includes('ref=AIDANKING')))
    ? 'Affiliate link — we may earn a commission' : 'Official product page';
}
if (recs.length) {
  legacyProductBox.hidden = true;
  legacyProductBox.style.display = 'none';
  recommendationGrid.innerHTML = recs.map((r,i) => `
    <article class="recommendation-card">
      <div class="recommendation-thumb">${r.image
        ? `<img src="${r.image}" alt="${r.name}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${r.fallbackImage || model.image || ''}'">`
        : (r.fallbackImage || model.image)
          ? `<img src="${r.fallbackImage || model.image}" alt="${r.name}">`
          : '<span>PRODUCT</span>'}</div>
      <div class="recommendation-copy"><span class="pill">${r.label || (i===0 ? 'TOP PICK' : 'ALTERNATIVE')}</span><h3>${r.name}</h3><p>${r.why || ''}</p>
      <div class="buy-row"><a class="btn primary" href="${r.url}" rel="sponsored nofollow">${buttonText(r.url || '')}</a><small>${affiliateLabel(r.url || '')}</small></div></div>
    </article>`).join('');
  if (recs.some(r => (r.url || '').includes('amazon.co.uk'))) amazonPriceNote.hidden = false;
} else {
  const url = model.affiliate_url || '';
  const hasRealLegacyPick = Boolean(model.product && url && url !== '#' && !model.hideProduct);

  if (hasRealLegacyPick) {
    legacyProductBox.hidden = false;
    legacyProductBox.style.display = '';
    document.getElementById('productName').textContent = model.product;
    document.getElementById('productWhy').textContent = model.productWhy || '';
    const affiliateBtn = document.getElementById('affiliateBtn');
    affiliateBtn.href = url;
    const affiliateNote = document.getElementById('affiliateNote');
    affiliateNote.textContent = affiliateLabel(url);
    affiliateBtn.textContent = buttonText(url);

    const productImage = document.getElementById('productImage');
    const placeholder = document.getElementById('productPlaceholder');
    const displayProductImage = model.productImage || model.image;
    if (displayProductImage) {
      productImage.src = displayProductImage;
      productImage.alt = model.product || model.title;
      productImage.hidden = false;
      placeholder.hidden = true;
    } else {
      productImage.hidden = true;
      placeholder.hidden = false;
    }

    if (url.includes('amazon.co.uk')) amazonPriceNote.hidden = false;
  } else {
    legacyProductBox.hidden = true;
  }
}
const pickSection = document.getElementById('pick');
const pickToc = document.querySelector('.toc a[href="#pick"]');
if (!recs.length && (model.hideProduct || !model.affiliate_url || model.affiliate_url === '#')) {
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
      <div class="related-thumb">${(x.cardImage || x.heroImages?.[0] || x.productImage || x.image) ? `<img src="${x.cardImage || x.heroImages?.[0] || x.productImage || x.image}" alt="">` : ''}</div>
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
  "dateModified": "2026-08-27",
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


if (faqItems.length) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(([question, answer]) => ({
      "@type": "Question",
      "name": question,
      "acceptedAnswer": {"@type": "Answer", "text": answer}
    }))
  };
  const faqSchemaScript = document.createElement('script');
  faqSchemaScript.type = 'application/ld+json';
  faqSchemaScript.textContent = JSON.stringify(faqSchema);
  document.head.appendChild(faqSchemaScript);
}
