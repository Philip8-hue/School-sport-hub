(() => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let players;
  let loading;
  let selected;
  let trigger;
  let version = 0;
  const dialog = document.createElement('dialog');
  dialog.className = 'player-profile-dialog';
  dialog.setAttribute('aria-labelledby', 'playerProfileTitle');
  document.body.append(dialog);
  async function records() {
    if (players) return players;
    if (!loading) loading = fetch('/api/players').then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(rows => { players = rows; return rows; }).finally(() => { loading = null; });
    return loading;
  }
  function shell(content) {
    dialog.innerHTML = '<button type="button" class="profile-close" aria-label="Close player profile" autofocus><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2"/></svg></button>' + content;
    dialog.querySelector('.profile-close').onclick = () => dialog.close();
    if (dialog.open) dialog.querySelector('.profile-close').focus({ preventScroll: true });
  }
  async function open(id, source) {
    const requestVersion = ++version; selected = String(id); trigger = source || trigger;
    shell('<h2 id="playerProfileTitle">Player profile</h2><p role="status">Loading player statistics…</p>');
    if (!dialog.open) { dialog.showModal(); document.documentElement.classList.add('profile-open'); }
    try {
      const player = (await records()).find(p => String(p.id) === selected);
      if (requestVersion !== version || !dialog.open) return;
      if (!player) { shell('<h2 id="playerProfileTitle">Player unavailable</h2><p>This player may have been removed. Browse the player directory for the latest squad.</p>'); return; }
      let fields = window.playerStatFields(player.sport);
      if (/football/i.test(player.sport) && !/goalkeeper|keeper|\bgk\b/i.test(player.position || '')) fields = fields.filter(([key]) => !['saves', 'cleanSheets'].includes(key));
      shell(`<div class="profile-identity"><div class="profile-photo" role="img" aria-label="Player photo not added yet"></div><div><p class="eyebrow">${escape(player.sport)}</p><h2 id="playerProfileTitle">${escape(player.fullName || player.name)}</h2><p>${escape(player.club?.name || 'Club not assigned')}</p>${player.captain ? '<span class="captain-badge">Captain</span>' : ''}<dl class="profile-details"><div><dt>Position</dt><dd>${escape(player.position || '—')}</dd></div><div><dt>Jersey number</dt><dd>${player.jerseyNumber == null ? '—' : escape(player.jerseyNumber)}</dd></div><div><dt>Rating</dt><dd>${escape(player.rating ?? '—')}</dd></div></dl></div></div><h3>Performance</h3><dl class="profile-stat-grid">${fields.map(([key, label]) => `<div><dt>${escape(label)}</dt><dd>${escape(player[key] ?? 0)}</dd></div>`).join('')}</dl><div class="profile-actions" data-follow-kind="PLAYER" data-follow-id="${player.id}">${player.clubId ? `<a class="button" href="club.html?id=${encodeURIComponent(player.clubId)}">View club</a>` : ''}<a href="players.html">Explore all players</a></div>`);
    } catch {
      if (requestVersion !== version || !dialog.open) return;
      shell('<h2 id="playerProfileTitle">Player profile</h2><p role="status">Statistics could not load. Please try again.</p><button type="button" data-retry-profile>Try again</button>');
      dialog.querySelector('[data-retry-profile]').onclick = () => open(selected);
    }
  }
  document.addEventListener('click', event => { const button = event.target.closest('[data-player-profile]'); if (button) { event.preventDefault(); open(button.dataset.playerProfile, button); } });
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); });
  dialog.addEventListener('close', () => { version++; document.documentElement.classList.remove('profile-open'); if (trigger?.isConnected) trigger.focus(); });
})();
