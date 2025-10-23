import { useNavigate } from 'react-router-dom';

export function GameCard({ game }) {
  const navigate = useNavigate();

  const statusConfig = {
    waiting: {
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      icon: '⏳',
    },
    live: {
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: '🔴',
    },
    completed: {
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      icon: '✅',
    },
    cancelled: {
      color: 'from-red-400 to-pink-400',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: '❌',
    },
  };

  const gameTypeEmoji = {
    cricket: '🏏',
    football: '⚽',
    basketball: '🏀',
    custom: '🎮',
  };

  const config = statusConfig[game.status] || statusConfig.waiting;

  return (
    <div
      onClick={() => navigate(`/game/${game._id}`)}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden cursor-pointer border border-gray-100"
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${config.color} h-2`}></div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {game.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {gameTypeEmoji[game.gameType]} {game.gameType.charAt(0).toUpperCase() + game.gameType.slice(1)}
            </p>
          </div>
          <div className={`${config.bgColor} ${config.textColor} px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
            <span>{config.icon}</span>
            {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4"></div>

        {/* Room Code */}
        <div className="mb-4">
          <p className="text-xs text-gray-600 font-medium mb-1">ROOM CODE</p>
          <div className="flex items-center gap-2">
            <code className="bg-gray-100 px-3 py-2 rounded-lg font-mono font-bold text-gray-800 text-lg tracking-wider">
              {game.roomCode}
            </code>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(game.roomCode);
                alert('Room code copied!');
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy room code"
            >
              📋
            </button>
          </div>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">👥</span>
          <span className="text-sm text-gray-600">
            <span className="font-bold text-gray-800">{game.participants?.length || 0}</span> participant{(game.participants?.length || 0) !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Game Info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Created</p>
              <p className="font-semibold text-gray-800">
                {new Date(game.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Last Updated</p>
              <p className="font-semibold text-gray-800">
                {new Date(game.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button className={`w-full bg-gradient-to-r ${config.color} text-white font-bold py-3 rounded-lg group-hover:shadow-lg transition-all`}>
          View Game →
        </button>
      </div>
    </div>
  );
}