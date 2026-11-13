(() => {
  const list = document.getElementById('matchScores');
  const filter = document.getElementById('matchSport');
  const status = document.getElementById('matchStatus');
  const alert = document.getElementById('matchAlert');
  const refreshButton = document.getElementById('matchRefresh');
  let matches = [], previous = new Map(), timer, loading = false, initialized = false;
  let followed = new Set();
  try { followed = new Set(JSON.parse(localStorage.getItem('sports-live-followed') || '[]')); } catch {}
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const home = match => match.homeClub?.name || 'Home';
  const away = match => match.awayClub?.name || 'Away';
  const score = match => match.result ? match.result.homeScore + ' – ' + match.result.awayScore : '—';
  function render() {
    const rows = matches.filter(match => !filter.value || match.sport === filter.value);
    const focussed = list.contains(document.activeElement) ? document.activeElement.dataset.follow : null;
    list.innerHTML = rows.map(match => {
      const live = match.status === 'LIVE', active = followed.has(match.id);
      return '<article class="match-card"><div class="match-meta"><span>' + esc(match.sport) + '</span><span class="match-phase" data-live="' + live + '">' + (live ? 'Live' : 'Final') + '</span></div>'
        + '<div class="match-scoreline"><strong>' + esc(home(match)) + '</strong><b aria-label="Score ' + score(match) + '">' + score(match) + '</b><strong>' + esc(away(match)) + '</strong></div>'
        + '<div class="match-meta"><span>' + esc(match.venue || '') + '</span>' + (live ? '<button type="button" data-follow="' + match.id + '" aria-pressed="' + active + '" aria-label="Follow ' + esc(home(match)) + ' versus ' + esc(away(match)) + '">' + (active ? 'Following' : 'Follow match') + '</button>' : '') + '</div></article>';
    }).join('') || (initialized ? '<p>No live or recently finished matches in this view. <a href="aupl-fixtures.html">See upcoming fixtures</a></p>' : '');
    if (focussed) list.querySelector('[data-follow="' + Number(focussed) + '"]')?.focus({preventScroll:true});
  }
  function schedule() {
    clearTimeout(timer);
    if (!document.hidden) timer = setTimeout(refresh, matches.some(match => match.status === 'LIVE') ? 10000 : 30000);
  }
  async function refresh() {
    if (loading) return;
    loading = true; refreshButton.disabled = true; clearTimeout(timer);
    try {
      const response = await fetch('/api/live-scores', {signal: AbortSignal.timeout(8000)});
      if (!response.ok) throw new Error();
      const next = await response.json();
      const updates = [];
      for (const match of next) {
        const old = previous.get(match.id);
        if (old && followed.has(match.id) && (score(old) !== score(match) || old.status !== match.status)) {
          updates.push((match.status === 'COMPLETED' ? 'Final: ' : 'Score update: ') + home(match) + ' ' + score(match) + ' ' + away(match));
        }
      }
      if (updates.length) alert.textContent = updates.join(' · ');
      const changed = !initialized || JSON.stringify(next) !== JSON.stringify(matches);
      matches = next; previous = new Map(next.map(match => [match.id, match])); initialized = true;
      status.textContent = matches.some(match => match.status === 'LIVE') ? 'Scores refresh about every 10 seconds.' : 'Checking for live matches every 30 seconds.';
      if (changed) render();
    } catch { status.textContent = 'Could not refresh scores. Select Refresh scores to try again.'; }
    finally { loading = false; refreshButton.disabled = false; schedule(); }
  }
  list.addEventListener('click', event => {
    const button = event.target.closest('[data-follow]');
    if (!button) return;
    const id = Number(button.dataset.follow);
    if (followed.has(id)) { followed.delete(id); alert.textContent = 'Match unfollowed.'; }
    else { followed.add(id); alert.textContent = 'Following this match. Score updates will appear here.'; }
    try { localStorage.setItem('sports-live-followed', JSON.stringify([...followed])); } catch {}
    render();
  });
  refreshButton.addEventListener('click', refresh);
  filter.addEventListener('change', render);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else refresh(); });
  refresh();
})();
