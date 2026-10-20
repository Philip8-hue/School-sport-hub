(() => {
 const nav=document.getElementById('site-navigation');
 if(document.querySelector('.club-directory-page'))nav?.querySelector('a[href="aupl clubs.html"]')?.setAttribute('aria-current','page');
 const menu=document.querySelector('.nav-toggle');
 menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}});
 for(const link of nav?.querySelectorAll('a')||[])if(decodeURIComponent(link.pathname)===decodeURIComponent(location.pathname)||(location.pathname==='/'&&link.getAttribute('href')==='index.html'))link.setAttribute('aria-current','page');
 let accountUser;
 function accountLabels(){if(!accountUser)return;const link=document.querySelector('.account-link');if(link){link.textContent=window.homepageCopy?.[accountUser.role==='ADMIN'?'dashboardLabel':'signedInLabel']||(accountUser.role==='ADMIN'?'Dashboard ↗':'Signed in · Log out');link.href=accountUser.role==='ADMIN'?'admin.html':'#';}}
 window.addEventListener('homepage-content-ready',accountLabels);
 fetch('/api/auth/me').then(r=>r.ok?r.json():null).then(data=>{if(!data)return;accountUser=data.user;for(const link of document.querySelectorAll('.account-link')){link.textContent=data.user.role==='ADMIN'?'Dashboard ↗':'Signed in · Log out';link.href=data.user.role==='ADMIN'?'admin.html':'#';if(data.user.role!=='ADMIN')link.addEventListener('click',async e=>{e.preventDefault();try{const r=await fetch('/api/auth/logout',{method:'POST'});if(r.ok)location.reload();}catch{link.textContent='Try logging out again';}});}accountLabels();}).catch(()=>{});
 for(const image of document.images)image.addEventListener('error',()=>{image.removeAttribute('src');image.alt=image.alt||'Team image unavailable';},{once:true});
 for(const input of document.querySelectorAll('input:not([type=hidden]),select,textarea'))if(!input.labels?.length&&!input.hasAttribute('aria-label'))input.setAttribute('aria-label',input.placeholder||input.id.replace(/([A-Z])/g,' $1')||input.name||'Filter');
})();
