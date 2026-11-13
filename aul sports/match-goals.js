(() => {
  const escape = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  window.renderMatchGoals = (result, fixture) => {
    if (!/football/i.test(fixture?.sport || "") || !result?.scorers?.length) return "";
    const teams = [["HOME", fixture.homeClub?.name || "Home"], ["AWAY", fixture.awayClub?.name || "Away"]];
    const groups = teams.map(([side, club]) => {
      const goals = result.scorers.filter(scorer => scorer.side === side).flatMap(scorer => {
        const assists = new Map(scorer.assists.map(assist => [assist.goalNumber, assist.player?.name]));
        return Array.from({ length: scorer.goals }, (_, index) => {
          const assist = assists.get(index + 1);
          return '<li><strong>' + escape(scorer.player?.name || "Unknown scorer") + '</strong>' +
            (assist ? '<span>Assist: ' + escape(assist) + '</span>' : '') + '</li>';
        });
      });
      return goals.length ? '<div><p class="match-goal-team">' + escape(club) + '</p><ul>' + goals.join("") + '</ul></div>' : "";
    }).join("");
    return groups ? '<section class="match-goals" aria-label="Recorded goals"><h4>Recorded goals</h4>' + groups + '</section>' : "";
  };
})();
