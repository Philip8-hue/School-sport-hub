window.playerStats = {
 football: [['matches','Matches'],['minutes','Minutes played'],['goals','Goals'],['assists','Assists'],['cleanSheets','Clean sheets'],['saves','Saves'],['yellowCards','Yellow cards'],['redCards','Red cards']],
 basketball: [['matches','Games played'],['minutes','Minutes played'],['points','Points'],['rebounds','Rebounds'],['assists','Assists'],['steals','Steals'],['blocks','Blocks'],['turnovers','Turnovers'],['fouls','Personal fouls'],['fieldGoalsMade','Field goals made'],['threePointersMade','Three-pointers made'],['freeThrowsMade','Free throws made']],
 volleyball: [['matches','Matches'],['setsPlayed','Sets played'],['aces','Service aces'],['blocks','Blocks'],['kills','Kills'],['assists','Assists'],['digs','Digs'],['receives','Receives'],['serveErrors','Service errors']]
};
window.playerStatFields = sport => window.playerStats[sport?.includes('Basketball') ? 'basketball' : sport === 'Volleyball' ? 'volleyball' : 'football'];
window.playerStatSummary = player => ['Rating '+(player.rating ?? '—'), ...window.playerStatFields(player.sport).map(([key,label]) => `${label} ${player[key] ?? 0}`)].join(' · ');
