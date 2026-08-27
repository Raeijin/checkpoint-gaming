
const params = new URLSearchParams(location.search);
const slug = params.get('slug');
const kind = params.get('kind');
const type = params.get('type');
const all = [...window.CHECKPOINT_CONTENT.reviews, ...window.CHECKPOINT_CONTENT.guides];
const item = all.find(x=>x.slug===slug);

let model = item || {
  category: type === 'sim' ? 'SIM RACING BUYING GUIDE' : type === 'pc' ? 'PC HARDWARE GUIDE' : 'BUYING GUIDE',
  title: type === 'sim' ? 'Build Your First Sim Racing Setup' : type === 'pc' ? 'What Should You Upgrade First In A Gaming PC?' : 'Best Gaming Monitors: How To Choose The Right One',
  excerpt: type === 'sim'
    ? 'A sensible upgrade path from entry-level wheel to full direct-drive rig.'
    : type === 'pc'
    ? 'A practical decision tree for getting the most gaming performance from your budget.'
    : 'How to choose between OLED, IPS, ultrawide, 1440p, 4K and high refresh rate.',
  score:'GUIDE'
};

document.title = model.title + ' — Checkpoint';
document.getElementById('crumbType').textContent = model.category;
document.getElementById('articleTag').textContent = model.category;
document.getElementById('articleTitle').textContent = model.title;
document.getElementById('articleIntro').textContent = model.excerpt;
document.getElementById('articleUpdated').textContent = 'Updated August 2026';
document.getElementById('articleRead').textContent = kind==='review' ? '11 min read' : '10 min read';

const isGame = kind === 'guide';
const quick = isGame
  ? 'Follow the shortest reliable route first, secure the strongest early upgrades, and avoid spending rare resources until your build direction is clear.'
  : 'Choose based on your actual use case and budget first. Specifications matter, but value, compatibility and the surrounding ecosystem are what usually decide whether a product is the right buy.';
document.getElementById('quickText').textContent = quick;

document.getElementById('main').innerHTML = isGame ? `
  <h2>Main guide</h2>
  <p>This is the reusable structure for a game article. Replace the example text with the real route, build or encounter.</p>
  <h3>Step 1 — Get set up</h3>
  <p>Explain exactly where to go, what to pick up and why it matters. Assume the reader knows nothing.</p>
  <h3>Step 2 — Upgrade efficiently</h3>
  <p>Give the best order for spending XP, currency and materials, plus alternatives if the player missed something.</p>
  <h3>Step 3 — Link to related hardware where relevant</h3>
  <p>A racing-game guide can naturally link to your steering-wheel buying guide. A competitive shooter guide can link to monitor, mouse and headset recommendations.</p>
` : `
  <h2>Main review / buying guide</h2>
  <p>Start by explaining who the product is for, what problem it solves and the alternatives a buyer should consider.</p>
  <h3>What matters most</h3>
  <ul>
    <li>Real specifications checked against the manufacturer.</li>
    <li>Price and value compared with direct competitors.</li>
    <li>Compatibility, ecosystem and hidden extra costs.</li>
    <li>Clear separation between hands-on testing and researched analysis.</li>
  </ul>
  <h3>Pros and cons</h3>
  <p>Keep these specific. “Great performance” is weak; “lower input latency than the previous generation at the same refresh rate” is useful.</p>
`;

document.getElementById('productName').textContent = isGame ? 'Related gaming gear' : 'Example top recommendation';
document.getElementById('productWhy').textContent = isGame
 ? 'Use this area only when the recommendation genuinely relates to the game or guide.'
 : 'Replace this with the real recommendation and explain exactly why it wins for this type of buyer.';
document.getElementById('affiliateBtn').href = '#';
