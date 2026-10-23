(() => {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const date = value => value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString(undefined, { dateStyle:'medium', timeStyle:'short' }) : 'Date unavailable';
  const school = document.getElementById('schoolCoverage'), world = document.getElementById('internationalCoverage');
  const list = document.getElementById('worldNewsList'), status = document.getElementById('worldNewsStatus'), retry = document.getElementById('worldNewsRetry');
  const older = document.getElementById('worldNewsOlder');
  let sport = 'football', version = 0, fixtures = [], nextCursor = null;
  async function loadWorld(append = false) {
    const current = ++version;
    status.textContent = append ? 'Loading older headlines…' : 'Loading international news…';
    if (!append) { list.replaceChildren(); nextCursor = null; }
    retry.hidden = true; older.hidden = true;
    try {
      const response = await fetch(`/api/news/international?sport=${sport}${append && nextCursor ? `&before=${nextCursor}` : ''}`); const data = await response.json();
      if (current !== version) return;
      if (!response.ok) throw new Error('Unavailable');
      if (data.status !== 'ready') { status.textContent = data.message; return; }
      status.textContent = `${data.stale ? 'Showing saved coverage; fresh headlines may be temporarily unavailable. ' : ''}${data.notice}${data.updatedAt ? ` Last checked: ${date(data.updatedAt)}.` : ''}`;
      const safeArticles = data.articles.filter(a => { try { const u = new URL(a.url); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; } });
      list.insertAdjacentHTML('beforeend', safeArticles.map(a => `<article class="news-card"><p class="news-source">${esc(a.source)}</p><h3>${esc(a.title)}</h3><p><time>${esc(date(a.publishedAt))}</time></p><a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">Read at ${esc(a.source)} ↗</a></article>`).join(''));
      nextCursor = data.nextCursor; older.hidden = !nextCursor;
      if (!safeArticles.length && !append) list.textContent = 'No articles available for this sport yet. Try another sport or check back later.';
    } catch { if (current !== version) return; status.textContent = 'International news is temporarily unavailable. School news is still available.'; if (append) { older.hidden = false; older.textContent = 'Retry older news'; } else retry.hidden = false; }
  }
  document.querySelectorAll('[data-coverage]').forEach(button => button.addEventListener('click', () => {
    const international = button.dataset.coverage === 'international'; school.hidden = international; world.hidden = !international;
    document.querySelectorAll('[data-coverage]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    if (international) loadWorld();
  }));
  document.querySelectorAll('[data-news-sport]').forEach(button => button.addEventListener('click', () => {
    sport = button.dataset.newsSport;
    document.querySelectorAll('[data-news-sport]').forEach(b => b.setAttribute('aria-pressed', String(b === button))); loadWorld();
  }));
  retry.addEventListener('click', () => loadWorld());
  older.addEventListener('click', () => { older.textContent = 'Load older news'; loadWorld(true); });
  const filter = document.getElementById('schoolNewsSport'), matches = document.getElementById('schoolNewsMatches');
  function renderMatches() {
    const rows = fixtures.filter(f => f.sport.toLowerCase().includes(filter.value)).sort((a,b) => {
      const rank = f => f.status === 'LIVE' ? 0 : f.status === 'SCHEDULED' ? 1 : 2;
      return rank(a)-rank(b) || (a.status === 'COMPLETED' ? Date.parse(b.startsAt)-Date.parse(a.startsAt) : Date.parse(a.startsAt)-Date.parse(b.startsAt));
    }).slice(0,6);
    matches.innerHTML = rows.map(f => `<article><small>${esc(f.sport)} · ${esc(f.status)}</small><h4>${esc(f.homeClub?.name || 'To be confirmed')} vs ${esc(f.awayClub?.name || 'To be confirmed')}</h4>${f.result ? `<strong>${esc(f.result.homeScore)} – ${esc(f.result.awayScore)}</strong>` : ''}<p>${esc(date(f.startsAt))}</p><small>${esc(f.venue || 'Venue to be confirmed')}</small></article>`).join('');
    if (!rows.length) matches.textContent = 'No school matches listed for this sport yet.';
  }
  filter.addEventListener('change', renderMatches); matches.textContent = 'Loading school matches…';
  fetch('/api/fixtures').then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(data => { fixtures = data; renderMatches(); }).catch(() => { matches.textContent = 'Unable to load school matches. Please refresh to try again.'; });
})();
