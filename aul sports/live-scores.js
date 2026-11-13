(() => {
  const list = document.getElementById('matchScores');
  const filter = document.getElementById('matchSport');
  const status = document.getElementById('matchStatus');
  const alert = document.getElementById('matchAlert');
  const refreshButton = document.getElementById('matchRefresh');
  let matches = [], previous = new Map(), timer, loading = false, initialized = false;
  let followed = new Set();
  try { followed = new Set(JSON.parse(localStorage.getItem('sports-live-followed') || '[]')); } catch {}
  let publicKey, worker, busy = false;
  const pushCapable = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  if (pushCapable) fetch('/api/match-push/config', {cache:'no-store'})
    .then(response => response.ok ? response.json() : null)
    .then(async config => {
      if (!config?.publicKey) return;
      publicKey = config.publicKey;
      worker = await navigator.serviceWorker.register('/match-alerts-sw.js');
      worker = await navigator.serviceWorker.ready;
      render();
    }).catch(() => {});
  function keyBytes(key) {
    return Uint8Array.from(atob(key.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(key.length/4)*4,'=')), c => c.charCodeAt(0));
  }
  async function savePush(id, enabled) {
    if (!worker) return false;
    if (enabled && await Notification.requestPermission() !== 'granted') return false;
    let subscription = await worker.pushManager.getSubscription();
    if (!subscription && enabled) subscription = await worker.pushManager.subscribe({userVisibleOnly:true, applicationServerKey:keyBytes(publicKey)});
    if (!subscription) return false;
    const { endpoint, keys } = subscription.toJSON();
    const response = await fetch('/api/fixtures/'+id+'/push', {
      method: enabled ? 'PUT' : 'DELETE', headers:{'Content-Type':'application/json'}, body:JSON.stringify({endpoint,...keys}),
      signal:AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error('Could not update phone alerts. Please try again.');
    return true;
  }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const home = match => match.homeClub?.name || 'Home';
  const away = match => match.awayClub?.name || 'Away';
  const score = match => match.result ? match.result.homeScore + ' – ' + match.result.awayScore : '—';
  const stage = match => match.status === 'COMPLETED' ? (/football/i.test(match.sport) ? 'Full-time' : 'Final') : match.result?.stage || 'Live';
  function render() {
    const rows = matches.filter(match => !filter.value || match.sport === filter.value);
    const focussed = list.contains(document.activeElement) ? document.activeElement.dataset.follow : null;
    list.innerHTML = rows.map(match => {
      const live = match.status === 'LIVE', active = followed.has(match.id);
      return '<article class="match-card"><div class="match-meta"><span>' + esc(match.sport) + '</span><span class="match-phase" data-live="' + live + '">' + esc(stage(match)) + '</span></div>'
        + '<div class="match-scoreline"><strong>' + esc(home(match)) + '</strong><b aria-label="Score ' + score(match) + '">' + score(match) + (/volleyball/i.test(match.sport) && match.result ? '<small>Sets won</small>' : '') + '</b><strong>' + esc(away(match)) + '</strong></div>'
        + window.renderMatchGoals(match.result, match)
        + '<div class="match-meta"><span>' + esc(match.venue || '') + '</span>' + (live ? '<button type="button" data-follow="' + match.id + '" aria-pressed="' + active + '" aria-label="Follow ' + esc(home(match)) + ' versus ' + esc(away(match)) + '">' + (active ? 'Unfollow match' : 'Follow match') + '</button>' : '') + '</div></article>';
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
        if (old && followed.has(match.id) && (score(old) !== score(match) || stage(old) !== stage(match))) {
          updates.push(match.sport + ' · ' + stage(match) + ': ' + home(match) + ' ' + score(match) + ' ' + away(match));
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
  list.addEventListener('click', async event => {
    const button = event.target.closest('[data-follow]');
    if (!button || busy) return;
    const id = Number(button.dataset.follow);
    const enabled = !followed.has(id);
    busy = true; button.disabled = true;
    try {
      const phone = await savePush(id, enabled);
      if (enabled) followed.add(id); else followed.delete(id);
      alert.textContent = enabled ? (phone ? 'Phone alerts are on for this match.' : 'Following here only. To get phone alerts, enable notifications and follow again.') : 'Match unfollowed.';
      try { localStorage.setItem('sports-live-followed', JSON.stringify([...followed])); } catch {}
    } catch (error) { alert.textContent = error.message || 'Could not update phone alerts.'; }
    finally { busy = false; button.disabled = false; render(); }
  });
  refreshButton.addEventListener('click', refresh);
  filter.addEventListener('change', render);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else refresh(); });
  refresh();
})();
