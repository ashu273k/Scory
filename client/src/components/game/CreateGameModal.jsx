import { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { useNavigate } from 'react-router-dom';

export function CreateGameModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { createGame, loading } = useGame();
  const [name, setName] = useState('');
  const [gameType, setGameType] = useState('cricket');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createGame({ name, gameType });
    if (result.success) {
      navigate(`/game/${result.game._id}`);
      onClose();
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="card max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Create New Game</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Game Name" />
          <select value={gameType} onChange={e => setGameType(e.target.value)} className="input-field">
            <option value="cricket">Cricket</option>
            <option value="football">Football</option>
            <option value="basketball">Basketball</option>
            <option value="custom">Custom</option>
          </select>
          <div className="flex gap-2">
            <button className="btn btn-secondary flex-1" type="button" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary flex-1" type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
