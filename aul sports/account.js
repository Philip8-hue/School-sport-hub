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
  const passwordToggle = form.querySelector('#loginPasswordToggle');
  if (passwordToggle) {
    passwordToggle.hidden = false;
    passwordToggle.addEventListener('click', () => {
      const visible = password.type === 'password';
      password.type = visible ? 'text' : 'password';
      passwordToggle.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    });
  }
  if (registration) { password.minLength = 12; password.maxLength = 128; message.textContent = 'Use at least 12 characters. All new accounts have regular user access.'; document.getElementById('confirmPassword').autocomplete = 'new-password'; }
  document.getElementById(prefix + 'Email').autocomplete = 'email';
  function verificationLink(text) {
    const link = document.createElement('a');
    link.href = 'verify-email.html'; link.textContent = 'Request a new verification link';
    message.replaceChildren(text + ' ', link);
  }
  if (registration) {
    fetch('/api/auth/registration-policy').then(r => r.ok ? r.json() : null).then(policy => {
      if (policy?.schoolEmailRequired) {
        document.getElementById('registerEmail').placeholder = 'Enter your Anchor student email';
        if (message.textContent.startsWith('Use at least')) message.textContent = 'Use your Anchor student email and a password of at least 12 characters. Player accounts stay in the player view.';
      }
    }).catch(() => {});
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (registration && password.value !== document.getElementById('confirmPassword').value) { message.textContent = 'Passwords do not match.'; return; }
    const button = form.querySelector('[type=submit]'); button.disabled = true;
    message.textContent = registration ? 'Creating your account…' : 'Signing in…';
    try {
      const response = await fetch('/api/auth/' + (registration ? 'register' : 'login'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: document.getElementById(prefix + 'Email').value, password: password.value, accountType: selected.toUpperCase(), ...(registration ? { name: document.getElementById('registerName').value } : {}) }) });
      let data = await response.json();
      if (['SCHOOL_EMAIL_UNVERIFIED', 'EMAIL_SIGN_IN_UNVERIFIED'].includes(data.code)) { verificationLink(data.error); return; }
      if (data.code === 'SCHOOL_EMAIL_REQUIRED' && !registration) { const link = document.createElement('a'); link.href = 'verify-email.html?correct=1'; link.textContent = 'Correct my email'; message.replaceChildren(data.error + ' ',link); return; }
      if (!response.ok) throw new Error(data.error || 'Unable to sign in.');
      if (data.signInVerificationRequired || data.schoolVerificationRequired) {
        verificationLink(data.emailSent ? 'Check your email for a verification link before signing in.' : 'Account created, but the verification email could not be sent.');
        return;
      }
      data=await window.authSecurity.finishLogin(data);
      location.assign(data.mfaSetupRequired||(registration&&data.verificationRequired) ? 'security.html' : data.user.role === 'EXECUTIVE' ? 'executive.html' : 'account.html');
    } catch (error) { message.textContent = error instanceof TypeError ? 'Connection unavailable. Please try again.' : error.message; }
    finally { button.disabled = false; }
  });
})();
