
const params = new URLSearchParams(location.search);
const slug = params.get('slug');
const kind = params.get('kind');
const type = params.get('type');
const all = [...window.CHECKPOINT_CONTENT.reviews, ...window.CHECKPOINT_CONTENT.guides];
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

const hero = document.getElementById('articleHeroImage');
if (model.image) {
  hero.src = model.image;
  hero.alt = model.title;
  hero.hidden = false;
}

document.getElementById('productName').textContent = model.product || 'Related product';
document.getElementById('productWhy').textContent = model.productWhy || '';
const affiliateBtn = document.getElementById('affiliateBtn');
affiliateBtn.href = model.affiliate_url || '#';
affiliateBtn.textContent = (model.affiliate_url || '').includes('amazon.co.uk') ? 'Check price on Amazon UK →' : 'View product →';

const productImage = document.getElementById('productImage');
const placeholder = document.getElementById('productPlaceholder');
if (model.image) {
  productImage.src = model.image;
  productImage.alt = model.product || model.title;
  productImage.hidden = false;
  placeholder.hidden = true;
}
