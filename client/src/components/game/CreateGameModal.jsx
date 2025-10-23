import { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { useNavigate } from 'react-router-dom';

export function CreateGameModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { createGame, loading } = useGame();
  const [name, setName] = useState('');
  const [gameType, setGameType] = useState('cricket');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Game name is required');
      return;
    }
    const result = await createGame({ name, gameType });
    if (result.success) {
      navigate(`/game/${result.game._id}`);
      onClose();
    } else {
      setError(result.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fadeInUp">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🎮</span>
            Create New Game
          </h2>
        </div>

        <div className="p-8">
          {error && (
            <div className="error-message mb-6 flex gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Game Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Game Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className="input-field"
                placeholder="e.g., Finals 2024"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{name.length}/100 characters</p>
            </div>

            {/* Game Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Game Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'cricket', icon: '🏏', label: 'Cricket' },
                  { value: 'football', icon: '⚽', label: 'Football' },
                  { value: 'basketball', icon: '🏀', label: 'Basketball' },
                  { value: 'custom', icon: '🎮', label: 'Custom' },
                ].map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setGameType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      gameType === type.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{type.icon}</span>
                    <span className="text-sm font-semibold">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 btn btn-secondary py-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="flex-1 btn btn-primary py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Create Game
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

