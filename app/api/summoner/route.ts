import { NextRequest, NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const REGION = 'jp1'; // 日本サーバー
const ROUTING = 'asia'; // アジア地域

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameName = searchParams.get('gameName');
  const tagLine = searchParams.get('tagLine');

  if (!gameName || !tagLine) {
    return NextResponse.json(
      { error: 'gameName and tagLine are required' },
      { status: 400 }
    );
  }

  try {
    // Riot IDでアカウント情報を取得
    const accountResponse = await fetch(
      `https://${ROUTING}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY!,
        },
      }
    );

    if (!accountResponse.ok) {
      if (accountResponse.status === 404) {
        return NextResponse.json(
          { error: 'Summoner not found' },
          { status: 404 }
        );
      }
      throw new Error(`Account API error: ${accountResponse.status}`);
    }

    const accountData = await accountResponse.json();
    const puuid = accountData.puuid;

    // PUUIDでサマナー情報を取得
    const summonerResponse = await fetch(
      `https://${REGION}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY!,
        },
      }
    );

    if (!summonerResponse.ok) {
      throw new Error(`Summoner API error: ${summonerResponse.status}`);
    }

    const summonerData = await summonerResponse.json();

    return NextResponse.json({
      account: accountData,
      summoner: summonerData,
    });
  } catch (error) {
    console.error('Error fetching summoner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summoner data' },
      { status: 500 }
    );
  }
}
