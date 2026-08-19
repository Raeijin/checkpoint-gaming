
const ids=['type','category','title','excerpt','score','slug','quick','body','product','affiliate'];
const el=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));

function slugify(s){return s.toLowerCase().trim().replace(/['"]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
function getData(){
  return {
    type:el.type.value, category:el.category.value.trim(), title:el.title.value.trim(),
    excerpt:el.excerpt.value.trim(), score:el.score.value.trim(), slug:(el.slug.value.trim()||slugify(el.title.value)),
    quick:el.quick.value.trim(), body:el.body.value.trim(), product:el.product.value.trim(),
    affiliate_url:el.affiliate.value.trim(), updated:new Date().toISOString().slice(0,10)
  };
}
function updatePreview(){
 const d=getData();
 document.getElementById('pCategory').textContent=d.category||'GUIDE';
 document.getElementById('pTitle').textContent=d.title||'Your article title';
 document.getElementById('pExcerpt').textContent=d.excerpt||'Your homepage summary will appear here.';
 document.getElementById('pQuick').textContent=d.quick||'Your direct answer appears here.';
 document.getElementById('pBody').textContent=d.body||'Start writing on the left to preview it here.';
 const box=document.getElementById('pProductBox');
 box.style.display=d.product?'grid':'none';
 document.getElementById('pProduct').textContent=d.product;
}
ids.forEach(id=>el[id].addEventListener('input',()=>{if(id==='title'&&!el.slug.dataset.edited) el.slug.value=slugify(el.title.value); updatePreview()}));
el.slug.addEventListener('input',()=>el.slug.dataset.edited='1');

function drafts(){return JSON.parse(localStorage.getItem('checkpointDrafts')||'[]')}
function setDrafts(x){localStorage.setItem('checkpointDrafts',JSON.stringify(x));renderDrafts()}
function renderDrafts(){
 const box=document.getElementById('drafts'); const ds=drafts();
 box.innerHTML=ds.length?ds.map((d,i)=>`<div class="draft-item"><div><strong>${d.title||'Untitled'}</strong><br><small>${d.category} • ${d.updated}</small></div><div><button onclick="loadDraft(${i})">Edit</button> <button onclick="deleteDraft(${i})">×</button></div></div>`).join(''):'<p style="color:var(--muted)">No drafts yet.</p>';
}
window.loadDraft=i=>{const d=drafts()[i]; ids.forEach(id=>{if(el[id]&&d[id]!==undefined)el[id].value=d[id]}); updatePreview(); window.scrollTo({top:0,behavior:'smooth'})}
window.deleteDraft=i=>{const ds=drafts();ds.splice(i,1);setDrafts(ds)}
document.getElementById('saveDraft').onclick=()=>{const d=getData();let ds=drafts();const i=ds.findIndex(x=>x.slug===d.slug);if(i>=0)ds[i]=d;else ds.unshift(d);setDrafts(ds);alert('Draft saved on this device/browser.');}
document.getElementById('exportJson').onclick=()=>{
 const d=getData(); if(!d.title){alert('Add a title first.');return}
 const blob=new Blob([JSON.stringify(d,null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(d.slug||'article')+'.json';a.click();URL.revokeObjectURL(a.href);
}
document.getElementById('clearForm').onclick=()=>{ids.forEach(id=>el[id].value='');el.type.value='guide';el.category.value='BEGINNER GUIDE';delete el.slug.dataset.edited;updatePreview()}
updatePreview();renderDrafts();
