const message = document.getElementById("dashboardMessage");
const state = { clubs: [], players: [], fixtures: [], results: [], tables: [], news: [], users: [], items: [] };
const titles = { overview: "Overview", approvals: "Approvals", homepage: "Homepage", clubs: "Clubs", players: "Players", fixtures: "Fixtures", results: "Results", tables: "League tables", news: "News", community: "Community posts", users: "Users" };

async function api(url, options = {}, retried = false) {
  const headers = options.body ? { "Content-Type": "application/json", ...(options.headers || {}) } : options.headers;
  const response = await fetch(url, { ...options, credentials: "same-origin", headers });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && !retried) { await window.adminSession.signIn(); return api(url, options, true); }
  if(response.status===403&&data.error==="Insufficient permissions"){location.replace("account.html?notice=admin-only");throw new Error("Administrator access required.");}
  if (!response.ok) { const details = Object.values(data.details?.fieldErrors || {}).flat().join(" "); throw new Error([data.error || `Request failed (${response.status})`, details].filter(Boolean).join(": ")); }
  return data;
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c]); }
function setMessage(text, type = "success") { message.textContent = text; message.dataset.type = type; }
function formObject(form) { return Object.fromEntries(new FormData(form).entries()); }
function numberOrNull(value) { return value === "" || value == null ? null : Number(value); }
function showSection(section) {
  document.querySelectorAll(".admin-section").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === section));
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.section === section));
  document.getElementById("pageTitle").textContent = titles[section] || "Admin workspace";
  document.getElementById("adminSidebar")?.classList.remove("open");
  const loaders = { approvals: loadApprovals, homepage: loadHomepage, clubs: loadClubs, players: loadPlayers, fixtures: loadFixtures, results: loadResults, tables: loadTables, news: loadNews, community: loadItems, users: loadUsers };
  if (section === "results") Promise.all([loadFixtures(), api("/api/players").then(players => { state.players = players; })]).catch(error => setMessage(error.message, "error"));
  loaders[section]?.().catch(error => setMessage(error.message, "error"));
  document.querySelectorAll(".nav-item").forEach(button => button.setAttribute("aria-current", button.dataset.section === section ? "page" : "false"));
  document.getElementById("menuButton")?.setAttribute("aria-expanded", "false");
}
function renderList(target, html, empty = "Nothing to show yet.") { document.getElementById(target).innerHTML = html || `<p class="empty-state">${empty}</p>`; }
function clubOptions(selectId, includeEmpty = true) { const select = document.getElementById(selectId); if (!select) return; const selected = select.value; select.innerHTML = `${includeEmpty ? '<option value="">Select club</option>' : ""}${state.clubs.map((club) => `<option value="${club.id}">${escapeHtml(club.name)} · ${escapeHtml(club.sport)}</option>`).join("")}`; select.value = selected; }

