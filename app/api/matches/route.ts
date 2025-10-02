import { NextRequest, NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const ROUTING = 'asia';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const puuid = searchParams.get('puuid');
  const count = searchParams.get('count') || '10';

  if (!puuid) {
    return NextResponse.json(
      { error: 'puuid is required' },
      { status: 400 }
    );
  }

  try {
    // マッチIDリストを取得
    const matchListResponse = await fetch(
      `https://${ROUTING}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY!,
        },
      }
    );

    if (!matchListResponse.ok) {
      throw new Error(`Match list API error: ${matchListResponse.status}`);
    }

    const matchIds = await matchListResponse.json();

    // 各マッチの詳細を取得
    const matchDetailsPromises = matchIds.map((matchId: string) =>
      fetch(
        `https://${ROUTING}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
        {
          headers: {
            'X-Riot-Token': RIOT_API_KEY!,
          },
        }
      ).then(res => res.json())
    );

    const matches = await Promise.all(matchDetailsPromises);

    return NextResponse.json({ matches });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch match data' },
      { status: 500 }
    );
  }
}
