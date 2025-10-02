'use client';

import { useState } from 'react';
import { Match } from '@/features/match-history/types';
import { useSummoner } from '@/features/match-history/hooks/useSummoner';
import SummonerSearch from '@/features/match-history/components/SummonerSearch';
import SummonerProfile from '@/features/match-history/components/SummonerProfile';
import MatchList from '@/features/match-history/components/MatchList';
import MatchDetailModal from '@/features/match-history/components/MatchDetailModal';

export default function Home() {
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const {
    summonerData,
    matches,
    champions,
    loading,
    error,
    searchSummoner,
  } = useSummoner();

  const handleSearch = () => {
    searchSummoner(gameName, tagLine);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--lol-bg-start))] via-[hsl(var(--lol-bg-via))] to-[hsl(var(--lol-bg-end))] p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">
            League of Legends
          </h1>
          <p className="text-xl text-blue-200">戦績トラッカー</p>
        </header>

        {/* 検索フォーム */}
        <SummonerSearch
          gameName={gameName}
          tagLine={tagLine}
          loading={loading}
          error={error}
          onGameNameChange={setGameName}
          onTagLineChange={setTagLine}
          onSearch={handleSearch}
        />

        {/* サモナー情報 */}
        {summonerData && <SummonerProfile summonerData={summonerData} />}

        {/* マッチ履歴 */}
        {summonerData && champions && (
          <MatchList
            matches={matches}
            champions={champions}
            userPuuid={summonerData.account.puuid}
            onMatchClick={setSelectedMatch}
          />
        )}

        {/* 空の状態 */}
        {!summonerData && !loading && (
          <div className="text-center text-white/60 mt-20">
            <p className="text-xl">
              サモナー名を入力して検索してください
            </p>
            <p className="text-sm mt-2">
              例: サモナー名「Hide on bush」、タグライン「KR1」
            </p>
          </div>
        )}

        {/* 試合詳細モーダル */}
        {selectedMatch && champions && summonerData && (
          <MatchDetailModal
            match={selectedMatch}
            champions={champions}
            userPuuid={summonerData.account.puuid}
            onClose={() => setSelectedMatch(null)}
          />
        )}
      </div>
    </div>
  );
}
