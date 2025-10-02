/**
 * マッチリストコンポーネント
 */

'use client';

import { Match, ChampionsData } from '@/features/match-history/types';
import MatchCard from './MatchCard';

interface MatchListProps {
  matches: Match[];
  champions: ChampionsData;
  userPuuid: string;
  onMatchClick: (match: Match) => void;
}

export default function MatchList({
  matches,
  champions,
  userPuuid,
  onMatchClick,
}: MatchListProps) {
  if (matches.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-4">最近の試合</h3>
      <div className="space-y-4">
        {matches.map((match) => (
          <MatchCard
            key={match.metadata.matchId}
            match={match}
            champions={champions}
            userPuuid={userPuuid}
            onClick={() => onMatchClick(match)}
          />
        ))}
      </div>
    </div>
  );
}
