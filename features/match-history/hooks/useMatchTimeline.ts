/**
 * マッチタイムライン取得のためのカスタムフック
 */

import { useState, useEffect } from 'react';
import { Timeline } from '@/features/match-history/types';
import { fetchMatchTimeline } from '@/services/riotApi';

export function useMatchTimeline(matchId: string | null) {
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) {
      setTimeline(null);
      return;
    }

    const loadTimeline = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchMatchTimeline(matchId);
        setTimeline(data.timeline);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'タイムラインの取得に失敗しました');
        setTimeline(null);
      } finally {
        setLoading(false);
      }
    };

    loadTimeline();
  }, [matchId]);

  return { timeline, loading, error };
}
