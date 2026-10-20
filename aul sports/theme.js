(() => {
 const key='sports-hub-theme';
 const system=window.matchMedia('(prefers-color-scheme: dark)');
 let preference;try{preference=localStorage.getItem(key);}catch{}
 function apply(mode){document.documentElement.dataset.theme=mode;document.documentElement.style.colorScheme=mode;for(const button of document.querySelectorAll('.theme-toggle')){const dark=mode==='dark';button.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');button.title=button.getAttribute('aria-label');button.setAttribute('aria-pressed',String(dark));button.innerHTML=dark?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/></svg>';}}
 apply(preference==='dark'||preference==='light'?preference:system.matches?'dark':'light');
 system.addEventListener('change',event=>{if(!preference)apply(event.matches?'dark':'light');});
 window.addEventListener('storage',event=>{if(event.key===key){preference=event.newValue;apply(preference==='dark'||preference==='light'?preference:system.matches?'dark':'light');}});
 function init(){
  const button=document.createElement('button');button.type='button';button.className='theme-toggle';
  const header=document.querySelector('body > header');const admin=document.querySelector('.header-actions');
  if(header)header.insertBefore(button,header.querySelector('.account-link'));else if(admin)admin.prepend(button);else{button.classList.add('theme-toggle-floating');document.body.append(button);}
  button.addEventListener('click',()=>{preference=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem(key,preference);}catch{}apply(preference);});
  const menu=document.querySelector('.nav-toggle');if(menu){menu.setAttribute('aria-label','Toggle navigation');const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');svg.setAttribute('aria-hidden','true');svg.classList.add('mobile-menu-icon');svg.innerHTML='<path d="M4 6h16M4 12h16M4 18h16"/>';menu.prepend(svg);}
  apply(document.documentElement.dataset.theme);
 }
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();
