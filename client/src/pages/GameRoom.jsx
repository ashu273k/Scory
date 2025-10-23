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

  const handleSocketEvents = useCallback({
    onScoreUpdated: (data) => {
      setGame(prev => ({ ...prev, currentScore: data.currentScore }));
      setEvents(prev=>[data, ...prev]);
    },
    onUserJoined: () => fetchGame(id),
    onUserLeft: () => fetchGame(id),
    onGameStatusUpdated: (data) => setGame(prev => ({ ...prev, status: data.status })),
  }, [id, fetchGame, setGame]);

  const { isConnected } = useSocket(id, handleSocketEvents);

  useEffect(() => { fetchGame(id); }, [id, fetchGame]);

  const handleScoreChange = async (scoreData) => {
    if (!game) return;
    let newScore={...game.currentScore};
    if (game.gameType==='cricket') {
      const {team, runs, wicket} = scoreData;
      if (runs) newScore[team].runs += runs;
      if (wicket) newScore[team].wickets += 1;
    } else {
      const {team, points} = scoreData;
      newScore[team] = (newScore[team] || 0) + points;
    }
    await updateScore(id, { currentScore: newScore, eventType:'score', eventData: scoreData });
    setGame(prev=>({...prev, currentScore: newScore}));
  };

  const handleStatusChange = status => updateGameStatus(id, status);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!game) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center"><h2 className="text-2xl font-bold">Game not found</h2>
        <button onClick={()=>navigate('/dashboard')} className="btn btn-primary mt-4">Back to Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{game.name}</h1>
            <div className="text-xs text-gray-500 capitalize">{game.gameType} • Code: <span className="font-mono">{game.roomCode}</span></div>
          </div>
          <div className="flex items-center gap-4">
            <span>{isConnected ? <span className="text-green-600">Online</span> : <span className="text-red-600">Offline</span>}</span>
            {game.status==='waiting'&&<button className="btn btn-primary" onClick={()=>handleStatusChange('live')}>Start Game</button>}
            {game.status==='live'&&<button className="btn btn-success" onClick={()=>handleStatusChange('completed')}>End Game</button>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <ScoreBoard score={game.currentScore} gameType={game.gameType}/>
            <ScoreControls gameType={game.gameType} onScoreChange={handleScoreChange} disabled={game.status!=='live'}/>
          </div>
          <div>
            <div className="card mb-3">
              <h3 className="font-bold mb-1">Participants ({game.participants?.length || 0})</h3>
              <ul>{game.participants?.map(p=>(
                <li className="flex items-center gap-2 text-sm mb-2" key={p.userId._id}>
                  <div className="w-7 h-7 bg-primary-50 rounded-full flex items-center justify-center text-primary-700 font-bold">{p.userId.username?.[0]?.toUpperCase()}</div>
                  <div>{p.userId.username}</div>
                  <div className="ml-auto text-xs text-gray-500">{p.role}</div>
                </li>
              ))}</ul>
            </div>
            <div className="card">
              <h3 className="font-bold mb-1">Recent Events</h3>
              <ul className="max-h-60 overflow-y-auto text-xs">{events.slice(0,12).map((e,i)=>(
                <li key={i} className="border-b border-gray-100 py-2">{e.eventType} - {new Date(e.timestamp).toLocaleTimeString()}</li>
              ))}</ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
