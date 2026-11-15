const time = (p) => p.totalAnswerTimeMs ?? 0;

// Eerst op punten (hoogste boven), bij gelijke punten de snelste
export function sortStandings(players) {
  return players
    .slice()
    .sort((a, b) => b.score - a.score || time(a) - time(b));
}

// Zelfde score en tijd = zelfde plek (1, 2, 2, 4)
export function rankPlayers(players) {
  const sorted = sortStandings(players);
  let rank = 0;
  return sorted.map((player, i) => {
    const prev = sorted[i - 1];
    const tied = prev && prev.score === player.score && time(prev) === time(player);
    if (!tied) rank = i + 1;
    return { ...player, rank };
  });
}