async function loadOverview() {
  const summary = await api("/api/admin/summary");
  document.getElementById("userCount").textContent = summary.userCount;
  document.getElementById("itemCount").textContent = summary.itemCount;
  const [clubs, players, fixtures, news] = await Promise.all([api("/api/clubs"), api("/api/players"), api("/api/fixtures"), api("/api/news?all=true")]);
  state.clubs = clubs; state.players = players; state.fixtures = fixtures; state.news = news;
  document.getElementById("clubCount").textContent = clubs.length; document.getElementById("playerCount").textContent = players.length; document.getElementById("fixtureCount").textContent = fixtures.length; document.getElementById("newsCount").textContent = news.length;
}
let homepageContent, homepageConfig;
async function loadHomepage() {
 const result = await api('/api/admin/homepage'); homepageContent = result.content;
 if (!homepageConfig) { const response = await fetch('homepage-copy.json'); if (!response.ok) throw new Error('Homepage editor could not load'); homepageConfig = await response.json(); }
 const groups = [...new Set(homepageConfig.map(field => field.group))];
 document.getElementById('homepageFields').innerHTML = groups.map(group => '<details class="editor-group" open><summary>'+escapeHtml(group)+'</summary><div class="form-row">'+homepageConfig.filter(field => field.group === group).map(field => '<label>'+escapeHtml(field.label)+'<input name="copy.'+field.key+'" maxlength="2000" value="'+escapeHtml(homepageContent.copy?.[field.key] ?? (field.legacy ? homepageContent[field.legacy] : undefined) ?? field.value)+'"></label>').join('')+'</div></details>').join('');
}
async function loadClubs() { state.clubs = await api("/api/clubs"); renderList("clubsList", state.clubs.map((c) => `<article class="data-row"><div><h4>${escapeHtml(c.name)}</h4><p>${escapeHtml(c.sport)} · ${escapeHtml(c.slug)}</p></div><div class="row-actions"><button data-edit-type="club" data-edit-id="${c.id}">Edit</button><button class="danger-button" data-delete="/api/clubs/${c.id}" data-refresh="clubs">Delete</button></div></article>`).join(""), "No clubs yet."); ["playerClubSelect", "homeClubSelect", "awayClubSelect", "tableClubSelect"].forEach((id) => clubOptions(id)); }
async function loadPlayers() { state.players = await api("/api/players"); const sport = document.getElementById("playerSportFilter")?.value || ""; const visible = sport ? state.players.filter((player) => player.sport === sport) : state.players; renderList("playersList", visible.map((p) => `<article class="data-row"><div><h4>${escapeHtml(p.name)}</h4><p>${escapeHtml(p.sport)}${p.position ? ` · ${escapeHtml(p.position)}` : ""}${p.club ? ` · ${escapeHtml(p.club.name)}` : ""}</p><small>${escapeHtml(window.playerStatSummary(p))}</small></div><div class="row-actions"><button data-edit-type="player" data-edit-id="${p.id}">Edit</button><button class="danger-button" data-delete="/api/players/${p.id}" data-refresh="players">Delete</button></div></article>`).join(""), "No players yet."); }
async function loadFixtures() { state.fixtures = await api("/api/fixtures"); renderList("fixturesList", state.fixtures.map((f) => `<article class="data-row"><div><h4>${escapeHtml(f.homeClub?.name || "Home") } vs ${escapeHtml(f.awayClub?.name || "Away")}</h4><p>${escapeHtml(f.sport)} · ${new Date(f.startsAt).toLocaleString()}${f.venue ? ` · ${escapeHtml(f.venue)}` : ""}</p><span class="status-pill">${escapeHtml(f.status)}</span></div><div class="row-actions"><button data-edit-type="fixture" data-edit-id="${f.id}">Edit</button><button class="danger-button" data-delete="/api/fixtures/${f.id}" data-refresh="fixtures">Delete</button></div></article>`).join(""), "No fixtures yet."); const select = document.getElementById("resultFixtureSelect"); if (select) { const selected = select.value; select.innerHTML = '<option value="">Select fixture</option>' + state.fixtures.map((f) => `<option value="${f.id}">${escapeHtml(f.homeClub?.name || "Home")} vs ${escapeHtml(f.awayClub?.name || "Away")}</option>`).join(""); select.value = selected; updateResultScoreLabels(state.fixtures.find(f => String(f.id) === select.value)); } }
const resultStages = { Football: ["Half-time", "Second half", "Extra time"], Basketball: ["End of Q1", "Half-time (end of Q2)", "End of Q3", "End of Q4", "Overtime"], Volleyball: ["End of set 1", "End of set 2", "End of set 3", "End of set 4", "End of set 5"] };
let scorerFixture;
const scorerPanel = document.getElementById("matchScorers");
const scorerRows = document.getElementById("matchScorerRows");
function addScorer(fixture, saved) {
  const roster = state.players.filter(p => p.sport === fixture.sport && p.clubId != null && [fixture.homeClubId, fixture.awayClubId].includes(p.clubId));
  const previous = saved && state.players.find(p => p.id === saved.playerId);
  if (previous && !roster.some(p => p.id === previous.id)) roster.push(previous);
  const row = document.createElement("div");
  row.className = "form-row";
  row.innerHTML = '<label>Player<select data-scorer-player required><option value="">Choose player</option></select></label><label>Goals<input data-scorer-goals type="number" required min="1" max="999" value="1"></label><button type="button" class="button-secondary">Remove scorer</button>';
  const select = row.querySelector("select");
  roster.forEach(p => select.add(new Option(p.name + (p.club?.name ? " · " + p.club.name : ""), p.id)));
  if (saved) { select.value = saved.playerId; row.querySelector("input").value = saved.goals; }
  const picks = document.createElement("div");
  picks.className = "scorer-assists";
  row.append(picks);
  const goals = row.querySelector("input");
  function renderAssists(values = [...picks.querySelectorAll("select")].map(input => input.value)) {
    const scorer = roster.find(p => String(p.id) === select.value);
    const club = saved && String(saved.playerId) === select.value ? (saved.side === "HOME" ? fixture.homeClubId : fixture.awayClubId) : scorer?.clubId;
    const teammates = state.players.filter(p => club != null && p.clubId === club && p.sport === fixture.sport && String(p.id) !== select.value);
    const count = select.value && goals.validity.valid ? Number(goals.value) : 0;
    const fields = Array.from({length: count}, (_, i) => {
      const label = document.createElement("label");
      label.textContent = "Assist for goal " + (i + 1);
      const input = document.createElement("select");
      input.dataset.goalAssist = "";
      input.add(new Option("No assist", ""));
      teammates.forEach(player => input.add(new Option(player.name, player.id)));
      const existing = saved?.assists?.find(a => String(a.playerId) === String(values[i]) && a.goalNumber === i + 1);
      if (existing && !teammates.some(p => p.id === existing.playerId)) {
        input.add(new Option(state.players.find(p => p.id === existing.playerId)?.name || "Previously credited player", existing.playerId));
      }
      input.value = values[i] || "";
      if (input.selectedIndex < 0) input.value = "";
      label.append(input);
      return label;
    });
    picks.replaceChildren(...fields);
  }
  renderAssists(Array.from({length: saved?.goals || 0}, (_, i) => saved.assists?.find(a => a.goalNumber === i + 1)?.playerId ?? ""));
  select.addEventListener("change", () => renderAssists([]));
  goals.addEventListener("change", () => renderAssists());
  row.querySelector("button").onclick = () => row.remove();
  scorerRows.append(row);
}
document.getElementById("addMatchScorer")?.addEventListener("click", () => {
  if (scorerFixture && scorerRows.children.length < 80) addScorer(scorerFixture);
});
function updateResultScoreLabels(fixture, useSavedStage = false) {
  const football = !!fixture && /football/i.test(fixture.sport);
  scorerPanel.hidden = !football;
  scorerPanel.disabled = !football;
  if (useSavedStage || scorerFixture?.id !== fixture?.id) {
    scorerRows.replaceChildren();
    if (football) (fixture.result?.scorers || []).forEach(row => addScorer(fixture, row));
  }
  scorerFixture = fixture;
  const sport = Object.keys(resultStages).find(name => fixture?.sport.toLowerCase().includes(name.toLowerCase()));
  const stage = document.getElementById("resultStage");
  const selected = useSavedStage ? fixture?.result?.stage : stage.value;
  stage.replaceChildren(new Option("Live score", ""), ...(resultStages[sport] || []).map(label => new Option(label, label)));
  stage.value = [...stage.options].some(option => option.value === selected) ? selected : "";
  const completed = fixture?.status === "COMPLETED";
  stage.disabled = !fixture || completed;
  const liveButton = stage.form.querySelector('button[value="LIVE"]');
  liveButton.hidden = completed;
  liveButton.style.display = completed ? "none" : "";
  liveButton.disabled = completed;
  const finalButton = stage.form.querySelector('button[value="COMPLETED"]');
  if (!stage.form.dataset.saving) finalButton.textContent = completed ? "Save corrected final score" : sport === "Football" ? "Publish full-time score" : "Publish final score";
  const unit = { Football: "goals", Basketball: "total points", Volleyball: "sets won" }[sport];
  document.getElementById("resultSport").textContent = fixture ? fixture.sport + (unit ? " · Enter " + unit : "") : "";
  document.getElementById("homeScoreLabel").textContent = fixture?.homeClub?.name ? fixture.homeClub.name + " score" : "Home score";
  document.getElementById("awayScoreLabel").textContent = fixture?.awayClub?.name ? fixture.awayClub.name + " score" : "Away score";
}
document.getElementById("resultFixtureSelect")?.addEventListener("change", event => {
  const fixture = state.fixtures.find(f => String(f.id) === event.target.value);
  updateResultScoreLabels(fixture, true);
  const form = event.target.form;
  form.elements.homeScore.value = fixture ? fixture.result?.homeScore ?? 0 : "";
  form.elements.awayScore.value = fixture ? fixture.result?.awayScore ?? 0 : "";
});
async function loadResults() {
  const [results, fixtures] = await Promise.all([api("/api/results"), api("/api/fixtures")]);
  state.results = results;
  const live = fixtures.filter(f => f.status === "LIVE" && f.result).map(f => ({...f.result, fixture: f}));
  const rows = [...live, ...results];
  renderList("resultsList", rows.map(r => `<article class="data-row"><div><h4>${escapeHtml(r.fixture?.homeClub?.name || "Home")} ${r.homeScore} — ${r.awayScore} ${escapeHtml(r.fixture?.awayClub?.name || "Away")}</h4><p>${escapeHtml(r.fixture?.sport || "Match")} · ${r.fixture?.status === "LIVE" ? escapeHtml(r.stage || "Live") : "Final"}</p></div><div class="row-actions"><button type="button" class="button-secondary" data-edit-score="${r.fixtureId}">Edit score</button><button type="button" class="danger-button" data-delete-score="${r.fixtureId}">Delete score</button></div></article>`).join(""), "No published scores yet.");
}
document.getElementById("resultsList")?.addEventListener("click", async event => {
  const edit = event.target.closest("[data-edit-score]");
  if (edit) {
    const select = document.getElementById("resultFixtureSelect");
    if (select.form.dataset.saving) return;
    edit.disabled = true;
    try {
      await loadFixtures();
      select.value = edit.dataset.editScore;
      if (!select.value) { setMessage("That fixture is no longer available.", "error"); return; }
      select.dispatchEvent(new Event("change"));
      select.form.scrollIntoView({block: "nearest"});
      select.form.elements.homeScore.focus({preventScroll: true});
    } catch (error) { setMessage(error.message, "error"); }
    finally { edit.disabled = false; }
    return;
  }
  const button = event.target.closest("[data-delete-score]");
  if (!button || button.disabled || !window.confirm("Delete this published score? The fixture will remain scheduled.")) return;
  button.disabled = true;
  try {
    await api("/api/fixtures/" + button.dataset.deleteScore + "/result", {method: "DELETE"});
    const select = document.getElementById("resultFixtureSelect");
    if (select.value === button.dataset.deleteScore) {
      select.form.reset();
      updateResultScoreLabels();
    }
    setMessage("Score deleted. The fixture was kept.");
    await Promise.all([loadFixtures(), loadResults()]);
  } catch (error) { setMessage(error.message, "error"); }
  finally { button.disabled = false; }
});
async function loadTables() { state.tables = await api("/api/tables"); renderList("tablesList", state.tables.map((t) => `<article class="data-row"><div><h4>${escapeHtml(t.club?.name || "Club")}</h4><p>${escapeHtml(t.sport)} · P ${t.played} · W ${t.won} · D ${t.drawn} · L ${t.lost}</p></div><strong>${t.points} pts</strong></article>`).join(""), "No table entries yet."); }
async function loadNews() { state.news = await api("/api/news?all=true"); renderList("newsList", state.news.map((n) => `<article class="data-row"><div><h4>${escapeHtml(n.title)}</h4><p>${escapeHtml(n.excerpt || n.content.slice(0, 120))}</p><span class="status-pill ${n.published ? "" : "off"}">${n.published ? "Published" : "Draft"}</span></div><div class="row-actions"><button data-edit-type="news" data-edit-id="${n.id}">Edit</button><button class="danger-button" data-delete="/api/news/${n.id}" data-refresh="news">Delete</button></div></article>`).join(""), "No news articles yet."); }
async function loadItems() { const data = await api("/api/admin/summary"); state.items = data.recentItems; renderList("itemsList", state.items.map((item) => `<article class="data-row"><div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.content || "No content")}</p><small>${new Date(item.createdAt).toLocaleString()}</small></div><button class="danger-button" data-delete="/api/admin/items/${item.id}" data-refresh="community">Delete</button></article>`).join(""), "No community posts yet."); }
async function loadUsers() {
 state.users = await api('/api/admin/users');
 renderList('usersList', state.users.map(u => `<article class="data-row"><div><h4>${escapeHtml(u.name || u.email)}</h4><p>${escapeHtml(u.email)} · ${escapeHtml(u.role)}${u.executiveSport ? ' · '+escapeHtml(u.executiveSport) : ''}</p><span class="status-pill ${u.isActive ? '' : 'off'}">${u.isActive ? 'Active' : 'Disabled'}</span></div><div class="row-actions"><button data-user-action="${u.id}" data-role="${u.role === 'USER' ? 'ADMIN' : 'USER'}">${u.role === 'USER' ? 'Make admin' : 'Make user'}</button><button data-user-action="${u.id}" data-active="${!u.isActive}" class="button-secondary">${u.isActive ? 'Disable' : 'Activate'}</button>${u.role !== 'ADMIN' ? `<label>Executive sport<select data-exec-sport="${u.id}"><option value="">Choose sport</option>${['football','basketball','volleyball'].map(sport=>`<option value="${sport}" ${sport===u.executiveSport?'selected':''}>${sport[0].toUpperCase()+sport.slice(1)}</option>`).join('')}</select></label><button data-exec-user="${u.id}">${u.role==='EXECUTIVE'?'Update executive access':'Make sport executive'}</button>` : ''}</div></article>`).join(''), 'No users yet.');
}
function beginEdit(type, id) { const stateKey = type === "news" ? "news" : type === "club" ? "clubs" : `${type}s`; const record = state[stateKey]?.find((item) => item.id === Number(id)); if (!record) return; const formId = `${type === "club" ? "club" : type === "player" ? "player" : type === "fixture" ? "fixture" : "news"}Form`; const form = document.getElementById(formId); if (!form) return; showSection(type === "club" ? "clubs" : type === "player" ? "players" : type === "fixture" ? "fixtures" : "news"); if (type === "player") { form.elements.sport.value = record.sport; window.renderPlayerStats({...record, goals: record.manualGoals ?? record.goals, assists: record.manualAssists ?? record.assists}); } Object.entries(record).forEach(([key, value]) => { const field = form.elements[key]; if (!field || key === "club" || key === "homeClub" || key === "awayClub" || key === "result") return; if (field.type === "checkbox") field.checked = Boolean(value); else if (key === "startsAt" && value) field.value = new Date(new Date(String(value)).getTime() - new Date(String(value)).getTimezoneOffset() * 60000).toISOString().slice(0, 16); else field.value = (type === "player" && key === "goals" ? record.manualGoals ?? value : type === "player" && key === "assists" ? record.manualAssists ?? value : value) ?? ""; }); form.elements.id.value = record.id; const heading = form.querySelector("h3"); if (heading) heading.textContent = `Edit ${type}`; const submit = form.querySelector('button[type="submit"]'); if (submit) submit.textContent = `Update ${type}`; form.scrollIntoView({ behavior: "smooth", block: "start" }); }

