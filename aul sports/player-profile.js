(() => {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let players;
  window.addEventListener('player-photo-updated', () => { players = undefined; loading = undefined; });
  let loading;
  let selected;
  let trigger;
  let version = 0;
  const dialog = document.createElement('dialog');
  dialog.className = 'player-profile-dialog';
  dialog.setAttribute('aria-labelledby', 'playerProfileTitle');
  document.body.append(dialog);
  const photoDialog = document.createElement('dialog');
  photoDialog.className = 'player-photo-dialog';
  photoDialog.setAttribute('aria-labelledby', 'playerPhotoTitle');
  document.body.append(photoDialog);
  let photoTrigger;
  function openPhoto(image) {
    if (!image || !/^\/api\/player-photos\/\d+(?:\?v=\d+)?$|^https?:\/\//i.test(image.getAttribute('src') || '')) return;
    photoTrigger = image.closest('button') || image;
    photoDialog.innerHTML = `<div class="player-photo-heading"><h2 id="playerPhotoTitle">${escape(image.alt || 'Player photo')}</h2><button type="button" autofocus aria-label="Close full photo">Close <span aria-hidden="true">×</span></button></div><img src="${escape(image.getAttribute('src'))}" alt="${escape(image.alt || 'Player photo')}" class="player-photo-full"><p role="status"></p>`;
    photoDialog.querySelector('button').onclick = () => photoDialog.close();
    photoDialog.querySelector('img').onerror = () => { photoDialog.querySelector('[role=status]').textContent = 'This photo could not load. Close and try again.'; };
    photoDialog.showModal(); document.documentElement.classList.add('profile-open');
  }
  photoDialog.addEventListener('click', event => { if (event.target !== photoDialog) return; const rect = photoDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) photoDialog.close(); });
  photoDialog.addEventListener('close', () => { photoDialog.replaceChildren(); if (!dialog.open) document.documentElement.classList.remove('profile-open'); if (photoTrigger?.isConnected) photoTrigger.focus({ preventScroll: true }); });
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
      shell(`<div class="profile-identity"><div class="profile-photo">${/^\/api\/player-photos\/\d+(?:\?v=\d+)?$|^https?:\/\//i.test(player.photoUrl || '') ? `<button type="button" class="profile-photo-trigger" data-photo-view aria-label="View full photo of ${escape(player.name)}"><img src="${escape(player.photoUrl)}" alt="${escape(player.name)} profile photo"></button>` : '<span role="img" aria-label="Player photo not added yet"></span>'}</div><div><p class="eyebrow">${escape(player.sport)}</p><h2 id="playerProfileTitle">${escape(player.fullName || player.name)}</h2><p>${escape(player.club?.name || 'Club not assigned')}</p>${player.captain ? '<span class="captain-badge">Captain</span>' : ''}<dl class="profile-details"><div><dt>Position</dt><dd>${escape(player.position || '—')}</dd></div><div><dt>Jersey number</dt><dd>${player.jerseyNumber == null ? '—' : escape(player.jerseyNumber)}</dd></div><div><dt>Rating</dt><dd>${escape(player.rating ?? '—')}</dd></div></dl></div></div><h3>Performance</h3><dl class="profile-stat-grid">${fields.map(([key, label]) => `<div><dt>${escape(label)}</dt><dd>${escape(player[key] ?? 0)}</dd></div>`).join('')}</dl><div class="profile-actions" data-follow-kind="PLAYER" data-follow-id="${player.id}">${player.clubId ? `<a class="button" href="club.html?id=${encodeURIComponent(player.clubId)}">View club</a>` : ''}<a href="players.html">Explore all players</a></div>`);
    } catch {
      if (requestVersion !== version || !dialog.open) return;
      shell('<h2 id="playerProfileTitle">Player profile</h2><p role="status">Statistics could not load. Please try again.</p><button type="button" data-retry-profile>Try again</button>');
      dialog.querySelector('[data-retry-profile]').onclick = () => open(selected);
    }
  }
  document.addEventListener('click', event => {
    const photo = event.target.closest('[data-photo-view],.player-preview-photo img');
    if (photo) { event.preventDefault(); event.stopPropagation(); openPhoto(photo.matches('img') ? photo : photo.querySelector('img')); return; }
    const button = event.target.closest('[data-player-profile]'); if (button) { event.preventDefault(); open(button.dataset.playerProfile, button); }
  });
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); });
  dialog.addEventListener('close', () => { version++; document.documentElement.classList.remove('profile-open'); if (trigger?.isConnected) trigger.focus(); });
})();
