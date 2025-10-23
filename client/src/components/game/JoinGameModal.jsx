import { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { useNavigate } from 'react-router-dom';

export function JoinGameModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { joinGame, loading, error } = useGame();
  const [roomCode, setRoomCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await joinGame(roomCode.toUpperCase());
    if (result.success) {
      navigate(`/game/${result.game._id}`);
      onClose();
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="card max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Join Game</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-700 p-2 rounded">{error}</div>}
          <input type="text" value={roomCode} onChange={e => setRoomCode(e.target.value.toUpperCase())} className="input-field text-center text-2xl" maxLength={6} minLength={6} placeholder="ROOMCODE" />
          <div className="flex gap-2">
            <button className="btn btn-secondary flex-1" type="button" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary flex-1" type="submit" disabled={loading || roomCode.length !==6}>{loading ? "Joining..." : "Join"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