const forms = {
  clubForm: async (form) => { const o = formObject(form); const data = { ...o, logoUrl: o.logoUrl || null }; await api(o.id ? `/api/clubs/${o.id}` : "/api/clubs", { method: o.id ? "PATCH" : "POST", body: JSON.stringify(data) }); return o.id ? "Club updated." : "Club created."; },
  playerForm: async (form) => { const o = formObject(form); const numeric = ["rating", ...window.playerStatFields(o.sport).map(([key]) => key)]; const data = { ...o, jerseyNumber: numberOrNull(o.jerseyNumber), clubId: numberOrNull(o.clubId), fullName: o.fullName || null, photoUrl: o.photoUrl || null, captain: form.elements.captain.checked }; numeric.forEach((key) => { data[key] = o[key] === "" ? undefined : Number(o[key]); }); await api(o.id ? `/api/players/${o.id}` : "/api/players", { method: o.id ? "PATCH" : "POST", body: JSON.stringify(data) }); return o.id ? "Player updated." : "Player created."; },
  fixtureForm: async (form) => { const o = formObject(form); const data = { ...o, startsAt: new Date(o.startsAt).toISOString(), homeClubId: numberOrNull(o.homeClubId), awayClubId: numberOrNull(o.awayClubId) }; await api(o.id ? `/api/fixtures/${o.id}` : "/api/fixtures", { method: o.id ? "PATCH" : "POST", body: JSON.stringify(data) }); return o.id ? "Fixture updated." : "Fixture scheduled."; },
  resultForm: async (form, status) => { const o = formObject(form); const correction = state.fixtures.some(f => String(f.id) === o.fixtureId && f.status === "COMPLETED"); await api(`/api/fixtures/${o.fixtureId}/result`, { method: "PUT", body: JSON.stringify({ homeScore: Number(o.homeScore), awayScore: Number(o.awayScore), status: status || "LIVE", stage: status === "COMPLETED" ? null : o.stage || null, scorers: scorerPanel.disabled ? undefined : [...scorerRows.children].map(row => ({playerId: Number(row.querySelector("select").value), goals: Number(row.querySelector("input").value), assists: [...row.querySelectorAll('[data-goal-assist]')].map(input => input.value ? Number(input.value) : null)})) }) }); return status === "COMPLETED" ? (correction ? "Final score corrected." : "Final score published.") : o.stage ? o.stage + " score published." : "Live score published."; },
  tableForm: async (form) => { const o = formObject(form); await api("/api/tables", { method: "PUT", body: JSON.stringify({ ...o, clubId: Number(o.clubId), played: Number(o.played), won: Number(o.won), drawn: Number(o.drawn), lost: Number(o.lost), points: Number(o.points) }) }); return "Table entry saved."; },
  newsForm: async (form) => { const o = formObject(form); const data = { ...o, sport: o.sport || null, published: form.querySelector('[name="published"]').checked }; await api(o.id ? `/api/news/${o.id}` : "/api/news", { method: o.id ? "PATCH" : "POST", body: JSON.stringify(data) }); return o.id ? "Article updated." : "Article saved."; },
};
const formSections = { clubForm: "clubs", playerForm: "players", fixtureForm: "fixtures", resultForm: "results", tableForm: "tables", newsForm: "news" };

