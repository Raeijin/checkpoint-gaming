const data = window.CHECKPOINT_CONTENT;
const reviewGrid = document.getElementById('reviewGrid');
const guideGrid = document.getElementById('guideGrid');
function card(item, kind){
  return `<a class="content-card searchable" data-text="${(item.title+' '+item.category+' '+item.excerpt).toLowerCase()}" href="article.html?slug=${item.slug}&kind=${kind}">
    <div class="card-art ${item.art}">${item.image ? `<img class="card-image" src="${item.image}" alt="">` : ""}<span class="pill card-pill">${item.category}</span></div>
    <div class="card-body"><div class="card-meta"><span>${kind === 'review' ? 'REVIEW / COMPARISON' : 'BUYING GUIDE'}</span><span class="rating">${item.score}</span></div><h3>${item.title}</h3><p>${item.excerpt}</p><span class="more">Read article →</span></div>
  </a>`;
}
reviewGrid.innerHTML = data.reviews.map(x=>card(x,'review')).join('');
guideGrid.innerHTML = data.guides.map(x=>card(x,'guide')).join('');
const searchBtn=document.getElementById('searchBtn'), panel=document.getElementById('searchPanel'), input=document.getElementById('searchInput');
searchBtn?.addEventListener('click',()=>{panel.classList.toggle('open'); if(panel.classList.contains('open')) input.focus();});
input?.addEventListener('input',()=>{const q=input.value.trim().toLowerCase(); document.querySelectorAll('.searchable,.article-card').forEach(el=>{const text=(el.dataset.text||el.innerText).toLowerCase();el.classList.toggle('hidden',q&&!text.includes(q));});});
