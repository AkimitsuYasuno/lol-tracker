/**
 * チャンピオン関連のヘルパー関数
 */

import { ChampionsData } from '../types/riot';

/**
 * チャンピオンアイコンのURLを取得
 */
export function getChampionIconUrl(
  championName: string,
  champions: ChampionsData | null
): string | null {
  if (!champions) return null;

  const champion = Object.values(champions.champions).find(
    c => c.name === championName || c.id === championName
  );

  if (!champion) return null;

  return `https://ddragon.leagueoflegends.com/cdn/${champions.version}/img/champion/${champion.image.full}`;
}

/**
 * アイテムアイコンのURLを取得
 */
export function getItemIconUrl(
  itemId: number,
  version: string
): string | null {
  if (itemId === 0) return null;
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`;
}

/**
 * プロフィールアイコンのURLを取得
 */
export function getProfileIconUrl(
  profileIconId: number,
  version: string = '14.24.1'
): string {
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`;
}