Object.entries(forms).forEach(([id, handler]) => document.getElementById(id)?.addEventListener("submit", async (event) => { event.preventDefault(); const form = event.currentTarget; if (form.dataset.saving) return; form.dataset.saving = "true"; const submit = event.submitter || form.querySelector('button[type="submit"]:not([hidden])'); if (submit) { submit.disabled = true; submit.dataset.originalText = submit.textContent; submit.textContent = "Saving..."; } try { const result = await handler(form, submit?.value); if(id!=="resultForm")form.reset(); if (form.elements.id) form.elements.id.value = ""; const heading = form.querySelector("h3"); if (heading) heading.textContent = id === "clubForm" ? "Add club" : id === "playerForm" ? "Add player" : id === "fixtureForm" ? "Schedule fixture" : id === "newsForm" ? "Publish article" : heading.textContent; if (submit) submit.dataset.originalText = id === "clubForm" ? "Create club" : id === "playerForm" ? "Create player" : id === "fixtureForm" ? "Schedule fixture" : id === "newsForm" ? "Save article" : submit.dataset.originalText; setMessage(result); try { await loadOverview(); } catch (refreshError) { console.warn("Saved successfully, but the dashboard summary could not refresh", refreshError); setMessage(`${result} Refresh the list if needed.`); } if (formSections[id]) showSection(formSections[id]); } catch (error) { setMessage(error.message, "error"); } finally { delete form.dataset.saving; if (submit) { submit.disabled = false; submit.textContent = submit.dataset.originalText || "Save"; } } }));
document.getElementById('homepageForm').addEventListener('submit', async event => {
 event.preventDefault(); const form=event.currentTarget; const submit=form.querySelector('[type=submit]'); submit.disabled=true;
 try { const copy={...homepageContent.copy}; const data={...homepageContent}; for(const field of homepageConfig){copy[field.key]=form.elements['copy.'+field.key].value;if(field.legacy)data[field.legacy]=copy[field.key];} data.copy=copy; await api('/api/admin/homepage',{method:'PATCH',body:JSON.stringify(data)});homepageContent=data;setMessage('Homepage saved. All edited text is now published.');document.getElementById('homepageSaveMessage').textContent='Saved successfully'; } catch(error){setMessage(error.message,'error');}finally{submit.disabled=false;}
});

