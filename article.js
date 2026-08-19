
const params = new URLSearchParams(location.search);
const slug = params.get('slug');
const kind = params.get('kind');
const type = params.get('type');
const all = [...window.CHECKPOINT_CONTENT.reviews, ...window.CHECKPOINT_CONTENT.guides, ...(window.CHECKPOINT_CONTENT.gameGuides || [])];
const item = all.find(x => x.slug === slug);

let model = item || {
  category: type === 'sim' ? 'SIM RACING BUYING GUIDE' : type === 'pc' ? 'PC HARDWARE GUIDE' : 'BUYING GUIDE',
  title: type === 'sim' ? 'Build Your First Sim Racing Setup' : type === 'pc' ? 'What Should You Upgrade First In A Gaming PC?' : 'Best Gaming Monitors: How To Choose The Right One',
  excerpt: type === 'sim'
    ? 'A sensible upgrade path from entry-level wheel to full direct-drive rig.'
    : type === 'pc'
    ? 'A practical decision tree for getting the most gaming performance from your budget.'
    : 'How to choose between OLED, IPS, ultrawide, 1440p, 4K and high refresh rate.',
  quick: 'Choose around your real use case and budget first.',
  body: '<h2>Main guide</h2><p>This page is ready for a full article.</p>',
  product: 'Example recommendation',
  productWhy: 'Replace this with the real recommendation and why it suits this buyer.',
  affiliate_url: '#'
};

document.title = model.title + ' — Checkpoint';
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
const simTopic = x => (x.category || '').toUpperCase().includes('SIM RACING');
const candidates = all.filter(x => x.slug !== model.slug);
const related = [...candidates.filter(x => simTopic(x) === simTopic(model)), ...candidates.filter(x => simTopic(x) !== simTopic(model))].slice(0,3);
if (relatedGrid) {
  relatedGrid.innerHTML = related.map(x => `
    <a class="related-card" href="article.html?slug=${x.slug}">
      <div class="related-thumb">${(x.heroImages?.[0] || x.productImage || x.image) ? `<img src="${x.heroImages?.[0] || x.productImage || x.image}" alt="">` : ''}</div>
      <div><span class="pill">${x.category}</span><h3>${x.title}</h3><span class="more">Read next →</span></div>
    </a>`).join('');
}
