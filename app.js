const data = window.CHECKPOINT_CONTENT;
const reviewGrid = document.getElementById('reviewGrid');
const guideGrid = document.getElementById('guideGrid');
const techGrid = document.getElementById('techGrid');
function card(item, kind){
  return `<a class="content-card searchable" data-text="${(item.title+' '+item.category+' '+item.excerpt).toLowerCase()}" href="article.html?slug=${item.slug}&kind=${kind}">
    <div class="card-art ${item.art}">
      ${item.heroImages?.length > 1
        ? `<div class="card-image-pair">${item.heroImages.slice(0,2).map((src,i)=>`<img src="${src}" alt="${item.title} product ${i+1}">`).join('')}</div>`
        : (item.productImage || item.image)
          ? `<img class="card-image" src="${item.productImage || item.image}" alt="${item.title}">`
          : ""}
      <span class="pill card-pill">${item.category}</span>
    </div>
    <div class="card-body"><div class="card-meta"><span>${kind === 'review' ? 'REVIEW / COMPARISON' : kind === 'game' ? 'GAME GUIDE' : 'BUYING GUIDE'}</span><span class="rating">${item.score}</span></div><h3>${item.title}</h3><p>${item.excerpt}</p><span class="more">Read article →</span></div>
  </a>`;
}
reviewGrid.innerHTML = data.reviews.slice().reverse().slice(0,12).map(x=>card(x,'review')).join('');
guideGrid.innerHTML = (data.gameGuides || []).map(x=>card(x,'game')).join('');
const techSlugs = ['best-2tb-gaming-ssd-2026','samsung-990-pro-vs-wd-black-sn850x','best-gaming-mouse-2026','razer-viper-v4-pro-researched-review','best-wireless-gaming-headset-2026','razer-blackshark-v3-researched-review','best-switch-2-microsd-express-card'];
if (techGrid) techGrid.innerHTML = techSlugs.map(slug => [...data.reviews,...data.guides].find(x=>x.slug===slug)).filter(Boolean).map(x=>card(x, x.category.includes('REVIEW') || x.category.includes('COMPARISON') ? 'review' : 'guide')).join('');
const searchBtn=document.getElementById('searchBtn'), panel=document.getElementById('searchPanel'), input=document.getElementById('searchInput');
searchBtn?.addEventListener('click',()=>{panel.classList.toggle('open'); if(panel.classList.contains('open')) input.focus();});
input?.addEventListener('input',()=>{const q=input.value.trim().toLowerCase(); document.querySelectorAll('.searchable,.article-card').forEach(el=>{const text=(el.dataset.text||el.innerText).toLowerCase();el.classList.toggle('hidden',q&&!text.includes(q));});});