document.getElementById("itemForm")?.addEventListener("submit", async (event) => { event.preventDefault(); try { await api("/api/admin/items", { method: "POST", body: JSON.stringify({ title: document.getElementById("itemTitle").value, content: document.getElementById("itemContent").value }) }); document.getElementById("itemForm").reset(); setMessage("Post published."); await loadItems(); await loadOverview(); } catch (error) { setMessage(error.message, "error"); } });
document.addEventListener("click", async (event) => { const nav = event.target.closest("[data-section]"); if (nav) showSection(nav.dataset.section); const go = event.target.closest("[data-go]"); if (go) showSection(go.dataset.go); const refresh = event.target.closest("[data-refresh]"); if (refresh) showSection(refresh.dataset.refresh); const del = event.target.closest("[data-delete]"); if (del) { if (!window.confirm("Delete this item?")) return; try { await api(del.dataset.delete, { method: "DELETE" }); setMessage("Deleted successfully."); showSection(del.dataset.refresh); await loadOverview(); } catch (error) { setMessage(error.message, "error"); } } const userAction = event.target.closest("[data-user-action]"); if (userAction) { try { await api(`/api/admin/users/${userAction.dataset.userAction}`, { method: "PATCH", body: JSON.stringify(userAction.dataset.role ? { role: userAction.dataset.role } : { isActive: userAction.dataset.active === "true" }) }); setMessage("User access updated."); await loadUsers(); } catch (error) { setMessage(error.message, "error"); } } });
document.getElementById("menuButton")?.addEventListener("click", () => document.getElementById("adminSidebar")?.classList.toggle("open"));
document.getElementById("logoutButton")?.addEventListener("click", async () => { await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }); window.location.href = "admin-login.html"; });

