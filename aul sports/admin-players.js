window.renderPlayerStats = function(record) {
 const form = document.getElementById('playerForm'); if (!form) return;
 const container = document.getElementById('playerStatistics');
 const previous = Object.fromEntries([...container.querySelectorAll('input')].map(input => [input.name,input.value]));
 const fields = window.playerStatFields(form.elements.sport.value);
 container.innerHTML = fields.map(([key,label]) => `<label>${label}<input name="${key}" type="number" min="0" step="1" max="1000000" value="0"></label>`).join('');
 for (const input of container.querySelectorAll('input')) input.value = record ? (record[input.name] ?? 0) : (previous[input.name] ?? 0);
 const sport = form.elements.sport.value;
 form.elements.position.placeholder = sport.includes('Basketball') ? 'e.g. Point guard / Center' : sport === 'Volleyball' ? 'e.g. Setter / Libero' : 'e.g. Goalkeeper / Midfielder';
 const club = form.elements.clubId; const selected = club.value;
 for (const option of club.options) { const record = state.clubs.find(item => String(item.id) === option.value); option.hidden = Boolean(record && record.sport !== sport); option.disabled = option.hidden; }
 if (club.selectedOptions[0]?.disabled) club.value = ''; else club.value = selected;
};
document.getElementById('playerForm').elements.sport.addEventListener('change', () => window.renderPlayerStats());
document.getElementById('playerForm').addEventListener('reset', () => setTimeout(() => window.renderPlayerStats(), 0));
window.renderPlayerStats();
