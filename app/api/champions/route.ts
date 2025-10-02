import { NextResponse } from 'next/server';

// Data Dragonからチャンピオン情報を取得
export async function GET() {
  try {
    // 最新バージョンを取得
    const versionsResponse = await fetch(
      'https://ddragon.leagueoflegends.com/api/versions.json'
    );
    const versions = await versionsResponse.json();
    const latestVersion = versions[0];

    // チャンピオンデータを取得
    const championsResponse = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/ja_JP/champion.json`
    );
    const championsData = await championsResponse.json();

    return NextResponse.json({
      version: latestVersion,
      champions: championsData.data,
    });
  } catch (error) {
    console.error('Error fetching champions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch champion data' },
      { status: 500 }
    );
  }
}
