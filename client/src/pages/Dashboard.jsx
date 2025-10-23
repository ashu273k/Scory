import { useState, useEffect } from 'react';
import { useGame } from '../hooks/useGame';
import { GameCard } from '../components/game/GameCard.jsx';
import { CreateGameModal } from '../components/game/CreateGameModal';
import { JoinGameModal } from '../components/game/JoinGameModal';

export function Dashboard() {
  const { games, fetchGames, loading } = useGame();
  const [createModal, setCreateModal] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchGames(filter !== 'all' ? { status: filter } : {}); }, [filter, fetchGames]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between mb-7">
          <div>
            <h1 className="text-3xl font-bold">My Games</h1>
            <p className="text-xs text-gray-600 mt-1">Manage and join live games</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-secondary" onClick={()=>setJoinModal(true)}>Join Game</button>
            <button className="btn btn-primary" onClick={()=>setCreateModal(true)}>Create Game</button>
          </div>
        </div>
        <div className="flex gap-1 mb-3">
          {['all','waiting','live','completed'].map(status=>(
            <button
              key={status}
              className={`px-3 py-1 rounded capitalize text-sm ${filter===status?'bg-primary-600 text-white':'bg-white text-gray-700'}`}
              onClick={()=>setFilter(status)}>
                {status}
            </button>
          ))}
        </div>
        {loading
          ? <div className="text-center py-14">Loading games...</div>
          : games.length === 0
            ? <div className="text-center py-14 text-gray-400">No games found.</div>
            : (<div>{games.map(game => <GameCard key={game._id} game={game}/>)}</div>)
        }

        <CreateGameModal isOpen={createModal} onClose={()=>setCreateModal(false)}/>
        <JoinGameModal isOpen={joinModal} onClose={()=>setJoinModal(false)}/>
      </div>
    </div>
  );
}
