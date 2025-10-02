/**
 * データフォーマット用のユーティリティ関数
 */

/**
 * 秒数を MM:SS 形式に変換
 */
export function formatGameDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * ミリ秒を MM:SS 形式に変換
 */
export function formatTimestamp(ms: number): string {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * タイムスタンプから相対時間を取得（〇日前、〇時間前など）
 */
export function formatRelativeTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays}日前`;
  if (diffHours > 0) return `${diffHours}時間前`;
  if (diffMins > 0) return `${diffMins}分前`;
  return '今';
}

/**
 * KDA計算
 */
export function calculateKDA(kills: number, deaths: number, assists: number): string | number {
  if (deaths === 0) return 'Perfect';
  return ((kills + assists) / deaths).toFixed(2);
}

/**
 * CS計算（ミニオン + 中立モンスター）
 */
export function calculateCS(minions: number, neutralMinions: number): number {
  return minions + neutralMinions;
}

/**
 * 数値をカンマ区切りに変換
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
