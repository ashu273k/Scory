import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameCard } from '../components/game/GameCard.jsx';
import { CreateGameModal } from '../components/game/CreateGameModal';
import { JoinGameModal } from '../components/game/JoinGameModal';
import { useAuth } from '../hooks/useAuth';

export function Dashboard() {
  const { games, fetchGames, loading } = useGame();
  const { user, logout } = useAuth();
  const [createModal, setCreateModal] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { 
    fetchGames(filter !== 'all' ? { status: filter } : {}); 
  }, [filter, fetchGames]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ⚽ Scory
            </h1>
            <p className="text-gray-600 text-sm mt-1">Real-time Sports Scoring</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Welcome</p>
              <p className="font-semibold text-gray-800">{user?.username}</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Games</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{games.length}</p>
              </div>
              <span className="text-4xl">🎮</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Live Games</p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  {games.filter(g => g.status === 'live').length}
                </p>
              </div>
              <span className="text-4xl">🔴</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completed</p>
                <p className="text-4xl font-bold text-purple-600 mt-2">
                  {games.filter(g => g.status === 'completed').length}
                </p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={() => setCreateModal(true)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">➕</span>
            Create Game
          </button>
          <button
            onClick={() => setJoinModal(true)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">🔗</span>
            Join Game
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {['all', 'waiting', 'live', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-full font-semibold transition-all transform hover:scale-105 ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Games List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"></div>
              </div>
            </div>
          ) : games.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <span className="text-6xl mb-4 block">🏟️</span>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Games Found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'Create your first game or join an existing one!'
                  : `No ${filter} games at the moment.`}
              </p>
              {filter !== 'all' && (
                <button
                  onClick={() => setFilter('all')}
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View All Games
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {games.map(game => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateGameModal isOpen={createModal} onClose={() => setCreateModal(false)} />
      <JoinGameModal isOpen={joinModal} onClose={() => setJoinModal(false)} />
    </div>
  );
}