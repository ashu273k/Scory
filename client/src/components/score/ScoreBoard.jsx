import { Trophy, Flame, Target } from 'lucide-react';

export function ScoreBoard({ score, gameType }) {
  if (gameType === 'cricket') {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

        {/* Header */}
        <div className="relative z-10 mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3 mb-1">
            🏏 Cricket Score
          </h2>
          <p className="text-slate-400 text-sm">Innings {score?.currentInnings || 1}</p>
        </div>

        {/* Scoreboard */}
        <div className="relative z-10 grid grid-cols-2 gap-6">
          {/* Team 1 */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
              <h3 className="text-blue-100 font-semibold text-sm uppercase tracking-wider">Team 1</h3>
            </div>

            {/* Runs */}
            <div className="mb-4">
              <div className="text-5xl font-black text-white mb-1">
                {score?.team1?.runs || 0}
              </div>
              <div className="text-blue-200 text-xs font-semibold">RUNS</div>
            </div>

            {/* Wickets & Overs */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-blue-500">
              <div>
                <div className="text-2xl font-bold text-blue-100">
                  {score?.team1?.wickets || 0}
                </div>
                <div className="text-blue-300 text-xs">Wickets</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-100">
                  {score?.team1?.overs || 0}
                </div>
                <div className="text-blue-300 text-xs">Overs</div>
              </div>
            </div>
          </div>

          {/* Team 2 */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-red-300 rounded-full"></div>
              <h3 className="text-red-100 font-semibold text-sm uppercase tracking-wider">Team 2</h3>
            </div>

            {/* Runs */}
            <div className="mb-4">
              <div className="text-5xl font-black text-white mb-1">
                {score?.team2?.runs || 0}
              </div>
              <div className="text-red-200 text-xs font-semibold">RUNS</div>
            </div>

            {/* Wickets & Overs */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-red-500">
              <div>
                <div className="text-2xl font-bold text-red-100">
                  {score?.team2?.wickets || 0}
                </div>
                <div className="text-red-300 text-xs">Wickets</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-100">
                  {score?.team2?.overs || 0}
                </div>
                <div className="text-red-300 text-xs">Overs</div>
              </div>
            </div>
          </div>
        </div>

        {/* Match Status */}
        <div className="relative z-10 mt-6 p-4 bg-slate-700 bg-opacity-50 rounded-xl border border-slate-600">
          <p className="text-slate-300 text-sm text-center">
            <Flame className="inline mr-2" size={16} />
            {score?.team1?.runs > score?.team2?.runs ? '🔵 Team 1 Leading' : score?.team2?.runs > score?.team1?.runs ? '🔴 Team 2 Leading' : '⚖️ Match Tied'}
          </p>
        </div>
      </div>
    );
  }

  if (gameType === 'basketball' || gameType === 'football') {
    const isBasketball = gameType === 'basketball';
    const isTeam1Winning = (score?.team1 || 0) > (score?.team2 || 0);

    return (
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-700 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

        {/* Header */}
        <div className="relative z-10 mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3 capitalize">
            {isBasketball ? '🏀 Basketball Score' : '⚽ Football Score'}
          </h2>
        </div>

        {/* Scoreboard */}
        <div className="relative z-10 grid grid-cols-2 gap-6">
          {/* Team 1 */}
          <div className={`bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${isTeam1Winning ? 'ring-4 ring-cyan-400' : ''}`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 bg-cyan-300 rounded-full animate-pulse"></div>
              <h3 className="text-cyan-100 font-semibold text-sm uppercase tracking-wider">Team 1</h3>
            </div>

            <div className="mb-4">
              <div className="text-7xl font-black text-white mb-2 text-center">
                {score?.team1 || 0}
              </div>
              <div className="text-cyan-200 text-xs font-semibold text-center uppercase tracking-wider">
                {isBasketball ? 'Points' : 'Goals'}
              </div>
            </div>

            {isTeam1Winning && (
              <div className="mt-4 p-2 bg-cyan-500 bg-opacity-50 rounded-lg text-center">
                <Trophy size={20} className="inline text-yellow-300 mr-1" />
                <span className="text-white font-bold text-sm">Leading</span>
              </div>
            )}
          </div>

          {/* Team 2 */}
          <div className={`bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 ${!isTeam1Winning && (score?.team2 || 0) > 0 ? 'ring-4 ring-orange-400' : ''}`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-4 h-4 bg-orange-300 rounded-full animate-pulse"></div>
              <h3 className="text-orange-100 font-semibold text-sm uppercase tracking-wider">Team 2</h3>
            </div>

            <div className="mb-4">
              <div className="text-7xl font-black text-white mb-2 text-center">
                {score?.team2 || 0}
              </div>
              <div className="text-orange-200 text-xs font-semibold text-center uppercase tracking-wider">
                {isBasketball ? 'Points' : 'Goals'}
              </div>
            </div>

            {!isTeam1Winning && (score?.team2 || 0) > 0 && (
              <div className="mt-4 p-2 bg-orange-500 bg-opacity-50 rounded-lg text-center">
                <Trophy size={20} className="inline text-yellow-300 mr-1" />
                <span className="text-white font-bold text-sm">Leading</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 mt-8">
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                (score?.team1 || 0) > (score?.team2 || 0) 
                  ? 'bg-gradient-to-r from-cyan-400 to-cyan-600' 
                  : 'bg-gradient-to-r from-orange-400 to-orange-600'
              }`}
              style={{
                width: `${((score?.team1 || 0) / Math.max(score?.team1 || 1, score?.team2 || 1)) * 100}%`
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-2">
            <span>Team 1: {Math.round(((score?.team1 || 0) / Math.max(score?.team1 || 1, score?.team2 || 1)) * 100)}%</span>
            <span>Team 2: {Math.round(((score?.team2 || 0) / Math.max(score?.team1 || 1, score?.team2 || 1)) * 100)}%</span>
          </div>
        </div>

        {/* Match Status */}
        <div className="relative z-10 mt-6 p-4 bg-slate-700 bg-opacity-50 rounded-xl border border-slate-600 text-center">
          <p className="text-slate-300 text-sm">
            {(score?.team1 || 0) === (score?.team2 || 0) ? (
              <>⚖️ Match Tied</>
            ) : isTeam1Winning ? (
              <>🔵 Team 1 is Winning</>
            ) : (
              <>🟠 Team 2 is Winning</>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700">
      <h2 className="text-2xl font-bold text-white mb-4">Score Details</h2>
      <pre className="bg-slate-800 text-slate-300 p-4 rounded-lg text-xs overflow-auto max-h-96">
        {JSON.stringify(score, null, 2)}
      </pre>
    </div>
  );
}
