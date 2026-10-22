// Reauthenticate in place so an expired session never discards an unsaved form.
window.adminSession = (() => {
  let pending;
  function signIn() {
    if (pending) return pending;
    pending = new Promise((resolve, reject) => {
      const dialog = document.createElement('dialog'); dialog.className = 'session-dialog';
      dialog.innerHTML = '<form class="stack-form"><h2>Continue your session</h2><p class="muted">Sign in to continue. Everything you entered stays in the form.</p><label>Email address<input name="email" type="email" autocomplete="username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><p class="form-message" role="alert"></p><button type="submit">Sign in and continue</button><button type="button" class="button-secondary" data-cancel>Keep editing without saving</button></form>';
      const form = dialog.querySelector('form');
      const close = (error) => { dialog.close(); dialog.remove(); pending = undefined; error ? reject(error) : resolve(); };
      dialog.addEventListener('cancel', event => { event.preventDefault(); close(new Error('Your changes are still in the form. Sign in when you are ready to save.')); });
      dialog.querySelector('[data-cancel]').addEventListener('click', () => close(new Error('Your changes are still in the form. Sign in when you are ready to save.')));
      form.addEventListener('submit', async event => {
        event.preventDefault(); const submit = form.querySelector('[type=submit]'); submit.disabled = true;
        try { const response = await fetch('/api/auth/admin-login', { method:'POST', credentials:'same-origin', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email:form.elements.email.value,password:form.elements.password.value}) }); const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Unable to sign in');
          if (data.user?.role !== 'ADMIN') throw new Error('This account does not have administrator access.');
          close();
        } catch (error) { form.querySelector('[role=alert]').textContent = error.message; } finally { submit.disabled = false; }
      });
      document.body.append(dialog); dialog.showModal();
    });
    return pending;
  }
  let lastActivity = Date.now();
  for (const type of ['pointerdown','keydown','input']) document.addEventListener(type, () => { lastActivity = Date.now(); }, {passive:true});
  setInterval(() => { if (!document.hidden && Date.now() - lastActivity < 5*60*1000) fetch('/api/auth/me', {credentials:'same-origin'}).catch(() => {}); }, 4*60*1000);
  return { signIn };
})();
