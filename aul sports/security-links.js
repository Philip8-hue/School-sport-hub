(()=>{document.addEventListener('DOMContentLoaded',async()=>{
async function showEmailDeadline(){
 const main=document.querySelector('main');
 if(!main||!document.querySelector('#site-navigation, #loginForm, #registerForm'))return;
 try{
  const response=await fetch('/api/auth/registration-policy',{cache:'no-store'});
  if(!response.ok)return;
  const policy=await response.json();
  if(!policy.schoolEmailDeadline)return;
  const notice=document.createElement('aside');
  notice.className='security-notice';notice.setAttribute('aria-label','Account email notice');
  const heading=document.createElement('strong');heading.textContent='Verify your Sports Hub email';
  const copy=document.createElement('p');
  copy.textContent=policy.schoolEmailRequired
   ?'Email verification is required for everyone. Students must use a verified @student.aul.edu.ng address. Admins can keep their current email.'
   :'Email verification is required for everyone. Students: change to your @student.aul.edu.ng address and verify it by Saturday, November 14 at 11:59 p.m. Lagos time to keep signing in. Admins can verify their current email.';
  const correct=document.createElement('a');correct.href='verify-email.html?correct=1';correct.textContent='Correct my student email';
  const verify=document.createElement('a');verify.href='verify-email.html';verify.textContent='Verify my email';
  notice.append(heading,copy,correct,' · ',verify);
  main.prepend(notice);
 }catch{}
}
showEmailDeadline();
const footer=document.querySelector('.site-footer');if(footer&&!footer.querySelector('[data-security-link]')){const a=document.createElement('a');a.href='security.html';a.dataset.securityLink='';a.textContent='Account security';footer.append(a);}const admin=document.querySelector('.admin-sidebar nav')||document.querySelector('[aria-label="Admin sections"]');if(admin){const a=document.createElement('a');a.href='security.html';a.className='nav-item';a.textContent='Account security';admin.append(a);}if(['security.html','forgot-password.html','reset-password.html','verify-email.html'].some(p=>location.pathname.endsWith(p)))return;try{const r=await fetch('/api/auth/me',{cache:'no-store'});if(!r.ok)return;const {user}=await r.json();const notes=[];if(!user.emailVerifiedAt){if(user.role==='ADMIN')notes.push('Email verification is recommended. You can continue using the admin workspace without verifying your email.');else if(user.emailVerificationRequired)notes.push('Verify your email before saving changes.');}if(user.role==='EXECUTIVE'&&!user.mfaEnabledAt)notes.push('Set up staff two-step verification'+(user.mfaRequiredAfter?' by '+new Date(user.mfaRequiredAfter).toLocaleDateString():'')+'.');if(notes.length){const p=document.createElement('aside');p.className='security-notice';p.textContent=notes.join(' ')+' ';const a=document.createElement('a');a.href='security.html';a.textContent='Open account security';p.append(a);const main=document.querySelector('main');main?.prepend(p);}}catch{}});})();
