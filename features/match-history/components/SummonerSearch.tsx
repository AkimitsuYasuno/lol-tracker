/**
 * サモナー検索フォームコンポーネント
 */

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface SummonerSearchProps {
  gameName: string;
  tagLine: string;
  loading: boolean;
  error: string;
  onGameNameChange: (value: string) => void;
  onTagLineChange: (value: string) => void;
  onSearch: () => void;
}

export default function SummonerSearch({
  gameName,
  tagLine,
  loading,
  error,
  onGameNameChange,
  onTagLineChange,
  onSearch,
}: SummonerSearchProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-md border-border/50 p-6 mb-8 shadow-2xl">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-foreground text-sm font-medium mb-2">
            サモナー名
          </label>
          <Input
            type="text"
            value={gameName}
            onChange={(e) => onGameNameChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="例: Hide on bush"
            className="bg-background/50 text-foreground placeholder:text-muted-foreground border-border"
          />
        </div>
        <div className="flex-1">
          <label className="block text-foreground text-sm font-medium mb-2">
            タグライン
          </label>
          <Input
            type="text"
            value={tagLine}
            onChange={(e) => onTagLineChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="例: KR1"
            className="bg-background/50 text-foreground placeholder:text-muted-foreground border-border"
          />
        </div>
        <Button
          onClick={onSearch}
          disabled={loading}
          size="lg"
          className="bg-primary hover:bg-primary/90"
        >
          {loading ? '検索中...' : '検索'}
        </Button>
      </div>
      {error && (
        <p className="mt-4 text-destructive-foreground bg-destructive/20 px-4 py-2 rounded-md border border-destructive/50">
          {error}
        </p>
      )}
    </Card>
  );
}
