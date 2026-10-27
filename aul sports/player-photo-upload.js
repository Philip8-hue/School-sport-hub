(() => {
  let previewUrl;
  const release = () => { if (previewUrl) URL.revokeObjectURL(previewUrl); previewUrl = null; };
  document.addEventListener('change', event => {
    const input = event.target.closest('[data-photo-file]'); if (!input) return;
    const form = input.form, file = input.files[0], status = form.querySelector('[role=status]'), preview = form.querySelector('[data-photo-preview]');
    release(); preview.hidden = true; status.textContent = '';
    if (!file) return;
    if (file.size > 3 * 1024 * 1024 || !['image/jpeg','image/png','image/webp'].includes(file.type)) { status.textContent = 'Choose a JPG, PNG or WebP photo up to 3 MB.'; input.value = ''; return; }
    previewUrl = URL.createObjectURL(file); preview.src = previewUrl; preview.hidden = false;
    status.textContent = 'Preview of your full photo. Thumbnails may crop it, but opening the photo shows the complete picture. Select Save photo to publish it.';
  });
  async function save(form, remove) {
    const status = form.querySelector('[role=status]'), buttons = [...form.querySelectorAll('button')];
    const file = form.querySelector('[data-photo-file]').files[0];
    if (!remove && !file) { status.textContent = 'Choose a photo first.'; return; }
    buttons.forEach(b => b.disabled = true); status.textContent = remove ? 'Removing photo…' : 'Saving photo…';
    try {
      const response = await fetch(`/api/player-photos/${form.dataset.photoPlayer}`, { method: remove ? 'DELETE' : 'PUT', headers: remove ? {} : { 'Content-Type':'application/octet-stream' }, body: remove ? undefined : file });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Unable to update your photo.');
      release(); window.dispatchEvent(new CustomEvent('player-photo-updated', { detail: { message: remove ? 'Profile photo removed.' : 'Profile photo saved. It is now visible on your public player card.' } }));
    } catch (error) { status.textContent = error.message; } finally { buttons.forEach(b => b.disabled = false); }
  }
  document.addEventListener('submit', event => { const form = event.target.closest('[data-photo-player]'); if (form) { event.preventDefault(); save(form, false); } });
  document.addEventListener('click', event => { if (event.target.closest('[data-photo-remove]')) save(event.target.closest('form'), true); });
  window.addEventListener('pagehide', release);
})();
