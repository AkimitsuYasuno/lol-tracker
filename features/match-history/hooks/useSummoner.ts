/**
 * サマナー検索のためのカスタムフック
 */

import { useState } from 'react';
import { SummonerData, Match, ChampionsData } from '@/features/match-history/types';
import {
  fetchSummonerByRiotId,
  fetchMatchHistory,
  fetchChampions,
} from '@/services/riotApi';

export function useSummoner() {
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [champions, setChampions] = useState<ChampionsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchSummoner = async (gameName: string, tagLine: string) => {
    if (!gameName || !tagLine) {
      setError('サモナー名とタグラインを入力してください');
      return;
    }

    setLoading(true);
    setError('');
    setSummonerData(null);
    setMatches([]);

    try {
      // サマナー情報を取得
      const summoner = await fetchSummonerByRiotId(gameName, tagLine);
      setSummonerData(summoner);

      // マッチ履歴を取得
      const matchesData = await fetchMatchHistory(summoner.account.puuid, 10);
      setMatches(matchesData.matches);

      // チャンピオン情報を取得（まだ取得していない場合）
      if (!champions) {
        const championsData = await fetchChampions();
        setChampions(championsData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return {
    summonerData,
    matches,
    champions,
    loading,
    error,
    searchSummoner,
  };
}
