(() => {
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const names={clubs:'homeClubs',players:'homePlayers',fixtures:'homeFixtures',results:'homeResults',tables:'homeTables',news:'homeNews'};
 let records={},sport='',copy={}; const t=(key,fallback='')=>copy[key]??fallback;
 const empty=text=>`<p class="homepage-data-empty">${text}</p>`;
 const date=value=>new Date(value).toLocaleString(undefined,{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'});
 function render(){
  for(const [kind,target] of Object.entries(names)){
   const el=document.getElementById(target), all=records[kind];if(!el)continue;
   if(!all){el.innerHTML=empty(`${esc(t('dataError','Unable to load this section.'))} <button type="button" data-retry-home>${esc(t('retryLabel','Try again'))}</button>`);continue;}
   let rows=all.filter(row=>!sport||String(row.sport||row.fixture?.sport||'').includes(sport)||kind==='news');
   if(kind==='fixtures')rows=rows.filter(r=>r.status==='SCHEDULED'&&new Date(r.startsAt)>=new Date());
   if(kind==='results')rows=[...rows].sort((a,b)=>new Date(b.playedAt||b.createdAt)-new Date(a.playedAt||a.createdAt));
   if(kind==='players')rows=[...rows].sort((a,b)=>(b.rating??-1)-(a.rating??-1)||(b.matches??0)-(a.matches??0)||a.name.localeCompare(b.name));
   rows=rows.slice(0,kind==='tables'?8:3);
   if(!rows.length){el.innerHTML=empty(esc(t('empty'+kind[0].toUpperCase()+kind.slice(1),'No records yet.')));continue;}
   if(kind==='tables'){el.innerHTML=`<table><caption class="sr-only">${esc(t('tableCaption'))}</caption><thead><tr>${['tableClub','tablePlayed','tableWon','tablePoints'].map(key=>`<th>${esc(t(key))}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.club?.name)}</td><td>${r.played}</td><td>${r.won}</td><td><strong>${r.points}</strong></td></tr>`).join('')}</tbody></table>`;continue;}
   el.innerHTML=rows.map(r=>{
    if(kind==='fixtures')return `<article class="match"><p>${esc(r.sport)}</p><h3>${esc(r.homeClub?.name||t('teamTbc'))} <span>${esc(t('versusLabel','vs'))}</span> ${esc(r.awayClub?.name||t('teamTbc'))}</h3><span>${date(r.startsAt)} · ${esc(r.venue||t('venueTbc'))}</span></article>`;
    if(kind==='results')return `<article class="match"><p>${esc(r.fixture?.sport)} · ${esc(t('fullTime'))}</p><h3>${esc(r.fixture?.homeClub?.name||t('homeTeam'))} ${r.homeScore} – ${r.awayScore} ${esc(r.fixture?.awayClub?.name||t('awayTeam'))}</h3><span>${date(r.playedAt||r.createdAt)}</span></article>`;
    if(kind==='news')return `<article><p class="eyebrow">${esc(t('newsCategory'))} · ${new Date(r.publishedAt||r.createdAt).toLocaleDateString()}</p><h3>${esc(r.title)}</h3><p>${esc(r.excerpt||r.content.slice(0,220))}</p></article>`;
    return `<article><p class="eyebrow">${esc(r.sport)}</p><h3>${esc(r.name)}</h3><p>${esc(kind==='players'?[r.position,r.club?.name].filter(Boolean).join(' · '):t('clubDescription'))}</p>${kind==='players'?`<small>${esc(t('ratingLabel'))} ${r.rating??'—'} · ${esc(t('appearancesLabel'))} ${r.matches??0}</small>`:''}</article>`;
   }).join('');
  }
 }
 async function load(){await Promise.all(Object.keys(names).map(async kind=>{try{const r=await fetch('/api/'+kind);if(!r.ok)throw new Error();records[kind]=await r.json();}catch{records[kind]=null;}}));render();}
 document.querySelectorAll('[data-home-sport]').forEach(button=>button.addEventListener('click',()=>{sport=button.dataset.homeSport;document.querySelectorAll('[data-home-sport]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});render();}));
 document.addEventListener('click',event=>{if(event.target.closest('[data-retry-home]'))load();});
 async function init(){
  const fields=await fetch('homepage-copy.json').then(r=>r.json()).catch(()=>[]);
  copy=Object.fromEntries(fields.map(field=>[field.key,field.value]));
  try{const r=await fetch('/api/homepage');if(r.ok){const data=await r.json();copy={...copy,...data.content.copy};}}catch{}
  window.homepageCopy=copy;
  document.querySelector('.hero')?.style.setProperty('--hero-watermark', JSON.stringify(t('heroWatermark','AUL')));
  for(const field of fields){
   const el=document.querySelector(field.selector||`[data-home-${field.attribute?'attribute-'+field.attribute:'copy'}="${field.key}"]`);if(!el)continue;
   if(field.attribute){const value=copy[field.key]??field.value;if(field.attribute==='href'){try{const url=new URL(value,location.href);if(!['http:','https:'].includes(url.protocol))continue;}catch{continue;}}el.setAttribute(field.attribute,value);}
   else el.textContent=copy[field.key]??field.value;
  }
  window.dispatchEvent(new Event('homepage-content-ready'));load();
 }
 init();
})();
