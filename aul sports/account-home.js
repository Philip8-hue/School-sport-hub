(() => {
  const root = document.getElementById('accountHome');
  root.classList.add('member-home');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date = value => new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  const label = value => value.toLowerCase().replaceAll('_',' ').replace(/^./, c => c.toUpperCase());
  let data, playerId, clubId, message = new URLSearchParams(location.search).get('notice')==='admin-only'?'The admin workspace is for administrators only. This is your regular account dashboard.':'';
  const empty = text => `<p class="member-empty">${esc(text)}</p>`;
  const panel = (title, body, description = '') => `<section class="member-panel"><h2>${esc(title)}</h2>${description ? `<p class="muted">${esc(description)}</p>` : ''}${body}</section>`;
  const option = (id, name) => `<option value="${id}">${esc(name)}</option>`;
  const teamName = id => data.directory.clubs.find(c => c.id === id)?.name || 'Team removed';
  const playerName = id => data.directory.players.find(p => p.id === id)?.name || 'Player removed';
  const matchName = f => `${f.homeClub?.name || 'TBC'} vs ${f.awayClub?.name || 'TBC'}`;
  const teamFixtures = id => data.fixtures.filter(f => f.homeClubId === id || f.awayClubId === id);
  const upcoming = rows => rows.filter(f => ['SCHEDULED','LIVE'].includes(f.status) && new Date(f.startsAt) >= new Date(Date.now() - 86400000)).sort((a,b) => new Date(a.startsAt)-new Date(b.startsAt));
  const fixtureList = rows => rows.length ? `<ul class="member-list">${rows.slice(0,8).map(f => `<li><strong>${esc(matchName(f))}</strong><span>${esc(date(f.startsAt))} · ${esc(f.venue || 'Venue TBC')}</span>${f.result ? `<b>${f.result.homeScore} – ${f.result.awayScore}</b>` : `<span class="member-badge">${esc(label(f.status))}</span>`}</li>`).join('')}</ul>` : empty('No matches published yet.');
  function requests() {
    return data.requests.length ? `<ul class="member-list">${data.requests.map(r => `<li><strong>${esc(r.kind === 'PLAYER' ? playerName(r.targetId) : teamName(r.targetId))} · ${esc(label(r.kind))}</strong><span class="member-badge">${esc(label(r.status))}</span>${r.reviewNote ? `<p>${esc(r.reviewNote)}</p>` : ''}</li>`).join('')}</ul>` : empty('No profile or team requests submitted yet.');
  }
  function requestForm(kind) {
    const directory = kind === 'PLAYER' ? data.directory.players : data.directory.clubs;
    return `<form data-member-form="request" class="member-form"><input type="hidden" name="kind" value="${kind}"><label>Sport<select data-link-sport><option value="">All sports</option>${[...new Set(directory.map(row=>row.sport))].map(sport=>`<option>${esc(sport)}</option>`).join('')}</select></label>${kind==='PLAYER'?`<label>Club<select data-link-club><option value="">All clubs</option>${data.directory.clubs.map(club=>option(club.id,club.name+' · '+club.sport)).join('')}</select></label>`:''}<label>Search ${kind==='PLAYER'?'players':'teams'}<input type="search" data-link-search placeholder="Type a name"></label><label>${kind === 'PLAYER' ? 'Your existing player profile' : 'Team you coach'}<select name="targetId" required><option value="">Choose a ${kind === 'PLAYER' ? 'player' : 'team'}</option>${directory.map(row => option(row.id, `${row.name} · ${row.sport}${kind === 'PLAYER' && row.clubId ? ' · '+teamName(row.clubId) : ''}`)).join('')}</select></label><label>Help the admin verify your request<textarea name="message" minlength="10" maxlength="1000" required rows="3" placeholder="Tell the admin how you are connected to this profile or team."></textarea></label><button>Request admin approval</button></form>`;
  }
  function submissions() {
    return data.submissions.length ? `<ul class="member-list">${data.submissions.map(s => `<li><strong>${esc(label(s.kind))}</strong><span class="member-badge">${esc(label(s.status))}</span><p>${esc(s.details)}</p>${s.reviewNote ? `<p>Admin response: ${esc(s.reviewNote)}</p>` : ''}</li>`).join('')}</ul>` : empty('Your correction requests and submissions will appear here.');
  }
  function announcements(id) {
    const rows = data.announcements.filter(a => a.clubId === id);
    return rows.length ? rows.map(a => `<article class="member-notice"><h3>${esc(a.title)}</h3><p>${esc(a.body)}</p><small>${esc(date(a.createdAt))}</small></article>`).join('') : empty('No team announcements yet.');
  }
  function lineups(id) {
    const rows = data.lineups.filter(l => l.clubId === id);
    return rows.length ? rows.map(l => `<article class="member-notice"><h3>${esc(matchName(l.fixture))}</h3><p>${JSON.parse(l.playerIds).map(playerName).map(esc).join(', ')}</p>${l.note ? `<p>${esc(l.note)}</p>` : ''}<small>Proposed squad · ${esc(date(l.updatedAt))}</small></article>`).join('') : empty('No proposed lineups yet.');
  }
  function playerView() {
    const links = data.playerLinks;
    if (!links.length) return panel('Link your player profile', '<p>Choose your existing profile. Your statistics and private team information appear after an admin approves the link.</p>'+requestForm('PLAYER'));
    const link = links.find(l => l.playerId === playerId) || links[0]; playerId = link.playerId;
    const p = link.player;
    const matches = teamFixtures(p.clubId);
    const fields = window.playerStatFields(p.sport).filter(([key]) => /goalkeeper|keeper|\bgk\b/i.test(p.position || '') || !['saves','cleanSheets'].includes(key));
    const current = p.snapshots[0], previous = p.snapshots[1];
    const history = p.snapshots.length ? `<div class="member-table-wrap"><table><caption>Recorded season totals, most recent first</caption><thead><tr><th>Updated</th>${fields.slice(0,5).map(([,name])=>`<th>${esc(name)}</th>`).join('')}</tr></thead><tbody>${p.snapshots.map(s=>{const v=JSON.parse(s.stats);return `<tr><td>${esc(date(s.capturedAt))}</td>${fields.slice(0,5).map(([key])=>`<td>${esc(v[key]??0)}</td>`).join('')}</tr>`;}).join('')}</tbody></table></div>` : empty('Performance history starts when the admin next updates your statistics. No past match data has been invented.');
    const changes = current && previous ? `<p class="muted">Latest update: ${fields.filter(([key])=>JSON.parse(current.stats)[key]!==JSON.parse(previous.stats)[key]).map(([key,name])=>`${esc(name)} ${Number(JSON.parse(current.stats)[key]||0)-Number(JSON.parse(previous.stats)[key]||0)>=0?'+':''}${Number(JSON.parse(current.stats)[key]||0)-Number(JSON.parse(previous.stats)[key]||0)}`).join(' · ') || 'No change in these totals'}</p>` : '';
    return `<label class="member-picker">My linked profile<select data-member-select="player">${links.map(l=>`<option value="${l.playerId}" ${l.playerId===playerId?'selected':''}>${esc(l.player.name)} · ${esc(l.player.sport)}</option>`).join('')}</select></label>`+
      panel('My profile', `<div class="member-profile"><div class="profile-photo" role="img" aria-label="Player photo not added yet"></div><div><p class="eyebrow">${esc(p.sport)}</p><h3>${esc(p.fullName || p.name)} ${p.captain?'<span class="captain-badge">Captain</span>':''}</h3><p>${esc(p.club?.name || 'No club assigned')} · ${esc(p.position || 'Position TBC')}</p><p>Jersey ${esc(p.jerseyNumber??'—')} · Rating ${esc(p.rating??'—')}</p><button type="button" class="button secondary" data-player-profile="${p.id}">Open public player card</button></div></div><form data-member-form="bio" class="member-form"><input type="hidden" name="playerId" value="${p.id}"><label>My bio<textarea name="bio" maxlength="1000" rows="3">${esc(link.bio)}</textarea></label><button>Save my bio</button></form>`)+
      panel('My statistics', `<dl class="profile-stat-grid">${fields.map(([key,name])=>`<div><dt>${esc(name)}</dt><dd>${esc(p[key]??0)}</dd></div>`).join('')}</dl>${changes}`)+
      `<div class="member-columns">${panel('Upcoming matches',fixtureList(upcoming(matches)))}${panel('Recent results',fixtureList(matches.filter(f=>f.result)))}</div>`+
      panel('My performance history',history)+
      panel('Match availability', upcoming(matches).length ? `<form data-member-form="availability" class="member-form"><input type="hidden" name="playerId" value="${p.id}"><label>Match<select name="fixtureId">${upcoming(matches).map(f=>option(f.id,matchName(f)+' · '+date(f.startsAt))).join('')}</select></label><label>Availability<select name="status"><option value="AVAILABLE">Available</option><option value="UNAVAILABLE">Unavailable</option><option value="UNSURE">Not sure yet</option></select></label><label>Note for your coach<textarea name="note" maxlength="500" rows="2"></textarea></label><button>Save availability</button></form><ul class="member-list">${data.availability.filter(a=>a.playerId===p.id).map(a=>`<li>${esc(matchName(data.fixtures.find(f=>f.id===a.fixtureId)||{}))}: ${esc(label(a.status))}${a.note?` · ${esc(a.note)}`:''}</li>`).join('')}</ul>` : empty('Availability opens when your team has an upcoming fixture.'), 'Only you and approved coaches of your team can see your availability.')+
      `<div class="member-columns">${panel('Team announcements',announcements(p.clubId))}${panel('Proposed lineups',lineups(p.clubId))}</div>`+
      panel('Request a correction', `<form data-member-form="submission" class="member-form"><input type="hidden" name="kind" value="PROFILE_CORRECTION"><input type="hidden" name="playerId" value="${p.id}"><label>What should the admin check?<textarea name="details" required maxlength="3000" rows="3" placeholder="Describe the statistic or profile detail and the correction needed."></textarea></label><button>Send for review</button></form>`)+
      `<details class="member-panel"><summary>Link another player profile</summary>${requestForm('PLAYER')}</details>`;
  }
  function coachView() {
    const links = data.coachLinks;
    if (!links.length) return panel('Request a coaching assignment','<p>Select your team. Squad tools and private team information unlock only after admin approval.</p>'+requestForm('COACH'));
    const link = links.find(l=>l.clubId===clubId)||links[0]; clubId=link.clubId;
    const club = link.club, matches=teamFixtures(clubId), next=upcoming(matches), standing=club.tableEntries[0];
    const league = data.standings.filter(r=>r.sport===club.sport);
    const rank = league.findIndex(r=>r.clubId===clubId);
    const fields=window.playerStatFields(club.sport).slice(0,6);
    const roster=`<div class="member-table-wrap"><table><caption>${esc(club.name)} · ${esc(club.sport)}</caption><thead><tr><th>Player</th><th>Position</th>${fields.map(([,name])=>`<th>${esc(name)}</th>`).join('')}</tr></thead><tbody>${club.players.map(p=>`<tr><td><button type="button" class="player-profile-trigger" data-player-profile="${p.id}">${esc(p.name)}</button></td><td>${esc(p.position||'—')}</td>${fields.map(([key])=>`<td>${esc(p[key]??0)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    return `<label class="member-picker">My assigned team<select data-member-select="club">${links.map(l=>`<option value="${l.clubId}" ${l.clubId===clubId?'selected':''}>${esc(l.club.name)} · ${esc(l.club.sport)}</option>`).join('')}</select></label>`+
      panel(club.name,`<p>${esc(club.sport)} · ${club.players.length} squad members</p><div class="member-metrics"><div><strong>${rank<0?'—':rank+1}</strong>League position</div><div><strong>${standing?.played??'—'}</strong>Played</div><div><strong>${standing?.won??'—'}</strong>Wins</div><div><strong>${standing?.points??'—'}</strong>League points</div></div>`)+
      `<div class="member-columns">${panel('Next matches',fixtureList(next))}${panel('Recent results',fixtureList(matches.filter(f=>f.result)))}</div>`+
      panel('Squad & performance',roster)+
      panel('Player availability',data.availability.filter(a=>a.player.clubId===clubId).length?`<ul class="member-list">${data.availability.filter(a=>a.player.clubId===clubId).map(a=>`<li><strong>${esc(a.player.name)} · ${esc(label(a.status))}</strong><span>${esc(matchName(data.fixtures.find(f=>f.id===a.fixtureId)||{}))}</span><p>${esc(a.note)}</p></li>`).join('')}</ul>`:empty('Players with approved profiles can submit availability for upcoming matches.'))+
      panel('Prepare a lineup',next.length&&club.players.length?`<form data-member-form="lineup" class="member-form"><input type="hidden" name="clubId" value="${clubId}"><label>Match<select name="fixtureId">${next.map(f=>option(f.id,matchName(f))).join('')}</select></label><fieldset><legend>Proposed squad</legend><div class="member-checks">${club.players.map(p=>`<label><input type="checkbox" name="playerIds" value="${p.id}"> ${esc(p.name)} · ${esc(p.position||'—')}</label>`).join('')}</div></fieldset><label>Lineup notes<textarea name="note" maxlength="1000" rows="3" placeholder="Starting positions, substitutes or match preparation notes"></textarea></label><button>Save proposed lineup</button></form>${lineups(clubId)}`:empty('Add a fixture and squad players before preparing a lineup.'))+
      panel('Team announcements',`<form data-member-form="announcement" class="member-form"><input type="hidden" name="clubId" value="${clubId}"><label>Title<input name="title" required maxlength="120"></label><label>Message<textarea name="body" required maxlength="3000" rows="3"></textarea></label><button>Post to my team</button></form>${announcements(clubId)}`,'Visible only to linked players and approved coaches of this team.')+
      panel('Submit an update for admin review',`<form data-member-form="submission" class="member-form"><input type="hidden" name="clubId" value="${clubId}"><label>Update type<select name="kind" data-submission-kind><option value="ROSTER_CHANGE">Roster change</option><option value="MATCH_STATS">Match statistics</option></select></label><label>Related fixture<select name="fixtureId"><option value="">No fixture (roster changes only)</option>${matches.map(f=>option(f.id,matchName(f)+' · '+date(f.startsAt))).join('')}</select></label><label>Details<textarea name="details" required maxlength="3000" rows="4" placeholder="Include player names, the requested changes and supporting match details."></textarea></label><button>Submit for admin review</button></form>`,'Official statistics stay unchanged until the admin checks and applies your proposed update.')+
      `<details class="member-panel"><summary>Request another coaching assignment</summary>${requestForm('COACH')}</details>`;
  }
  function fanView() {
    const followedIds=new Set([...data.followedClubs.map(c=>c.id),...data.followedPlayers.map(p=>p.clubId)]);
    const matches=followedIds.size?data.fixtures.filter(f=>followedIds.has(f.homeClubId)||followedIds.has(f.awayClubId)):data.fixtures;
    return '<a class="button" href="following.html">View all Following</a>'+panel('Your favourites',`<form data-member-form="favorite" class="member-form"><label>Follow a<select name="kind" data-favorite-kind><option value="CLUB">Club</option><option value="PLAYER">Player</option></select></label><label>Choose<select name="targetId" required>${data.directory.clubs.map(c=>option(c.id,c.name+' · '+c.sport)).join('')}</select></label><button>Follow</button></form>${data.favorites.length?`<ul class="member-list">${data.favorites.map(f=>`<li><strong>${esc(f.kind==='PLAYER'?playerName(f.targetId):teamName(f.targetId))}</strong><div>${f.kind==='PLAYER'?`<button type="button" data-player-profile="${f.targetId}">View player</button>`:`<a href="club.html?id=${f.targetId}">View club</a>`}<button type="button" class="experience-signout" data-unfollow="${f.kind}:${f.targetId}">Unfollow</button></div></li>`).join('')}</ul>`:empty('Follow clubs and players to personalise your match feed. Favourites are saved to your account.')}`)+
      `<div class="member-columns">${panel('Upcoming matches',fixtureList(upcoming(matches)))}${panel('Latest results',fixtureList(matches.filter(f=>f.result)))}</div>`+
      panel('Campus stories',data.news.length?data.news.map(n=>`<article class="member-notice"><h3>${esc(n.title)}</h3><p>${esc(n.excerpt||n.content.slice(0,240))}</p><a href="news.html">Read campus news</a></article>`).join(''):empty('No published news yet.'))+
      panel('Explore the competition','<div class="experience-links"><a class="button" href="aupltables.html">League tables</a><a class="button" href="players.html">Meet the players</a><a class="button" href="aupl fantasy.html">Fantasy sports</a></div>');
  }
  function render() {
    root.innerHTML=`<header class="member-header"><div><p class="eyebrow">My Sports Hub</p><h1>Welcome, ${esc(data.user.name||'sports fan')}.</h1><p>One account. Your sport, your teams, your community.</p></div><button type="button" class="experience-signout" data-member-logout>Sign out</button></header><nav class="member-tabs" aria-label="Dashboard view">${['PLAYER','COACH','FAN'].map(type=>`<button type="button" data-member-view="${type}" aria-pressed="${data.user.accountType===type}">${label(type)}${type==='PLAYER'&&data.playerLinks.length?' · '+data.playerLinks.length:type==='COACH'&&data.coachLinks.length?' · '+data.coachLinks.length:''}</button>`).join('')}</nav><p id="memberMessage" role="status" aria-live="polite">${esc(message)}</p>${data.user.accountType==='PLAYER'?playerView():data.user.accountType==='COACH'?coachView():fanView()}${panel('My access requests',requests())}${panel('My submissions & admin responses',submissions())}<button type="button" class="experience-signout" data-member-refresh>Refresh dashboard</button>`;
  }
  async function api(url, method='GET', body) {
    const r=await fetch(url,{method,headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined});
    if(r.status===401){location.assign('login.html');throw new Error('Please sign in again.');}
    const result=await r.json().catch(()=>({}));if(!r.ok)throw new Error(result.error||'Unable to save.');return result;
  }
  async function load(){try{data=await api('/api/member/dashboard');if(data.user.role==='ADMIN'){location.replace('admin.html');return;}render();}catch(e){root.textContent=e.message;const b=document.createElement('button');b.textContent='Try again';b.onclick=load;root.append(b);}}
  function report(text){message=text;const el=document.getElementById('memberMessage');if(el){el.textContent=text;el.scrollIntoView({block:'center'});}}
  function filterLinkTargets(form){
    const kind=form.elements.kind.value,sport=form.querySelector('[data-link-sport]').value,club=form.querySelector('[data-link-club]')?.value,search=form.querySelector('[data-link-search]').value.toLowerCase();
    const rows=(kind==='PLAYER'?data.directory.players:data.directory.clubs).filter(row=>(!sport||row.sport===sport)&&(!club||String(row.clubId)===club)&&row.name.toLowerCase().includes(search));
    const select=form.elements.targetId,previous=select.value;
    select.innerHTML='<option value="">'+(rows.length?'Choose a '+(kind==='PLAYER'?'player':'team'):'No matching records')+'</option>'+rows.map(row=>option(row.id,row.name+' · '+row.sport+(kind==='PLAYER'&&row.clubId?' · '+teamName(row.clubId):''))).join('');
    if(rows.some(row=>String(row.id)===previous))select.value=previous;
  }
  root.addEventListener('change',e=>{
    if(e.target.dataset.memberSelect){if(e.target.dataset.memberSelect==='player')playerId=Number(e.target.value);else clubId=Number(e.target.value);render();}
    if(e.target.matches('[data-favorite-kind]')){const list=e.target.value==='PLAYER'?data.directory.players:data.directory.clubs;e.target.form.elements.targetId.innerHTML=list.map(row=>option(row.id,row.name+' · '+row.sport)).join('');}
    if(e.target.matches('[data-link-sport],[data-link-club]'))filterLinkTargets(e.target.form);
  });
  root.addEventListener('input',e=>{if(e.target.matches('[data-link-search]'))filterLinkTargets(e.target.form);});
  root.addEventListener('click',async e=>{
    const view=e.target.closest('[data-member-view]'),unfollow=e.target.closest('[data-unfollow]'),logout=e.target.closest('[data-member-logout]');
    try{if(view){await api('/api/member/view','PUT',{accountType:view.dataset.memberView});message='';await load();}if(unfollow){const [kind,id]=unfollow.dataset.unfollow.split(':');await api('/api/member/favorites','PUT',{kind,targetId:Number(id),following:false});message='Favourite removed.';window.dispatchEvent(new Event('following-changed'));await load();}if(logout){await api('/api/auth/logout','POST');location.assign('login.html');}if(e.target.closest('[data-member-refresh]'))await load();}catch(error){report(error.message);}
  });
  root.addEventListener('submit',async e=>{
    const form=e.target.closest('[data-member-form]');if(!form)return;e.preventDefault();
    const button=form.querySelector('button');button.disabled=true;
    const body=Object.fromEntries(new FormData(form));for(const k of ['targetId','playerId','clubId','fixtureId'])if(k in body){if(body[k]==='')delete body[k];else body[k]=Number(body[k]);}
    const kind=form.dataset.memberForm;
    try{
      if(kind==='request')await api('/api/member/requests','POST',body);
      if(kind==='bio'){await api('/api/member/players/'+body.playerId+'/bio','PATCH',{bio:body.bio});}
      if(kind==='availability')await api('/api/member/availability','PUT',body);
      if(kind==='lineup'){body.playerIds=new FormData(form).getAll('playerIds').map(Number);if(!body.playerIds.length)throw new Error('Select at least one player for the proposed squad.');await api('/api/member/lineups','PUT',body);}
      if(kind==='announcement')await api('/api/member/announcements','POST',body);
      if(kind==='submission')await api('/api/member/submissions','POST',body);
      if(kind==='favorite'){await api('/api/member/favorites','PUT',{...body,following:true});window.dispatchEvent(new Event('following-changed'));}
      message=kind==='request'?'Request sent. Access unlocks after admin approval.':kind==='submission'?'Submitted for admin review. Official records have not been changed.':'Saved successfully.';await load();report(message);
    }catch(error){report(error.message);}finally{button.disabled=false;}
  });
  load();
})();
