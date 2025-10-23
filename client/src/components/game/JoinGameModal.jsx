import { useState } from 'react';
import { useGame } from '../../hooks/useGame';
import { useNavigate } from 'react-router-dom';

export function JoinGameModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { joinGame, loading, error: apiError } = useGame();
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (roomCode.length !== 6) {
      setError('Room code must be 6 characters');
      return;
    }
    const result = await joinGame(roomCode.toUpperCase());
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-3xl">🔗</span>
            Join Game
          </h2>
        </div>

        <div className="p-8">
          {(error || apiError) && (
            <div className="error-message mb-6 flex gap-2">
              <span>⚠️</span>
              <span>{error || apiError}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Enter the 6-character room code from the game creator
              </p>
            </div>

            {/* Room Code Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                  setError('');
                }}
                className="input-field-lg text-center text-3xl tracking-widest font-mono"
                maxLength={6}
                placeholder="XXXXXX"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                {roomCode.length}/6 characters
              </p>
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
                disabled={loading || roomCode.length !== 6}
                className="flex-1 btn btn-primary py-3 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Joining...
                  </>
                ) : (
                  <>
                    <span>🎯</span>
                    Join Game
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
