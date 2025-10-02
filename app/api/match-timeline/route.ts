import { NextRequest, NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const ROUTING = 'asia';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const matchId = searchParams.get('matchId');

  if (!matchId) {
    return NextResponse.json(
      { error: 'matchId is required' },
      { status: 400 }
    );
  }

  try {
    const timelineResponse = await fetch(
      `https://${ROUTING}.api.riotgames.com/lol/match/v5/matches/${matchId}/timeline`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY!,
        },
      }
    );

    if (!timelineResponse.ok) {
      throw new Error(`Timeline API error: ${timelineResponse.status}`);
    }

    const timeline = await timelineResponse.json();

    return NextResponse.json({ timeline });
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline data' },
      { status: 500 }
    );
  }
}
