const data = window.CHECKPOINT_CONTENT;
const reviewGrid = document.getElementById('reviewGrid');
const guideGrid = document.getElementById('guideGrid');
const techGrid = document.getElementById('techGrid');
function card(item, kind){
  return `<a class="content-card searchable" data-slug="${item.slug}" data-image-mode="${item.cardImageMode || ''}" data-text="${(item.title+' '+item.category+' '+item.excerpt).toLowerCase()}" href="article.html?slug=${item.slug}&kind=${kind}">
    <div class="card-art ${item.art}">
      ${item.heroImages?.length > 1
        ? `<div class="card-image-pair">${item.heroImages.slice(0,2).map((src,i)=>`<img src="${src}" alt="${item.title} product ${i+1}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\'${item.image}\'">`).join('')}</div>`
        : (item.productImage || item.image)
          ? `<img class="card-image" src="${item.productImage || item.image}" alt="${item.title}" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=\'${item.image}\'">`
          : ""}
      <span class="pill card-pill">${item.category}</span>
    </div>
    <div class="card-body"><div class="card-meta"><span>${kind === 'review' ? 'REVIEW / COMPARISON' : kind === 'game' ? 'GAME GUIDE' : 'BUYING GUIDE'}</span><span class="rating">${item.score}</span></div><h3>${item.title}</h3><p>${item.excerpt}</p><span class="more">Read article →</span></div>
  </a>`;
}
reviewGrid.innerHTML = data.reviews.slice().reverse().slice(0,12).map(x=>card(x,'review')).join('');
guideGrid.innerHTML = (data.gameGuides || []).map(x=>card(x,'game')).join('');
const techSlugs = ["best-gaming-keyboard-2026", "keychron-k2-he-researched-review", "best-pc-controller-2026", "gamesir-g7-pro-researched-review", "best-1440p-gaming-monitor-2026", "oled-vs-mini-led-gaming-monitor-2026", "best-monitor-arm-for-gaming-desk-2026", "best-2tb-gaming-ssd-2026", "best-gaming-mouse-2026", "best-wireless-gaming-headset-2026"];
if (techGrid) techGrid.innerHTML = techSlugs.map(slug => [...data.reviews,...data.guides].find(x=>x.slug===slug)).filter(Boolean).map(x=>card(x, x.category.includes('REVIEW') || x.category.includes('COMPARISON') ? 'review' : 'guide')).join('');
const searchBtn=document.getElementById('searchBtn'), panel=document.getElementById('searchPanel'), input=document.getElementById('searchInput');
searchBtn?.addEventListener('click',()=>{panel.classList.toggle('open'); if(panel.classList.contains('open')) input.focus();});
input?.addEventListener('input',()=>{const q=input.value.trim().toLowerCase(); document.querySelectorAll('.searchable,.article-card').forEach(el=>{const text=(el.dataset.text||el.innerText).toLowerCase();el.classList.toggle('hidden',q&&!text.includes(q));});});
