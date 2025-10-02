# Architecture Documentation

## フォルダ構造

```
lol-tracker/
├── app/                          # Next.js App Router
│   ├── (features)/              # Feature-based routing
│   │   ├── match-history/       # マッチ履歴機能
│   │   ├── champion-stats/      # チャンピオン統計機能（将来）
│   │   └── counter-picks/       # カウンターピック提案機能（将来）
│   ├── api/                     # API Routes (Next.js backend)
│   │   ├── summoner/
│   │   ├── matches/
│   │   ├── champions/
│   │   └── match-timeline/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── features/                     # Feature modules
│   ├── match-history/
│   │   ├── components/          # Feature-specific components
│   │   │   ├── SummonerSearch.tsx
│   │   │   ├── SummonerProfile.tsx
│   │   │   ├── MatchList.tsx
│   │   │   ├── MatchCard.tsx
│   │   │   └── MatchDetailModal.tsx
│   │   ├── hooks/               # Feature-specific hooks
│   │   │   ├── useSummoner.ts
│   │   │   └── useMatchTimeline.ts
│   │   └── types/               # Feature-specific types
│   │       └── index.ts
│   │
│   ├── champion-stats/          # 将来の機能
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types/
│   │
│   └── counter-picks/           # 将来の機能
│       ├── components/
│       ├── hooks/
│       └── types/
│
├── components/                   # Shared components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── chart.tsx
│   └── layout/                  # Layout components
│       ├── Header.tsx
│       └── Footer.tsx
│
├── lib/                         # Shared utilities
│   ├── utils.ts                 # cn() and other utilities
│   └── constants.ts             # Global constants
│
├── services/                    # API service layer
│   ├── riotApi.ts              # Riot API calls
│   └── types.ts                # Shared API types
│
├── hooks/                       # Shared hooks
│   └── useTheme.ts             # Theme management
│
├── utils/                       # Utility functions
│   ├── formatters.ts           # Data formatting
│   └── championHelper.ts       # Champion helpers
│
└── public/                      # Static assets

```

## Features 構成の利点

### 1. **機能ごとの独立性**
各機能は独自のコンポーネント、hooks、typesを持ち、他の機能に依存しません。

### 2. **スケーラビリティ**
新しい機能（カウンターピック提案など）を追加する際、新しいfeatureフォルダを作成するだけ。

### 3. **コードの発見性**
機能に関連するすべてのコードが1つのフォルダにまとまっているため、見つけやすい。

### 4. **チーム開発に最適**
異なるチームメンバーが異なる機能を並行して開発できる。

## テーマシステム

### CSS変数による柔軟なテーマ管理

`app/globals.css` でテーマカラーを定義：

```css
:root {
  --primary: 221.2 83.2% 53.3%;  /* LoL Blue */
  --destructive: 0 84.2% 60.2%;   /* LoL Red */

  /* Custom colors */
  --lol-blue: 221.2 83.2% 53.3%;
  --lol-red: 0 84.2% 60.2%;
  --lol-gold: 45 93% 47%;
}
```

### テーマの変更方法

1. **`app/globals.css`を編集**
   ```css
   :root {
     --primary: 120 100% 50%;  /* 緑に変更 */
   }
   ```

2. **カスタムカラーの使用**
   ```tsx
   <div className="bg-primary text-primary-foreground">
   ```

3. **LoL専用カラーの使用**
   ```tsx
   <div className="text-[hsl(var(--lol-gold))]">
   ```

## 共有コンポーネント (shadcn/ui)

shadcn/uiコンポーネントは `components/ui/` に配置され、
プロジェクト全体で再利用可能です。

### 使用例

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

<Button variant="default">検索</Button>
<Card>...</Card>
```

## 将来の拡張機能

### 1. チャンピオン統計 (champion-stats)
```
features/champion-stats/
├── components/
│   ├── ChampionList.tsx
│   ├── ChampionDetail.tsx
│   └── WinRateChart.tsx
├── hooks/
│   └── useChampionStats.ts
└── types/
    └── index.ts
```

### 2. カウンターピック提案 (counter-picks)
```
features/counter-picks/
├── components/
│   ├── CounterPickSelector.tsx
│   ├── CounterList.tsx
│   └── MatchupAnalysis.tsx
├── hooks/
│   └── useCounterPicks.ts
└── types/
    └── index.ts
```

### 3. プレイヤー比較 (player-comparison)
```
features/player-comparison/
├── components/
│   ├── PlayerSelector.tsx
│   ├── ComparisonChart.tsx
│   └── StatComparison.tsx
└── ...
```

## Pythonバックエンド移行時の変更点

`services/riotApi.ts` のエンドポイントURLのみ変更：

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
```

環境変数で切り替え：
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## ベストプラクティス

### 1. コンポーネント配置
- **Feature-specific**: そのfeatureでしか使わない → `features/{feature}/components/`
- **Shared**: 複数のfeatureで使う → `components/`
- **UI**: shadcn/ui基本コンポーネント → `components/ui/`

### 2. Hooks配置
- **Feature-specific**: そのfeatureのロジック → `features/{feature}/hooks/`
- **Shared**: 共通ロジック → `hooks/`

### 3. Types配置
- **Feature-specific**: その機能専用の型 → `features/{feature}/types/`
- **API**: API型定義 → `services/types.ts`

### 4. インポートパス
```tsx
// Good: エイリアス使用
import { Button } from "@/components/ui/button";
import { useSummoner } from "@/features/match-history/hooks/useSummoner";

// Avoid: 相対パス
import { Button } from "../../../components/ui/button";
```

## パフォーマンス最適化

### 1. コード分割
各featureは独立しているため、Dynamic Importで遅延読み込み可能：

```tsx
const CounterPicks = dynamic(() => import('@/features/counter-picks'));
```

### 2. 型の再利用
共通のAPI型は `services/types.ts` で定義し、各featureで再利用。

### 3. コンポーネントの再利用
shadcn/uiコンポーネントを活用して、一貫性のあるUIを効率的に構築。
