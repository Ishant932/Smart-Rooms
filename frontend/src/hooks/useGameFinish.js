import { useState } from 'react';
import { playGame } from '../api/client';
import { useAuth } from '../context/AuthContext';

export function useGameFinish() {
  const { setWallet } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const finish = async (gameId, score) => {
    setLoading(true);
    try {
      const data = await playGame(gameId, score);
      setResult(data);
      setWallet((w) => ({ ...w, points: data.totalPoints }));
      return data;
    } catch {
      setResult({ pointsEarned: 0, message: 'Could not save score' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setResult(null);

  return { result, loading, finish, reset };
}
