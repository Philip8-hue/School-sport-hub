(() => {
  const registration = !!document.getElementById('registerForm');
  const form = document.getElementById(registration ? 'registerForm' : 'loginForm');
  if (!form) return;
  const prefix = registration ? 'register' : 'login';
  const descriptions = {
    player: 'Your player view: explore player statistics, clubs and upcoming fixtures.',
    coach: 'Your coach view: follow squads and performance. Team editing requires separate approval.',
    fan: 'Your fan view: discover players and catch the latest stories and results.'
  };
  let selected = 'fan';
  const hidden = document.getElementById(registration ? 'registerAccountType' : 'accountType');
  const label = document.getElementById(registration ? 'registerSelectedAccount' : 'selectedAccount');
  const buttons = [...document.querySelectorAll('.account-type')];
  const group = document.querySelector('.account-types');
  group.setAttribute('role', 'group'); group.setAttribute('aria-label', 'Choose your Sports Hub experience');
  label.setAttribute('aria-live', 'polite');
  function select(type) {
    selected = descriptions[type] ? type : 'fan'; hidden.value = selected;
    buttons.forEach(button => { const active = button.dataset.type === selected; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    label.textContent = descriptions[selected];
    const other = document.querySelector(registration ? '.register-footer a' : '.login-footer a');
    if (other) other.href = (registration ? 'login.html' : 'register.html') + '?type=' + selected;
  }
  buttons.forEach(button => button.addEventListener('click', () => select(button.dataset.type)));
  select(new URLSearchParams(location.search).get('type') || 'fan');
  let message = document.getElementById(registration ? 'registerMessage' : 'loginMessage');
  if (!message) { message = document.createElement('p'); message.id = 'loginMessage'; form.append(message); }
  message.setAttribute('role', 'status'); message.setAttribute('aria-live', 'polite');
  const password = document.getElementById(prefix + 'Password');
  password.autocomplete = registration ? 'new-password' : 'current-password';
  if (registration) { password.minLength = 12; password.maxLength = 128; message.textContent = 'Use at least 12 characters. All new accounts have regular user access.'; document.getElementById('confirmPassword').autocomplete = 'new-password'; }
  document.getElementById(prefix + 'Email').autocomplete = 'email';
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (registration && password.value !== document.getElementById('confirmPassword').value) { message.textContent = 'Passwords do not match.'; return; }
    const button = form.querySelector('[type=submit]'); button.disabled = true;
    message.textContent = registration ? 'Creating your account…' : 'Signing in…';
    try {
      const response = await fetch('/api/auth/' + (registration ? 'register' : 'login'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: document.getElementById(prefix + 'Email').value, password: password.value, accountType: selected.toUpperCase(), ...(registration ? { name: document.getElementById('registerName').value } : {}) }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Unable to sign in.');
      location.assign(data.user.role === 'ADMIN' ? 'admin.html' : 'account.html');
    } catch (error) { message.textContent = error instanceof TypeError ? 'Connection unavailable. Please try again.' : error.message; }
    finally { button.disabled = false; }
  });
})();
