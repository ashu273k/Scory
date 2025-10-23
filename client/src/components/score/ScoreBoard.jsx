export function ScoreBoard({ score, gameType }) {
  if (gameType === 'cricket') {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Cricket Score</h2>
        <div className="flex gap-6">
          <div>
            <div className="font-semibold mb-1">Team 1</div>
            <div className="text-2xl">{score?.team1?.runs || 0}/{score?.team1?.wickets || 0}</div>
            <div className="text-xs">Overs: {score?.team1?.overs || 0}</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Team 2</div>
            <div className="text-2xl">{score?.team2?.runs || 0}/{score?.team2?.wickets || 0}</div>
            <div className="text-xs">Overs: {score?.team2?.overs || 0}</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">Innings: {score?.currentInnings || 1}</div>
      </div>
    );
  }
  if (gameType === 'basketball' || gameType === 'football') {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4 capitalize">{gameType} Score</h2>
        <div className="flex gap-6">
          <div>
            <div className="font-semibold mb-1">Team 1</div>
            <div className="text-3xl">{score?.team1 || 0}</div>
          </div>
          <div>
            <div className="font-semibold mb-1">Team 2</div>
            <div className="text-3xl">{score?.team2 || 0}</div>
          </div>
        </div>
      </div>
    );
  }
  return <div className="card">Score: {JSON.stringify(score)}</div>;
}
