'use client';

import { Match, ChampionsData } from '@/features/match-history/types';
import { useMatchTimeline } from '@/features/match-history/hooks/useMatchTimeline';
import { getChampionIconUrl, getItemIconUrl } from '@/utils/championHelper';
import { formatGameDuration, formatTimestamp, calculateKDA } from '@/utils/formatters';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface MatchDetailModalProps {
  match: Match;
  champions: ChampionsData;
  userPuuid: string;
  onClose: () => void;
}

export default function MatchDetailModal({ match, champions, userPuuid, onClose }: MatchDetailModalProps) {
  const { timeline, loading } = useMatchTimeline(match.metadata.matchId);

  // チームごとにプレイヤーを分ける
  const team100 = match.info.participants.filter(p => p.teamId === 100);
  const team200 = match.info.participants.filter(p => p.teamId === 200);

  // チーム情報
  const team100Info = match.info.teams.find(t => t.teamId === 100);
  const team200Info = match.info.teams.find(t => t.teamId === 200);

  // 時間ごとのゴールドデータ
  const goldData = timeline?.info.frames.map(frame => {
    let team100Gold = 0;
    let team200Gold = 0;

    Object.values(frame.participantFrames).forEach((pf) => {
      const participant = match.info.participants.find(p => {
        const participantIndex = match.metadata.participants.indexOf(p.puuid);
        return participantIndex + 1 === pf.participantId;
      });

      if (participant) {
        if (participant.teamId === 100) {
          team100Gold += pf.totalGold;
        } else {
          team200Gold += pf.totalGold;
        }
      }
    });

    return {
      timestamp: frame.timestamp,
      team100Gold,
      team200Gold,
    };
  }) || [];

  // 最大ゴールド値
  const maxGold = Math.max(
    ...goldData.map(d => Math.max(d.team100Gold, d.team200Gold)),
    100000
  );

  const renderTeamObjectives = (teamInfo: typeof team100Info, isWin: boolean) => (
    <Card className={isWin ? 'border-primary' : 'border-destructive'}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Badge variant={isWin ? 'default' : 'destructive'}>
            {isWin ? '勝利' : '敗北'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>🐉 ドラゴン:</span>
          <span className="font-bold">{teamInfo?.objectives.dragon.kills || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>👹 バロン:</span>
          <span className="font-bold">{teamInfo?.objectives.baron.kills || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>🏰 タワー:</span>
          <span className="font-bold">{teamInfo?.objectives.tower.kills || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>💎 インヒビター:</span>
          <span className="font-bold">{teamInfo?.objectives.inhibitor.kills || 0}</span>
        </div>
        <div className="flex justify-between">
          <span>🦀 ヘラルド:</span>
          <span className="font-bold">{teamInfo?.objectives.riftHerald.kills || 0}</span>
        </div>
      </CardContent>
    </Card>
  );

  const renderPlayerTable = (players: typeof team100, teamName: string, teamWin: boolean) => (
    <Card className={teamWin ? 'border-primary' : 'border-destructive'}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {teamName}
          <Badge variant={teamWin ? 'default' : 'destructive'}>
            {teamWin ? '勝利' : '敗北'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>チャンピオン</TableHead>
              <TableHead>プレイヤー</TableHead>
              <TableHead className="text-center">レーン</TableHead>
              <TableHead className="text-center">K/D/A</TableHead>
              <TableHead className="text-center">CS</TableHead>
              <TableHead className="text-center">ダメージ</TableHead>
              <TableHead className="text-center">ゴールド</TableHead>
              <TableHead className="text-center">視界</TableHead>
              <TableHead>アイテム</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((p, idx) => {
              const kda = calculateKDA(p.kills, p.deaths, p.assists);
              const isUser = p.puuid === userPuuid;
              return (
                <TableRow key={idx} className={isUser ? 'bg-primary/10' : ''}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={getChampionIconUrl(p.championName, champions) || undefined}
                          alt={p.championName}
                        />
                        <AvatarFallback>
                          {p.championName.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{p.championName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={isUser ? 'font-bold text-primary' : ''}>
                      {p.riotIdGameName}#{p.riotIdTagline}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{p.teamPosition || '-'}</TableCell>
                  <TableCell className="text-center">
                    <div>{p.kills}/{p.deaths}/{p.assists}</div>
                    <div className="text-xs text-primary">{kda}</div>
                  </TableCell>
                  <TableCell className="text-center">{p.totalMinionsKilled + p.neutralMinionsKilled}</TableCell>
                  <TableCell className="text-center">{p.totalDamageDealtToChampions.toLocaleString()}</TableCell>
                  <TableCell className="text-center">{p.goldEarned.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <div>{p.visionScore}</div>
                    <div className="text-xs text-muted-foreground">{p.wardsPlaced}👁️ {p.wardsKilled}🔴</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {[p.item0, p.item1, p.item2, p.item3, p.item4, p.item5, p.item6].map((itemId, i) => (
                        <div key={i} className="w-6 h-6 rounded bg-muted border border-border overflow-hidden">
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
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {match.info.gameMode}
            <span className="text-sm text-muted-foreground ml-4">
              試合時間: {formatGameDuration(match.info.gameDuration)}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* チーム目標 */}
        <div>
          <h3 className="text-xl font-bold mb-4">チーム目標</h3>
          <div className="grid grid-cols-2 gap-4">
            {renderTeamObjectives(team100Info, team100Info?.win || false)}
            {renderTeamObjectives(team200Info, team200Info?.win || false)}
          </div>
        </div>

        <Separator />

        {/* ゴールドグラフ */}
        {!loading && goldData.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4">ゴールド推移</h3>
            <Card>
              <CardContent className="pt-6">
                <div className="h-64 relative bg-muted/30 rounded-lg p-4">
                  <svg width="100%" height="100%" className="overflow-visible">
                    {/* グリッド線 */}
                    {[0, 25, 50, 75, 100].map(percent => (
                      <line
                        key={percent}
                        x1="0"
                        y1={`${percent}%`}
                        x2="100%"
                        y2={`${percent}%`}
                        stroke="hsl(var(--border))"
                        strokeWidth="1"
                      />
                    ))}

                    {/* ブルーチームライン */}
                    <polyline
                      points={goldData.map((d, i) => {
                        const x = (i / (goldData.length - 1)) * 100;
                        const y = 100 - (d.team100Gold / maxGold) * 100;
                        return `${x}%,${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                    />

                    {/* レッドチームライン */}
                    <polyline
                      points={goldData.map((d, i) => {
                        const x = (i / (goldData.length - 1)) * 100;
                        const y = 100 - (d.team200Gold / maxGold) * 100;
                        return `${x}%,${y}%`;
                      }).join(' ')}
                      fill="none"
                      stroke="hsl(var(--destructive))"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
                <div className="flex gap-4 justify-center mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-primary"></div>
                    <span>ブルーチーム</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-destructive"></div>
                    <span>レッドチーム</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Separator />

        {/* 全プレイヤー統計 */}
        <div>
          <h3 className="text-xl font-bold mb-4">詳細統計</h3>
          <div className="space-y-6">
            {renderPlayerTable(team100, 'ブルーチーム', team100Info?.win || false)}
            {renderPlayerTable(team200, 'レッドチーム', team200Info?.win || false)}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
