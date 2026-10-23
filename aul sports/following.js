(() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let state={favorites:[],players:[],clubs:[]}, signedIn=false, ready=false, scheduled=false;
  const buttons=new WeakMap();
  const status=document.createElement('p');status.className='following-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');document.body.append(status);
  const nav=document.getElementById('site-navigation');
  if(nav&&!nav.querySelector('[data-following-nav]')){const a=document.createElement('a');a.href='following.html';a.dataset.followingNav='';a.textContent='Following';if(location.pathname.endsWith('/following.html'))a.setAttribute('aria-current','page');nav.append(a);}
  const guide=document.querySelector('.site-footer');if(guide){const a=document.createElement('a');a.href='sports-hub-user-guide.pdf';a.textContent='Quick guide (PDF)';guide.append(a);}
  const page=document.getElementById('followingPage');
  let summary;
  if(document.querySelector('.home-layout .hero')){summary=document.createElement('section');summary.className='following-home';summary.hidden=true;summary.setAttribute('aria-label','Your following');document.querySelector('.home-layout .hero').after(summary);}
  const followed=(kind,id)=>state.favorites.some(f=>f.kind===kind&&f.targetId===Number(id));
  function labels(button,kind,id){
    const active=signedIn&&followed(kind,id);
    const text=!signedIn?'Sign in to follow':active?'Following':'Follow';
    if(button.textContent!==text)button.textContent=text;
    button.setAttribute('aria-pressed',String(active));button.classList.toggle('is-following',active);
    button.closest('[data-follow-kind]')?.classList.toggle('is-following-card',active);
    button.title=(active?'Already following. Open Following to manage.':text)+'. Your display name will appear in the public follower list.';
  }
  function decorate(){
    scheduled=false;if(!ready)return;
    document.querySelectorAll('[data-player-profile]').forEach(trigger=>{const host=trigger.closest('article,tr');if(host&&!host.hasAttribute('data-follow-kind')){host.dataset.followKind='PLAYER';host.dataset.followId=trigger.dataset.playerProfile;}});
    document.querySelectorAll('[data-follow-kind][data-follow-id]').forEach(host=>{
      const kind=host.dataset.followKind,id=host.dataset.followId;if(!['PLAYER','CLUB'].includes(kind))return;
      let button=buttons.get(host);
      if(!button){button=document.createElement('button');button.type='button';button.className='follow-toggle';button.dataset.toggleFollow=kind+':'+id;buttons.set(host,button);(host.tagName==='TR'?host.querySelector('td'):host)?.append(button);}
      labels(button,kind,id);
    });
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(decorate);}}
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  function cards(kind,limit=Infinity){
    const rows=(kind==='PLAYER'?state.players:state.clubs).slice(0,limit);
    return rows.map(row=>`<article class="following-card is-following-card"><span class="following-badge">Following</span><p class="eyebrow">${esc(row.sport)}</p><h3>${kind==='PLAYER'?`<button type="button" class="player-profile-trigger" data-player-profile="${row.id}">${esc(row.fullName||row.name)}</button>`:`<a href="club.html?id=${row.id}">${esc(row.name)}</a>`}</h3>${kind==='PLAYER'?`<p>${esc(row.club?.name||'Club not assigned')}</p>`:'<p>Club & squad</p>'}<div class="following-actions">${kind==='PLAYER'?`<button type="button" data-player-profile="${row.id}">View player</button>`:`<a class="button" href="club.html?id=${row.id}">View club</a>`}<button type="button" class="following-remove" data-remove-follow="${kind}:${row.id}">Unfollow</button></div></article>`).join('');
  }
  function render(){
    const count=state.players.length+state.clubs.length;
    const navLink=nav?.querySelector('[data-following-nav]');const text=signedIn?'Following ('+count+')':'Following';if(navLink&&navLink.textContent!==text)navLink.textContent=text;
    if(summary){summary.hidden=!signedIn;summary.innerHTML=`<div class="section-heading"><div><h2>Your following</h2><p>${state.clubs.length} ${state.clubs.length===1?'club':'clubs'} · ${state.players.length} ${state.players.length===1?'player':'players'}</p></div><a href="following.html">See all following</a></div>${count?`<div class="following-grid">${cards('CLUB',2)}${cards('PLAYER',2)}</div>`:'<p>Follow a club or player to see them here when you return home.</p><a href="players.html">Discover players</a> · <a href="aupl clubs.html">Explore clubs</a>'}`;}
    if(page){
      page.innerHTML=`<div class="following-heading"><p class="eyebrow">Your sports community</p><h1>Following</h1><p>Your saved clubs and players, wherever you are on Sports Hub. Your display name appears in their public follower lists.</p></div>${signedIn?`<div class="following-sections"><section><h2>Clubs <span>${state.clubs.length}</span></h2><div class="following-grid">${cards('CLUB')||'<p>You aren’t following any clubs yet. <a href="aupl clubs.html">Find a club</a>.</p>'}</div></section><section><h2>Players <span>${state.players.length}</span></h2><div class="following-grid">${cards('PLAYER')||'<p>You aren’t following any players yet. <a href="players.html">Meet the players</a>.</p>'}</div></section></div><div class="experience-links"><a class="button" href="account.html">My fan feed</a><a href="index.html">Back home</a></div>`:'<p>Sign in to see the clubs and players you follow. Your following is saved to your account.</p><a class="button" href="login.html?type=fan">Sign in as a fan</a>'}`;
    }
    schedule();
  }
  async function refresh(){
    try{const r=await fetch('/api/member/following');if(r.status===401){signedIn=false;state={favorites:[],players:[],clubs:[]};}else{if(!r.ok)throw new Error();state=await r.json();signedIn=true;}ready=true;render();}
    catch{ready=true;status.textContent='Following could not load. Refresh the page to try again.';if(page){page.textContent='Following could not load. ';const b=document.createElement('button');b.textContent='Try again';b.onclick=refresh;page.append(b);}schedule();}
  }
  async function change(kind,id,following,button){
    if(!signedIn){location.assign('login.html?type=fan');return;}
    button.disabled=true;
    try{const r=await fetch('/api/member/favorites',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,targetId:Number(id),following})});if(!r.ok){const d=await r.json();throw new Error(d.error||'Could not update following.');}await refresh();status.textContent=following?'Added to Following.':'Removed from Following.';window.dispatchEvent(new CustomEvent('following-updated'));}
    catch(e){status.textContent=e.message;}finally{button.disabled=false;}
  }
  document.addEventListener('click',event=>{
    const toggle=event.target.closest('[data-toggle-follow]'),remove=event.target.closest('[data-remove-follow]');
    if(toggle){event.preventDefault();const[kind,id]=toggle.dataset.toggleFollow.split(':');if(signedIn&&followed(kind,id)){location.assign('following.html');return;}change(kind,id,true,toggle);}
    if(remove){event.preventDefault();const[kind,id]=remove.dataset.removeFollow.split(':');change(kind,id,false,remove);}
  });
  window.addEventListener('following-changed',refresh);
  refresh();
})();
