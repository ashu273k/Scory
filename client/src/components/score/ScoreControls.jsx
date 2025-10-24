import { useState } from 'react';
import { Plus, Minus, Flame } from 'lucide-react';

export function ScoreControls({ gameType, onScoreChange, disabled }) {
  const [team, setTeam] = useState('team1');

  const cricketRuns = [1, 2, 3, 4, 6];
  const basketballPoints = [1, 2, 3];

  const handleScoreChange = (scoreData) => {
    if (!disabled) {
      onScoreChange(scoreData);
    }
  };

  return (
    <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Flame className="text-orange-500" size={28} />
          Update Score
        </h3>
        <p className="text-gray-600 text-sm mt-1">Select team and add points</p>
      </div>

      {/* Team Selector */}
      <div className="mb-6 p-1 bg-gray-200 rounded-xl flex gap-1">
        <button
          onClick={() => setTeam('team1')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
            team === 'team1'
              ? 'bg-blue-600 text-white shadow-lg scale-105'
              : 'bg-transparent text-gray-700 hover:bg-gray-300'
          }`}
          disabled={disabled}
        >
          🔵 Team 1
        </button>
        <button
          onClick={() => setTeam('team2')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
            team === 'team2'
              ? 'bg-red-600 text-white shadow-lg scale-105'
              : 'bg-transparent text-gray-700 hover:bg-gray-300'
          }`}
          disabled={disabled}
        >
          🔴 Team 2
        </button>
      </div>

      {/* Score Buttons */}
      {gameType === 'cricket' ? (
        <div>
          {/* Runs */}
          <div className="mb-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Runs</label>
            <div className="grid grid-cols-5 gap-2">
              {cricketRuns.map((runs) => (
                <button
                  key={runs}
                  disabled={disabled}
                  onClick={() => handleScoreChange({ team, runs })}
                  className={`py-3 px-2 rounded-lg font-bold text-lg transition-all duration-200 ${
                    disabled
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-br from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700 shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                  }`}
                >
                  <Plus size={20} className="mx-auto mb-1" />
                  {runs}
                </button>
              ))}
            </div>
          </div>

          {/* Wicket */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">Special</label>
            <button
              disabled={disabled}
              onClick={() => handleScoreChange({ team, wicket: true })}
              className={`w-full py-4 px-4 rounded-lg font-bold text-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                disabled
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-br from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
              }`}
            >
              <Flame size={24} />
              Wicket Out
            </button>
          </div>
        </div>
      ) : (
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-3 block">Points</label>
          <div className="grid grid-cols-3 gap-3">
            {basketballPoints.map((points) => (
              <button
                key={points}
                disabled={disabled}
                onClick={() => handleScoreChange({ team, points })}
                className={`py-4 px-3 rounded-lg font-bold text-2xl transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                  disabled
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-br from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700 shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                }`}
              >
                <Plus size={28} />
                {points}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Disabled State Message */}
      {disabled && (
        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-sm font-medium">
          ⏸️ Scoring is currently disabled
        </div>
      )}
    </div>
  );
}
