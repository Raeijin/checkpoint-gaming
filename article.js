const params = new URLSearchParams(location.search);
const slug = params.get('slug');
const kind = params.get('kind');
const type = params.get('type');
const all = [...window.CHECKPOINT_CONTENT.reviews, ...window.CHECKPOINT_CONTENT.guides];
const item = all.find(x => x.slug === slug);

let model = item || {
  category: type === 'sim' ? 'SIM RACING BUYING GUIDE' : type === 'pc' ? 'PC HARDWARE GUIDE' : 'BUYING GUIDE',
  title: type === 'sim' ? 'Build Your First Sim Racing Setup' : type === 'pc' ? 'What Should You Upgrade First In A Gaming PC?' : 'Best Gaming Monitors: How To Choose The Right One',
  excerpt: type === 'sim' ? 'A sensible upgrade path from entry-level wheel to full direct-drive rig.' : type === 'pc' ? 'A practical decision tree for getting the most gaming performance from your budget.' : 'How to choose between OLED, IPS, ultrawide, 1440p, 4K and high refresh rate.',
  quick: 'Choose based on use case and budget first. Specifications matter, but value, compatibility and ecosystem usually decide the right buy.',
  body: '<h2>Main guide</h2><p>This article is being prepared.</p>',
  product: 'Example recommendation',
  productWhy: 'Recommendation details will appear here.',
  affiliate_url: '#',
  sources: []
};

document.title = model.title + ' — Checkpoint';
document.getElementById('crumbType').textContent = model.category;
document.getElementById('articleTag').textContent = model.category;
document.getElementById('articleTitle').textContent = model.title;
document.getElementById('articleIntro').textContent = model.excerpt;
document.getElementById('articleUpdated').textContent = 'Updated August 2026';
document.getElementById('articleRead').textContent = model.score || (kind === 'review' ? '11 min read' : '10 min read');
document.getElementById('quickText').textContent = model.quick;
document.getElementById('main').innerHTML = model.body;
document.getElementById('productName').textContent = model.product || 'Related product';
document.getElementById('productWhy').textContent = model.productWhy || '';
const affiliateBtn = document.getElementById('affiliateBtn');
affiliateBtn.href = model.affiliate_url || '#';
affiliateBtn.textContent = (model.affiliate_url || '').includes('amazon.co.uk') ? 'Check price on Amazon UK →' : 'View product →';

if (model.sources && model.sources.length) {
  const sourceBlock = document.createElement('section');
  sourceBlock.innerHTML = `<h2>Sources checked</h2><p class="source-note">Specifications and platform claims were checked against manufacturer pages. Pricing can change.</p><ul>${model.sources.map(s => `<li><a href="${s[1]}" target="_blank" rel="noopener">${s[0]}</a></li>`).join('')}</ul>`;
  document.querySelector('.article-content').appendChild(sourceBlock);
}