document.addEventListener("click", (event) => { const edit = event.target.closest("[data-edit-type]"); if (edit) beginEdit(edit.dataset.editType, edit.dataset.editId); });
document.getElementById("playerSportFilter")?.addEventListener("change", () => { const sport = document.getElementById("playerSportFilter").value; const visible = sport ? state.players.filter((player) => player.sport === sport) : state.players; renderList("playersList", visible.map((p) => `<article class="data-row"><div><h4>${escapeHtml(p.name)}</h4><p>${escapeHtml(p.sport)}${p.position ? ` · ${escapeHtml(p.position)}` : ""}${p.club ? ` · ${escapeHtml(p.club.name)}` : ""}</p><small>${escapeHtml(window.playerStatSummary(p))}</small></div><div class="row-actions"><button data-edit-type="player" data-edit-id="${p.id}">Edit</button><button class="danger-button" data-delete="/api/players/${p.id}" data-refresh="players">Delete</button></div></article>`).join(""), "No players in this sport yet."); });

(async function init() { try { const me = await api("/api/auth/me"); if(me.user.role!=="ADMIN"){location.replace("account.html?notice=admin-only");return;} document.getElementById("adminIdentity").textContent = `${me.user.name || me.user.email} · ${me.user.role}`; await loadOverview(); await loadClubs(); } catch (error) { setMessage(error.message, "error"); } })();

