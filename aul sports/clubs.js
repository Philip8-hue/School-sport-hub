(() => {
 const target=document.getElementById('clubProfile');if(!target)return;
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const sports={'male-football':'Male Football','female-football':'Female Football','male-basketball':'Male Basketball','female-basketball':'Female Basketball'};
 const normalize=value=>value.trim().toLowerCase().replace(/\s+fc$/,'').replace(/^spartans$/,'spartan');
 const date=value=>new Date(value).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});
 const get=async url=>{const response=await fetch(url);if(!response.ok)throw new Error();return response.json();};
 const empty=text=>`<p class="homepage-data-empty">${text}</p>`;
 async function load(){target.setAttribute('aria-busy','true');try{
  const clubs=await get('/api/clubs');const id=new URLSearchParams(location.search).get('id');
  const club=id?clubs.find(c=>String(c.id)===id):clubs.find(c=>normalize(c.name)===normalize(document.body.dataset.club||'')&&c.sport===sports[document.body.dataset.type]);
  if(!club){target.innerHTML=empty('This club is no longer available. <a href="aupl clubs.html">Browse the club directory →</a>');return;}
  document.title=`${club.name} · ${club.sport} | Sports Hub`;
  const results=await Promise.allSettled([get('/api/players?clubId='+club.id),get('/api/fixtures?sport='+encodeURIComponent(club.sport)),get('/api/tables?sport='+encodeURIComponent(club.sport))]);
  const [players,fixtures,tables]=results.map(result=>result.status==='fulfilled'?result.value:null);
  const matches=fixtures?.filter(f=>f.homeClubId===club.id||f.awayClubId===club.id);
  const upcoming=matches?.filter(f=>f.status==='SCHEDULED'||f.status==='LIVE').slice(0,5);
  const completed=matches?.filter(f=>f.result).sort((a,b)=>new Date(b.startsAt)-new Date(a.startsAt)).slice(0,5);
  const standing=tables?.find(row=>row.clubId===club.id);
  const matchCard=f=>`<article><p>${escape(f.sport)} · ${escape(f.status)}</p><h3>${escape(f.homeClub?.name||'TBC')} ${f.result?`${f.result.homeScore} – ${f.result.awayScore}`:'vs'} ${escape(f.awayClub?.name||'TBC')}</h3><p>${date(f.startsAt)} · ${escape(f.venue||'Venue TBC')}</p></article>`;
  const list=(rows,render,none)=>rows==null?empty('This section is temporarily unavailable. Please refresh to try again.'):rows.length?rows.map(render).join(''):empty(none);
  target.innerHTML=`<section class="club-profile-banner"><span class="club-monogram" aria-hidden="true">${escape(club.name.split(/\s+/).map(w=>w[0]).join('').slice(0,2))}</span><div><p>${escape(club.sport)} · Anchor University</p><h1>${escape(club.name)}</h1><p>${players?`${players.length} registered players`:'Club profile'}</p></div></section><div class="club-profile-stats" aria-label="League record">${[['Matches','played'],['Wins','won'],['Draws','drawn'],['Losses','lost'],['Points','points']].map(([label,key])=>`<div><span>${label}</span><strong>${standing?standing[key]:'—'}</strong></div>`).join('')}</div>${!standing?'<p class="muted">No league record has been published for this club yet.</p>':''}<div class="club-profile-content"><section aria-labelledby="squadTitle"><h2 id="squadTitle">The squad</h2><div class="club-roster">${list(players,p=>`<article><div><h3>${escape(p.fullName||p.name)}${p.captain?' <span class="captain-badge">Captain</span>':''}</h3><p>${escape(p.position||'Position to be confirmed')}</p></div><span class="squad-number" aria-label="Jersey number ${p.jerseyNumber??'unassigned'}">${p.jerseyNumber!=null?'#'+p.jerseyNumber:'—'}</span></article>`,'No players have been added to this squad yet.')}</div></section><div><section aria-labelledby="upcomingTitle"><h2 id="upcomingTitle">Next up</h2><div class="club-match-list">${list(upcoming,matchCard,'No upcoming fixtures for this club.')}</div></section><section aria-labelledby="recentTitle"><h2 id="recentTitle">Recent results</h2><div class="club-match-list">${list(completed,matchCard,'No results have been recorded for this club.')}</div></section></div></div>`;
  if(club.logoUrl&&/^(https?:\/\/|\/?images\/)/i.test(club.logoUrl)){const badge=target.querySelector('.club-monogram');const fallback=badge.textContent;const image=document.createElement('img');image.alt='';image.addEventListener('error',()=>{badge.textContent=fallback;},{once:true});image.src=club.logoUrl;badge.replaceChildren(image);}
 }catch{target.innerHTML=empty('We couldn’t load this club. <button type="button" id="retryClubProfile">Try again</button>');document.getElementById('retryClubProfile').addEventListener('click',load);}finally{target.setAttribute('aria-busy','false');}}
 load();
})();
