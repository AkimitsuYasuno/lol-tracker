# League of Legends 戦績トラッカー

Riot APIを使用してLoL（League of Legends）のサモナー情報、マッチ履歴、詳細統計を表示するWebアプリケーション。

## 🎯 主な機能

### 現在実装済み
- ✅ サモナー検索（Riot ID対応）
- ✅ マッチ履歴表示（最近10試合）
- ✅ 詳細な試合統計
  - KDA、CS、ダメージ、ゴールド
  - チーム目標（ドラゴン、バロン、タワーなど）
  - ゴールド推移グラフ
  - 全プレイヤーの統計テーブル
- ✅ レスポンシブデザイン

### 将来の拡張機能
- 🚧 チャンピオン統計分析
- 🚧 カウンターピック提案
- 🚧 プレイヤー比較機能
- 🚧 ランクトラッキング

## 🏗️ アーキテクチャ

### Feature-Based構造
```
lol-tracker/
├── features/                 # 機能別モジュール
│   └── match-history/       # マッチ履歴機能
│       ├── components/      # 機能専用コンポーネント
│       ├── hooks/           # カスタムフック
│       └── types/           # 型定義
├── components/              # 共有コンポーネント
│   └── ui/                  # shadcn/ui コンポーネント
├── services/                # API サービス層
├── utils/                   # ユーティリティ関数
└── app/                     # Next.js App Router
```

詳細は [ARCHITECTURE.md](./ARCHITECTURE.md) を参照。

## 🎨 テーマシステム

CSS変数でテーマカラーを簡単に変更可能：

```css
/* app/globals.css */
:root {
  --primary: 221.2 83.2% 53.3%;  /* メインカラー */
  --lol-blue: 221.2 83.2% 53.3%; /* LoL ブルー */
  --lol-red: 0 84.2% 60.2%;      /* LoL レッド */
  --lol-gold: 45 93% 47%;        /* LoL ゴールド */
}
```

## 🚀 セットアップ

### 必要要件
- Node.js 18+
- npm / yarn / pnpm

### インストール

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 環境変数

`.env.local` ファイルを作成：

```bash
# Riot API キー（必須）
RIOT_API_KEY=your_riot_api_key_here

# バックエンドURL（オプション、Pythonバックエンド使用時）
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Riot API キーは [Riot Developer Portal](https://developer.riotgames.com/) で取得できます。

## 🔧 技術スタック

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **API**: Riot Games API + Data Dragon

## 📚 ドキュメント

- [アーキテクチャ設計](./ARCHITECTURE.md) - プロジェクト構造と設計方針
- [API仕様書](./API_INTERFACE.md) - バックエンドAPI仕様（Python移行用）

## 🐍 Pythonバックエンドへの移行

将来的にPythonバックエンドに移行する場合：

1. `API_INTERFACE.md` に従ってPython APIを実装
2. 環境変数 `NEXT_PUBLIC_API_BASE_URL` を設定
3. フロントエンドのコード変更は不要！

詳細は [API_INTERFACE.md](./API_INTERFACE.md) を参照。

## 🎯 使い方

1. アプリを起動: `npm run dev`
2. ブラウザで http://localhost:3000 を開く
3. サモナー名とタグラインを入力
   - 例: `Hide on bush` + `KR1`
4. マッチ履歴から試合をクリックして詳細を表示

## 📝 開発ガイド

### 新しい機能の追加

1. `features/` に新しいフォルダを作成
   ```
   features/your-feature/
   ├── components/
   ├── hooks/
   └── types/
   ```

2. 機能専用のコンポーネントとロジックを実装

3. `app/` でルーティングを設定

### コンポーネント配置ルール

- **Feature専用**: `features/{feature}/components/`
- **全体共有**: `components/`
- **UI基本**: `components/ui/` (shadcn/ui)

### インポートパス

```tsx
// エイリアスを使用（推奨）
import { Button } from "@/components/ui/button";
import { useSummoner } from "@/features/match-history/hooks/useSummoner";

// 相対パスは避ける
import { Button } from "../../../components/ui/button";  // ❌
```

## 🤝 コントリビューション

プルリクエスト歓迎！

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

MIT License

## 🙏 謝辞

- [Riot Games](https://www.riotgames.com/) - API提供
- [shadcn/ui](https://ui.shadcn.com/) - UIコンポーネント
- [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) - 静的アセット

---

**Note**: このプロジェクトはRiot Gamesによって承認されたものではなく、Riot Gamesまたはリーグ・オブ・レジェンドの制作・管理に正式に関与している者の見解や意見を反映するものではありません。
