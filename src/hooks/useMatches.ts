import { useState, useEffect } from 'react';
import { getMatches, MatchResult } from '../lib/api';

export const useMatches = (userId: string | null) => {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchMatches = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const matchResults = await getMatches(userId);
        setMatches(matchResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [userId]);

  return { matches, loading, error, refetch: () => userId && getMatches(userId) };
};