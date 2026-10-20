(() => {
 const symbols = new Map([
  ['⚽','football'],['🏀','basketball'],['🏐','volleyball'],['🏆','trophy'],['🔒','lock'],['🛡','shield'],['🧤','glove'],['🔥','flame'],['⚡','bolt'],['➕','plus'],['🗑','trash'],['✕','close'],['✖','close'],['❌','close'],['✅','check'],['✓','check'],['⭐','star'],['👑','crown'],['🔄','swap'],['👤','user'],['👥','users'],['🧑‍🏫','coach'],['📰','news'],['📣','megaphone'],['📖','book'],['💙','heart'],['🦅','wing'],['🔴','activity']
 ]);
 const pattern = new RegExp([...symbols.keys()].sort((a,b)=>b.length-a.length).join('|')+'(?:\uFE0F)?','gu');
 const ns = 'http://www.w3.org/2000/svg';
 function icon(name) {
  const svg=document.createElementNS(ns,'svg');svg.setAttribute('class','ui-icon');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.7');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
  const use=document.createElementNS(ns,'use');use.setAttribute('href','icons.svg#'+name);svg.append(use);return svg;
 }
 function replace(node) {
  const parent=node.parentElement;if(!parent||parent.closest('script,style,svg,textarea,[contenteditable="true"]'))return;
  const text=node.nodeValue;const matches=[...text.matchAll(pattern)];if(!matches.length)return;
  if(parent.closest('option,title')){node.nodeValue=text.replace(pattern,'').replace(/\s+/g,' ').trim();return;}
  const fragment=document.createDocumentFragment();let position=0;
  for(const match of matches){fragment.append(document.createTextNode(text.slice(position,match.index)));const key=match[0].replace(/\uFE0F/g,'');fragment.append(icon(symbols.get(key)||'star'));position=match.index+match[0].length;}
  fragment.append(document.createTextNode(text.slice(position)));node.replaceWith(fragment);
 }
 function scan(root) {
  if(root.nodeType===Node.TEXT_NODE){replace(root);return;}
  if(root.nodeType!==Node.ELEMENT_NODE||root.closest('svg,script,style'))return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(replace);
 }
 function init() {
  const navigation={overview:'grid',homepage:'home',clubs:'shield',players:'user',fixtures:'calendar',results:'check',tables:'table',news:'news',community:'message',users:'users'};
  for(const button of document.querySelectorAll('[data-section]')){const holder=button.querySelector('.nav-icon');if(holder)holder.replaceChildren(icon(navigation[button.dataset.section]||'grid'));}
  const menu=document.getElementById('menuButton');if(menu)menu.replaceChildren(icon('menu'));
  scan(document.body);
  new MutationObserver(records=>{for(const record of records){if(record.type==='characterData')scan(record.target);else for(const node of record.addedNodes)scan(node);}}).observe(document.body,{subtree:true,childList:true,characterData:true});
 }
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();
