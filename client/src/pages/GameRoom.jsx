import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { useSocket } from '../hooks/useSocket';
import { ScoreBoard } from '../components/score/ScoreBoard';
import { ScoreControls } from '../components/score/ScoreControls';

export function GameRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { game, fetchGame, updateScore, updateGameStatus, loading, setGame } = useGame();
  const [events, setEvents] = useState([]);
  const [showParticipants, setShowParticipants] = useState(false);

  const handleSocketEvents = useCallback(() => {
    return {
      onScoreUpdated: (data) => {
        setGame(prev => ({ ...prev, currentScore: data.currentScore }));
        setEvents(prev => [data, ...prev]);
      },
      onUserJoined: () => fetchGame(id),
      onUserLeft: () => fetchGame(id),
      onGameStatusUpdated: (data) => setGame(prev => ({ ...prev, status: data.status })),
    };
  }, [id, fetchGame, setGame]);

  const { isConnected } = useSocket(id, handleSocketEvents());

  useEffect(() => { 
    fetchGame(id); 
  }, [id, fetchGame]);

  const handleScoreChange = async (scoreData) => {
    if (!game) return;
    let newScore = { ...game.currentScore };
    
    if (game.gameType === 'cricket') {
      const { team, runs, wicket } = scoreData;
      if (runs) newScore[team].runs += runs;
      if (wicket) newScore[team].wickets += 1;
    } else {
      const { team, points } = scoreData;
      newScore[team] = (newScore[team] || 0) + points;
    }
    
    await updateScore(id, { currentScore: newScore, eventType: 'score', eventData: scoreData });
    setGame(prev => ({ ...prev, currentScore: newScore }));
  };

  const handleStatusChange = status => updateGameStatus(id, status);

  const getGameIcon = () => {
    const icons = {
      cricket: '🏏',
      football: '⚽',
      basketball: '🏀',
      custom: '🎮',
    };
    return icons[game?.gameType] || '🎮';
  };

  const getStatusColor = () => {
    const colors = {
      waiting: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      live: 'bg-red-100 text-red-800 border-red-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[game?.status] || colors.waiting;
  };

  const getStatusBadge = () => {
    const badges = {
      waiting: '⏳ Waiting',
      live: '🔴 Live',
      completed: '✅ Completed',
      cancelled: '❌ Cancelled',
    };
    return badges[game?.status] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
          </div>
          <p className="text-gray-600 font-semibold">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <div className="text-6xl mb-4">🏟️</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Game Not Found</h2>
          <p className="text-gray-600 mb-6">The game you're looking for doesn't exist or has been deleted.</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Left: Game Info */}
            <div className="flex items-center gap-4">
              <div className="text-4xl">{getGameIcon()}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{game.name}</h1>
                <p className="text-sm text-gray-500">Room: <span className="font-mono font-bold text-gray-700">{game.roomCode}</span></p>
              </div>
            </div>

            {/* Right: Status & Controls */}
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-full border-2 font-semibold ${getStatusColor()}`}>
                {getStatusBadge()}
              </div>
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className="font-semibold">{isConnected ? 'Online' : 'Offline'}</span>
              </div>
              <button 
                onClick={() => navigate('/dashboard')} 
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Score & Controls (Main) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-blue-600">
              <ScoreBoard score={game.currentScore} gameType={game.gameType} />
            </div>

            {/* Score Controls */}
            {game.status === 'live' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-purple-600">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Update Score</h3>
                <ScoreControls 
                  gameType={game.gameType} 
                  onScoreChange={handleScoreChange} 
                  disabled={game.status !== 'live'} 
                />
              </div>
            )}

            {/* Game Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-indigo-600">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Game Controls</h3>
              <div className="flex gap-4">
                {game.status === 'waiting' && (
                  <button 
                    onClick={() => handleStatusChange('live')}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    🚀 Start Game
                  </button>
                )}
                {game.status === 'live' && (
                  <button 
                    onClick={() => handleStatusChange('completed')}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    ✅ End Game
                  </button>
                )}
                {game.status === 'waiting' || game.status === 'live' ? (
                  <button 
                    onClick={() => handleStatusChange('cancelled')}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    ❌ Cancel Game
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Participants Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-pink-600">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">👥 Participants</h3>
                <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold text-sm">
                  {game.participants?.length || 0}
                </span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {game.participants?.length > 0 ? (
                  game.participants.map((p) => (
                    <div key={p.userId._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {p.userId.username?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">{p.userId.username}</p>
                        <p className="text-xs text-gray-500 capitalize">{p.role}</p>
                      </div>
                      {p.role === 'creator' && (
                        <span className="text-lg">👑</span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No participants yet</p>
                )}
              </div>
            </div>

            {/* Recent Events Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-orange-600">
              <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Recent Events</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {events.length > 0 ? (
                  events.slice(0, 12).map((e, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all text-sm border-l-4 border-orange-400">
                      <span className="font-medium text-gray-700 capitalize">{e.eventType}</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(e.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No events yet</p>
                )}
              </div>
            </div>

            {/* Game Info Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">ℹ️ Game Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="font-semibold text-gray-800 capitalize">{game.gameType}</p>
                </div>
                <div>
                  <p className="text-gray-600">Created</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(game.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {game.startTime && (
                  <div>
                    <p className="text-gray-600">Started</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(game.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}