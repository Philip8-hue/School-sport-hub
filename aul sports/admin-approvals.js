async function loadApprovals() {
  const target = document.getElementById('approvalQueue');
  target.textContent = 'Loading approval requests…';
  const data = await api('/api/admin/approvals/queue');
  const filter = document.getElementById('approvalStatus').value;
  const name = r => r.kind === 'PLAYER' ? data.players.find(p=>p.id===r.targetId) : data.clubs.find(c=>c.id===r.targetId);
  const show = r => !filter || r.status === filter;
  const identity = r => `<p><strong>${escapeHtml(r.user.name||'Unnamed account')}</strong> · ${escapeHtml(r.user.email)}</p>`;
  const requests = data.requests.filter(show).map(r=>{
    const record=name(r);
    return `<article class="member-panel"><h3>${escapeHtml(r.kind==='PLAYER'?'Player profile claim':'Coaching assignment')} · ${escapeHtml(record?.name||'Record removed')}</h3>${identity(r)}<p>${escapeHtml(record?.sport||'')}</p><p class="member-badge">${escapeHtml(r.status)}</p><p class="member-notice">${escapeHtml(r.message)}</p>${r.reviewNote?`<p>Previous response: ${escapeHtml(r.reviewNote)}</p>`:''}${['PENDING','APPROVED'].includes(r.status)?`<form class="member-form" data-approval-form="requests" data-id="${r.id}"><label>Admin response<textarea name="reviewNote" maxlength="1000" rows="2" placeholder="Verification details or the reason for your decision"></textarea></label><div class="experience-links">${r.status==='PENDING'?`<button name="decision" value="APPROVED" ${record?'':'disabled'}>Approve ${r.kind==='PLAYER'?'profile link':'team access'}</button><button name="decision" value="REJECTED" class="button-secondary">Reject request</button>`:'<button name="decision" value="REVOKED" class="button-secondary">Revoke access</button>'}</div></form>`:''}</article>`;
  }).join('');
  const submissions = data.submissions.filter(show).map(r=>`<article class="member-panel"><h3>${escapeHtml(r.kind.replaceAll('_',' '))}</h3>${identity(r)}<p>${escapeHtml(r.playerId?data.players.find(p=>p.id===r.playerId)?.name:r.clubId?data.clubs.find(c=>c.id===r.clubId)?.name:'')}${r.fixtureId?' · Fixture #'+r.fixtureId:''}</p><span class="member-badge">${escapeHtml(r.status)}</span><p class="member-notice">${escapeHtml(r.details)}</p>${r.reviewNote?`<p>Admin response: ${escapeHtml(r.reviewNote)}</p>`:''}${r.status==='PENDING'?`<p class="muted">Review the evidence and apply any verified changes in Players, Fixtures, Results or Clubs first. This review button does not change official statistics automatically.</p><form class="member-form" data-approval-form="submissions" data-id="${r.id}"><label>Response to the user<textarea name="reviewNote" required maxlength="1000" rows="2"></textarea></label><div class="experience-links"><button name="decision" value="APPROVED">Mark reviewed & applied</button><button name="decision" value="REJECTED" class="button-secondary">Reject proposal</button></div></form>`:''}</article>`).join('');
  target.innerHTML=`<h3>Profile & team access</h3>${requests||'<p class="empty-state">No matching access requests.</p>'}<h3>Corrections & match submissions</h3>${submissions||'<p class="empty-state">No matching submissions.</p>'}`;
}
document.getElementById('approvalStatus')?.addEventListener('change',()=>loadApprovals().catch(e=>setMessage(e.message,'error')));
document.getElementById('approvalQueue')?.addEventListener('submit',async event=>{
  const form=event.target.closest('[data-approval-form]');if(!form)return;event.preventDefault();
  const status=event.submitter?.value;if(!status)return;
  const buttons=[...form.querySelectorAll('button')];buttons.forEach(b=>b.disabled=true);
  try { await api(`/api/admin/approvals/${form.dataset.approvalForm}/${form.dataset.id}`,{method:'PATCH',body:JSON.stringify({status,reviewNote:form.elements.reviewNote.value})});setMessage('Review saved. Account permissions have been updated where applicable.');await loadApprovals(); }
  catch(error){setMessage(error.message,'error');buttons.forEach(b=>b.disabled=false);}
});