// Search directories, cancel edits, and dismiss mobile navigation with Escape.
for (const list of document.querySelectorAll('.data-list')) { const search=document.createElement('input'); search.type='search'; search.className='search-field'; search.placeholder='Search this list…'; search.setAttribute('aria-label','Search '+list.id.replace('List','')); list.before(search); search.addEventListener('input',()=>{ for(const row of list.querySelectorAll('.data-row')) row.hidden=!row.textContent.toLowerCase().includes(search.value.toLowerCase()); }); new MutationObserver(()=>search.dispatchEvent(new Event('input'))).observe(list,{childList:true}); }
for(const id of ['clubForm','playerForm','fixtureForm','newsForm']){ const form=document.getElementById(id); const cancel=document.createElement('button');cancel.type='button';cancel.className='cancel-edit';cancel.textContent='Clear / cancel edit';cancel.addEventListener('click',()=>{form.reset();form.elements.id.value='';form.querySelector('h3').textContent= id==='fixtureForm'?'Schedule fixture':'Add '+id.replace('Form','');form.querySelector('[type=submit]').textContent=id==='newsForm'?'Save article':id==='fixtureForm'?'Schedule fixture':'Create '+id.replace('Form','');});form.append(cancel); }
document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.getElementById('adminSidebar').classList.remove('open');document.getElementById('menuButton').setAttribute('aria-expanded','false');}});
document.getElementById('menuButton').addEventListener('click',()=>document.getElementById('menuButton').setAttribute('aria-expanded',String(document.getElementById('adminSidebar').classList.contains('open'))));

window.addEventListener("focus",()=>fetch("/api/auth/me").then(r=>r.ok?r.json():null).then(d=>{if(d&&d.user.role!=="ADMIN")location.replace("account.html?notice=admin-only");}).catch(()=>{}));

document.addEventListener('click', async event => {const button=event.target.closest('[data-exec-user]');if(!button)return;const sport=document.querySelector('[data-exec-sport="'+button.dataset.execUser+'"]').value;if(!sport){setMessage('Choose the executive sport first.','error');return;}button.disabled=true;try{await api('/api/admin/users/'+button.dataset.execUser,{method:'PATCH',body:JSON.stringify({role:'EXECUTIVE',executiveSport:sport})});setMessage('Executive access assigned. They must sign in again through Executive sign in.');await loadUsers();}catch(error){setMessage(error.message,'error');}finally{button.disabled=false;}});
