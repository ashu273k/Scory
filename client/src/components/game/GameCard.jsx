import { useNavigate } from 'react-router-dom';

export function GameCard({ game }) {
  const navigate = useNavigate();
  const statusColors = {
    waiting: 'badge badge-warning',
    live: 'badge badge-success',
    completed: 'badge badge-info',
    cancelled: 'badge badge-danger',
  };

  return (
    <div onClick={() => navigate(`/game/${game._id}`)} className="card card-hover mb-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold">{game.name}</h3>
          <div className="capitalize text-xs text-gray-600">{game.gameType}</div>
        </div>
        <span className={statusColors[game.status] || 'badge'}>{game.status}</span>
      </div>
      <div className="mt-2 text-xs text-gray-500">Room Code: <span className="font-mono">{game.roomCode}</span></div>
    </div>
  );
}
