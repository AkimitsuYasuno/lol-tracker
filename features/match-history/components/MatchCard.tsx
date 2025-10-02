/**
 * 個別マッチカードコンポーネント
 */

'use client';

import { Match, ChampionsData } from '@/features/match-history/types';
import { getChampionIconUrl, getItemIconUrl } from '@/utils/championHelper';
import { formatGameDuration, formatRelativeTime, calculateKDA, calculateCS } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface MatchCardProps {
  match: Match;
  champions: ChampionsData;
  userPuuid: string;
  onClick: () => void;
}

export default function MatchCard({
  match,
  champions,
  userPuuid,
  onClick,
}: MatchCardProps) {
  const participant = match.info.participants.find(
    (p) => p.puuid === userPuuid
  );

  if (!participant) return null;

  const kda = calculateKDA(participant.kills, participant.deaths, participant.assists);
  const cs = calculateCS(participant.totalMinionsKilled, participant.neutralMinionsKilled);

  return (
    <Card
      onClick={onClick}
      className={`p-6 shadow-xl cursor-pointer transition-all hover:scale-[1.02] border-l-4 ${
        participant.win
          ? 'bg-primary/10 border-l-primary hover:bg-primary/15'
          : 'bg-destructive/10 border-l-destructive hover:bg-destructive/15'
      }`}
    >
      <div className="flex items-center gap-6">
        {/* 勝敗 */}
        <div className="text-center min-w-[80px]">
          <Badge
            variant={participant.win ? 'default' : 'destructive'}
            className="text-base font-bold mb-1"
          >
            {participant.win ? '勝利' : '敗北'}
          </Badge>
          <div className="text-sm text-muted-foreground">
            {formatRelativeTime(match.info.gameCreation)}
          </div>
          <div className="text-sm text-muted-foreground">
            {formatGameDuration(match.info.gameDuration)}
          </div>
        </div>

        {/* チャンピオン */}
        <div className="flex items-center gap-3">
          <Avatar className="w-16 h-16 border-2 border-border">
            <AvatarImage
              src={getChampionIconUrl(participant.championName, champions) || undefined}
              alt={participant.championName}
            />
            <AvatarFallback className="bg-primary/20 text-primary">
              {participant.championName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-foreground">
              {participant.championName}
            </div>
            <div className="text-sm text-muted-foreground">
              {match.info.gameMode}
            </div>
          </div>
        </div>

        {/* KDA */}
        <div className="flex-1 text-center">
          <div className="text-2xl font-bold text-foreground">
            {participant.kills} / {participant.deaths} / {participant.assists}
          </div>
          <div className="text-sm text-primary">
            KDA: {kda}
          </div>
        </div>

        {/* CS & ダメージ */}
        <div className="text-muted-foreground text-sm">
          <div>CS: {cs}</div>
          <div>
            ダメージ: {participant.totalDamageDealtToChampions.toLocaleString()}
          </div>
          <div>ゴールド: {participant.goldEarned.toLocaleString()}</div>
        </div>

        {/* アイテム */}
        <div className="flex gap-1">
          {[
            participant.item0,
            participant.item1,
            participant.item2,
            participant.item3,
            participant.item4,
            participant.item5,
            participant.item6,
          ].map((itemId, idx) => (
            <div
              key={idx}
              className="w-8 h-8 rounded bg-muted border border-border overflow-hidden"
            >
              {getItemIconUrl(itemId, champions.version) && (
                <img
                  src={getItemIconUrl(itemId, champions.version)!}
                  alt={`Item ${itemId}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
