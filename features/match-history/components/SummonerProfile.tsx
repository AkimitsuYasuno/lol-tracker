/**
 * サモナープロフィールコンポーネント
 */

'use client';

import { SummonerData } from '@/features/match-history/types';
import { getProfileIconUrl } from '@/utils/championHelper';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface SummonerProfileProps {
  summonerData: SummonerData;
}

export default function SummonerProfile({ summonerData }: SummonerProfileProps) {
  return (
    <Card className="bg-card/80 backdrop-blur-md border-border/50 p-6 mb-8 shadow-2xl">
      <div className="flex items-center gap-6">
        <Avatar className="w-24 h-24 border-4 border-primary shadow-lg">
          <AvatarImage
            src={getProfileIconUrl(summonerData.summoner.profileIconId)}
            alt="Profile Icon"
          />
          <AvatarFallback className="bg-primary/20 text-primary text-2xl">
            {summonerData.account.gameName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {summonerData.account.gameName}
            <span className="text-primary">#{summonerData.account.tagLine}</span>
          </h2>
          <p className="text-xl text-muted-foreground mt-1">
            レベル {summonerData.summoner.summonerLevel}
          </p>
        </div>
      </div>
    </Card>
  );
}
