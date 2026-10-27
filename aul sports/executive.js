(() => {
  const root = document.getElementById('executiveHome');
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let data, tab='players', editing=null;
  const titles={players:'Players',clubs:'Clubs',fixtures:'Fixtures',results:'Results',tables:'League tables',news:'News',fantasy:'Fantasy'};
  // Reuse the tested fantasy editor with a scoped API, not the administrator API.
  window.escapeHtml=esc;
  window.api=(path,options={})=>api(path.replace('/api/admin/fantasy','/api/executive/fantasy'),options.method||'GET',options.body?JSON.parse(options.body):undefined);
  window.setMessage=message=>{document.getElementById('executiveFantasyMessage').textContent=message;};
  async function api(path, method='GET', body) {
    const response=await fetch(path,{method,headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined,cache:'no-store'});
    const result=await response.json().catch(()=>({}));
    if(!response.ok){if(result.code==='MFA_SETUP_REQUIRED')throw Error('Open Account security to complete two-step verification, then return here.');throw Error(response.status===401?'Your session expired. Sign in in another tab, then try saving again.':result.error||'Unable to save. Please try again.');}return result;
  }
  const options=(rows,value)=>rows.map(([id,name])=>`<option value="${esc(id)}" ${String(id)===String(value)?'selected':''}>${esc(name)}</option>`).join('');
  const field=(name,label,value='',type='text',required=false)=>`<label>${esc(label)}<input name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''} ${type==='number'?'min="0" step="any"':''}></label>`;
  const category=(value)=>`<label>Sport category<select name="sport" ${editing?'disabled':''}>${options(data.sports.map(s=>[s,s]),value||data.sports[0])}</select></label>`;
  const clubs=(name,label,sport,value,required=false)=>`<label>${label}<select name="${name}" ${required?'required':''}><option value="">${required?'Choose club':'No club assigned'}</option>${options(data.clubs.filter(c=>c.sport===sport).map(c=>[c.id,c.name]),value)}</select></label>`;
  const stats=(sport,row={})=>window.playerStatFields(sport).map(([key,label])=>field(key,label,row[key]??0,'number')).join('');
  function form() {
    const row=editing||{},sport=row.sport||data.sports[0];
    if(tab==='clubs')return category(sport)+field('name','Club name',row.name,'text',true);
    if(tab==='news')return category(sport)+field('title','Headline',row.title,'text',true)+`<label>Short introduction<textarea name="excerpt" maxlength="300" rows="2">${esc(row.excerpt)}</textarea></label><label>Article<textarea name="content" required rows="7">${esc(row.content)}</textarea></label><label class="executive-check"><input name="published" type="checkbox" ${row.published?'checked':''}> Publish on the school news page</label>`;
    if(tab==='players')return category(sport)+field('name','Player name',row.name,'text',true)+field('fullName','Full name (optional)',row.fullName)+clubs('clubId','Club',sport,row.clubId)+field('position','Position',row.position)+field('jerseyNumber','Jersey number',row.jerseyNumber,'number')+field('rating','Rating (0–10)',row.rating??5,'number')+field('price','Fantasy price (optional)',row.price,'number')+`<label class="executive-check"><input name="captain" type="checkbox" ${row.captain?'checked':''}> Team captain</label><fieldset class="executive-stat-fields"><legend>Official player statistics</legend><div data-stat-fields>${stats(sport,row)}</div></fieldset>`;
    if(tab==='fixtures')return category(sport)+clubs('homeClubId','Home club',sport,row.homeClubId,true)+clubs('awayClubId','Away club',sport,row.awayClubId,true)+field('startsAt','Match date and time',row.startsAt?new Date(Date.parse(row.startsAt)-new Date(row.startsAt).getTimezoneOffset()*60000).toISOString().slice(0,16):'','datetime-local',true)+field('venue','Venue',row.venue)+`<label>Status<select name="status">${options(['SCHEDULED','LIVE','COMPLETED','CANCELLED'].map(s=>[s,s[0]+s.slice(1).toLowerCase()]),row.status||'SCHEDULED')}</select></label>`;
    if(tab==='results')return `<label>Match<select name="fixtureId" required><option value="">Choose match</option>${options(data.fixtures.map(f=>[f.id,`${f.homeClub?.name||'TBC'} vs ${f.awayClub?.name||'TBC'} · ${f.sport} · ${new Date(f.startsAt).toLocaleDateString()}`]),row.fixtureId)}</select></label><p>Use goals for football, points for basketball and sets won for volleyball.</p>`+field('homeScore','Home score',row.homeScore??0,'number',true)+field('awayScore','Away score',row.awayScore??0,'number',true);
    return category(sport)+clubs('clubId','Club',sport,row.clubId,true)+['played','won','drawn','lost','points'].map(key=>field(key,key[0].toUpperCase()+key.slice(1),row[key]??0,'number',true)).join('');
  }
  function rows() {
    const list=tab==='results'?data.fixtures.filter(f=>f.result).map(f=>({...f.result,fixtureId:f.id,label:`${f.homeClub?.name||'TBC'} ${f.result.homeScore} – ${f.result.awayScore} ${f.awayClub?.name||'TBC'}`,sport:f.sport})):data[tab];
    return list.length?list.map((row,index)=>`<article class="executive-row"><div><h3>${esc(row.label||row.name||row.title||(tab==='fixtures'?`${row.homeClub?.name||'TBC'} vs ${row.awayClub?.name||'TBC'}`:row.club?.name))}</h3><p>${esc(row.sport)}${tab==='players'?' · '+esc(row.club?.name||'Unassigned')+' · '+esc(row.position||'Position not set'):''}${tab==='fixtures'?' · '+esc(new Date(row.startsAt).toLocaleString())+' · '+esc(row.status):''}${tab==='tables'?' · '+esc(row.points)+' points':''}</p></div><button type="button" class="button secondary" data-edit="${index}">Edit</button></article>`).join(''):'<p class="member-empty">Nothing listed yet. Add the first entry using the form.</p>';
  }
  function render() {
    document.getElementById('executiveFantasy').hidden=tab!=='fantasy';
    if(tab==='fantasy'){const previous=tab;tab='players';render();tab=previous;root.querySelector('.executive-layout').hidden=true;root.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab==='fantasy')));document.getElementById('executiveFantasy').hidden=false;return;}
    root.innerHTML=`<header class="member-header"><div><p>${esc(data.sport[0].toUpperCase()+data.sport.slice(1))} executive</p><h1>Your sport. Your workspace.</h1><p>Manage your sport’s teams and matches. Manage news and fantasy too. Approval requests and account permissions are handled by the overall admins.</p></div><div class="experience-links"><a href="security.html">Account security</a><a href="executive-login.html" target="_blank" rel="noopener">Sign in</a><button type="button" data-logout>Sign out</button></div></header><nav class="member-tabs" aria-label="Executive tools">${Object.entries(titles).map(([key,title])=>`<button type="button" data-tab="${key}" aria-pressed="${tab===key}">${title}</button>`).join('')}</nav><div class="executive-layout"><section class="member-panel"><h2>${editing?'Edit':'Add'} ${esc(tab==='tables'?'table entry':tab==='results'?'result':tab==='news'?'article':tab.slice(0,-1))}</h2><form id="executiveForm" class="member-form">${form()}<div class="experience-links"><button type="submit">Save ${esc(tab==='tables'?'entry':tab==='news'?'article':tab.slice(0,-1))}</button>${editing?'<button type="button" class="button secondary" data-cancel>Cancel edit</button>':''}</div><p id="executiveMessage" role="status"></p></form></section><section class="member-panel"><h2>${esc(titles[tab])}</h2><label>Search this list<input id="executiveSearch" type="search" placeholder="Type a name"></label><div id="executiveRows">${rows()}</div></section></div>`;
  }
  async function load(){data=await api('/api/executive/dashboard');render();}
  root.addEventListener('click',async event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.tab){tab=button.dataset.tab;editing=null;render();if(tab==='fantasy'){try{await window.loadFantasy();}catch(error){window.setMessage(error.message);}}}
    if(button.hasAttribute('data-cancel')){editing=null;render();}
    if(button.hasAttribute('data-edit')){const list=tab==='results'?data.fixtures.filter(f=>f.result).map(f=>({...f.result,fixtureId:f.id})):data[tab];editing=list[Number(button.dataset.edit)];render();root.querySelector('form input,form select')?.focus();}
    if(button.hasAttribute('data-logout')){await api('/api/auth/logout','POST');location.assign('executive-login.html');}
  });
  root.addEventListener('input',event=>{if(event.target.id==='executiveSearch'){const text=event.target.value.toLowerCase();root.querySelectorAll('.executive-row').forEach(row=>row.hidden=!row.textContent.toLowerCase().includes(text));}});
  root.addEventListener('change',event=>{
    if(event.target.name==='sport'){
      const sport=event.target.value;
      for(const select of root.querySelectorAll('form select[name$="ClubId"],form select[name="clubId"]'))select.innerHTML=`<option value="">Choose club</option>`+options(data.clubs.filter(c=>c.sport===sport).map(c=>[c.id,c.name]));
      const area=root.querySelector('[data-stat-fields]');if(area)area.innerHTML=stats(sport);
    }
    if(event.target.name==='fixtureId'){const f=data.fixtures.find(f=>f.id===Number(event.target.value));if(f?.result){event.target.form.elements.homeScore.value=f.result.homeScore;event.target.form.elements.awayScore.value=f.result.awayScore;}}
  });
  root.addEventListener('submit',async event=>{
    event.preventDefault();const f=event.target,button=f.querySelector('[type=submit]'),message=f.querySelector('[role=status]');button.disabled=true;message.textContent='Saving…';
    try {
      let body=Object.fromEntries(new FormData(f));if(f.elements.sport)body.sport=f.elements.sport.value;
      let path='/api/executive/'+tab,method=editing?'PATCH':'POST';
      if(tab==='clubs')body.slug=editing?.slug||`${body.sport}-${body.name}`.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,110);
      if(tab==='news'){body.slug=editing?.slug||`${body.sport}-${body.title}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,190);body.published=f.elements.published.checked;}
      if(tab==='players'){
        for(const key of ['jerseyNumber','rating','price','clubId'])body[key]=body[key]===''?null:Number(body[key]);
        body.captain=f.elements.captain.checked;
        for(const [key] of window.playerStatFields(body.sport))body[key]=Number(body[key]||0);
        body.fullName=body.fullName||null;body.position=body.position||null;
      }
      if(tab==='fixtures'){body.startsAt=new Date(body.startsAt).toISOString();for(const key of ['homeClubId','awayClubId'])body[key]=Number(body[key]);}
      if(tab==='results'){path='/api/executive/fixtures/'+body.fixtureId+'/result';body={homeScore:Number(body.homeScore),awayScore:Number(body.awayScore)};method='PUT';}
      if(tab==='tables'){for(const key of ['clubId','played','won','drawn','lost','points'])body[key]=Number(body[key]);method='PUT';}
      if(editing&&['clubs','players','fixtures'].includes(tab))path+='/'+editing.id;
      await api(path,method,body);editing=null;await load();root.querySelector('[role=status]').textContent='Saved successfully.';
    }catch(error){message.textContent=error.message;}finally{button.disabled=false;}
  });
  load().catch(error=>{root.innerHTML=`<h1>Executive workspace</h1><p role="alert">${esc(error.message)}</p><p><a href="executive-login.html">Executive sign in</a> · <a href="security.html">Account security</a></p>`;});
})();
