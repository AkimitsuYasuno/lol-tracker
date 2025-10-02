/**
 * Riot API Service Layer
 *
 * このファイルはすべてのAPI呼び出しを集約します。
 * 将来的にPythonバックエンドに移行する際は、このファイルの
 * エンドポイントURLを変更するだけで対応できます。
 */

import { SummonerData, Match, ChampionsData, Timeline } from '@/features/match-history/types';

// APIのベースURL（環境変数で切り替え可能）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

/**
 * サマナー情報を取得
 */
export async function fetchSummonerByRiotId(
  gameName: string,
  tagLine: string
): Promise<SummonerData> {
  const response = await fetch(
    `${API_BASE_URL}/api/summoner?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'サモナーが見つかりませんでした');
  }

  return response.json();
}

/**
 * マッチ履歴を取得
 */
export async function fetchMatchHistory(
  puuid: string,
  count: number = 10
): Promise<{ matches: Match[] }> {
  const response = await fetch(
    `${API_BASE_URL}/api/matches?puuid=${puuid}&count=${count}`
  );

  if (!response.ok) {
    throw new Error('マッチ履歴の取得に失敗しました');
  }

  return response.json();
}

/**
 * チャンピオン情報を取得
 */
export async function fetchChampions(): Promise<ChampionsData> {
  const response = await fetch(`${API_BASE_URL}/api/champions`);

  if (!response.ok) {
    throw new Error('チャンピオン情報の取得に失敗しました');
  }

  return response.json();
}

/**
 * マッチのタイムライン情報を取得
 */
export async function fetchMatchTimeline(
  matchId: string
): Promise<{ timeline: Timeline }> {
  const response = await fetch(
    `${API_BASE_URL}/api/match-timeline?matchId=${matchId}`
  );

  if (!response.ok) {
    throw new Error('タイムライン情報の取得に失敗しました');
  }

  return response.json();
}
