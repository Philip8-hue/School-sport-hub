(() => {
  const grid = document.getElementById('clubDirectory');
  const search = document.getElementById('clubSearch');
  const summary = document.getElementById('clubDirectorySummary');
  const sport = document.body.dataset.sport || '';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let clubs = [], players = null;
  const initials = name => name.split(/\s+/).map(word => word[0]).join('').slice(0, 2).toUpperCase();
  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = clubs.filter(club => !query || `${club.name} ${club.sport}`.toLowerCase().includes(query));
    summary.textContent = `${visible.length} ${visible.length === 1 ? 'club' : 'clubs'}${sport ? ' in ' + sport : ' across campus'}${query ? ' matching your search' : ''}`;
    grid.innerHTML = visible.length ? visible.map(club => `<article class="directory-club-card"><div class="club-card-identity"><span class="club-monogram" aria-hidden="true">${escape(initials(club.name))}</span><div><h3>${escape(club.name)}</h3><p>${escape(club.sport)}</p></div></div><div class="directory-club-meta"><span>Anchor University</span><span>${players ? `${players.filter(player => player.clubId === club.id).length} players` : 'Club directory'}</span></div>${players?.find(player => player.clubId === club.id && player.captain) ? `<p class="club-captain">Captain · ${escape((players.find(player => player.clubId === club.id && player.captain)).fullName || (players.find(player => player.clubId === club.id && player.captain)).name)}</p>` : ''}<a href="club.html?id=${club.id}" aria-label="View ${escape(club.name)} ${escape(club.sport)} club">View club & squad ↗</a></article>`).join('') : '<p class="homepage-data-empty">'+(query ? 'No clubs match your search. Try another name.' : 'No clubs have been added to this competition yet.')+'</p>';
    for (const club of visible) {
      if (!club.logoUrl || !/^(https?:\/\/|\/?images\/)/i.test(club.logoUrl)) continue;
      const badge = grid.querySelector(`a[href="club.html?id=${club.id}"]`).closest('article').querySelector('.club-monogram');
      const image = document.createElement('img'); image.alt = ''; image.loading = 'lazy'; image.addEventListener('error', () => { badge.textContent = initials(club.name); }, {once:true}); image.src = club.logoUrl; badge.replaceChildren(image);
    }
  }
  async function load() {
    grid.setAttribute('aria-busy', 'true'); summary.textContent = 'Loading clubs…';
    try {
      const response = await fetch('/api/clubs' + (sport ? '?sport=' + encodeURIComponent(sport) : ''));
      if (!response.ok) throw new Error();
      clubs = await response.json();
      try { const response = await fetch('/api/players' + (sport ? '?sport=' + encodeURIComponent(sport) : '')); if (response.ok) players = await response.json(); } catch { /* Club cards remain available without squad counts. */ }
      render();
    } catch { summary.textContent = 'Clubs unavailable'; grid.innerHTML = '<p class="homepage-data-empty directory-error">We couldn’t load the clubs. <button type="button" id="retryClubs">Try again</button></p>'; document.getElementById('retryClubs').addEventListener('click', load); }
    finally { grid.setAttribute('aria-busy', 'false'); }
  }
  search.addEventListener('input', render); load();
})();
