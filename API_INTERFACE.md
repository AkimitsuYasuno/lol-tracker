# API Interface Documentation

このドキュメントは、フロントエンドとバックエンド間のAPI仕様を定義します。
将来的にPythonバックエンドに移行する際、このインターフェースを維持することで
フロントエンドの変更を最小限に抑えることができます。

## 環境変数

```bash
# APIのベースURL（Pythonバックエンドに移行する際に変更）
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

未設定の場合は、Next.jsの内部APIルート（`/api/*`）が使用されます。

---

## エンドポイント一覧

### 1. サマナー情報取得

**エンドポイント:** `GET /api/summoner`

**クエリパラメータ:**
- `gameName` (string, required): Riot ID のゲーム名
- `tagLine` (string, required): Riot ID のタグライン

**レスポンス:**
```typescript
{
  account: {
    puuid: string;
    gameName: string;
    tagLine: string;
  };
  summoner: {
    id: string;
    accountId: string;
    puuid: string;
    profileIconId: number;
    summonerLevel: number;
  };
}
```

**エラーレスポンス:**
```typescript
{
  error: string;  // エラーメッセージ
}
```

---

### 2. マッチ履歴取得

**エンドポイント:** `GET /api/matches`

**クエリパラメータ:**
- `puuid` (string, required): プレイヤーのPUUID
- `count` (number, optional): 取得する試合数（デフォルト: 10）

**レスポンス:**
```typescript
{
  matches: Array<{
    metadata: {
      matchId: string;
      participants: string[];  // PUUIDs
    };
    info: {
      gameCreation: number;  // タイムスタンプ (ms)
      gameDuration: number;  // 秒
      gameId: number;
      gameMode: string;
      gameType: string;
      queueId: number;
      teams: Array<{
        teamId: number;
        win: boolean;
        objectives: {
          baron: { kills: number };
          dragon: { kills: number };
          tower: { kills: number };
          inhibitor: { kills: number };
          riftHerald: { kills: number };
        };
        bans: Array<{
          championId: number;
          pickTurn: number;
        }>;
      }>;
      participants: Array<{
        puuid: string;
        summonerName: string;
        riotIdGameName: string;
        riotIdTagline: string;
        championName: string;
        championId: number;
        kills: number;
        deaths: number;
        assists: number;
        win: boolean;
        teamId: number;
        teamPosition: string;
        totalDamageDealtToChampions: number;
        totalDamageTaken: number;
        goldEarned: number;
        totalMinionsKilled: number;
        neutralMinionsKilled: number;
        wardsPlaced: number;
        wardsKilled: number;
        visionScore: number;
        item0: number;
        item1: number;
        item2: number;
        item3: number;
        item4: number;
        item5: number;
        item6: number;
        summoner1Id: number;
        summoner2Id: number;
        perks: {
          styles: Array<{
            selections: Array<{
              perk: number;
            }>;
          }>;
        };
      }>;
    };
  }>;
}
```

---

### 3. チャンピオン情報取得

**エンドポイント:** `GET /api/champions`

**レスポンス:**
```typescript
{
  version: string;  // Data Dragon バージョン
  champions: {
    [championKey: string]: {
      id: string;
      key: string;
      name: string;
      title: string;
      image: {
        full: string;  // ファイル名
      };
    };
  };
}
```

**備考:**
- このデータはRiot Games Data Dragon APIから取得
- キャッシュ推奨（バージョンが変わるまで不変）

---

### 4. マッチタイムライン取得

**エンドポイント:** `GET /api/match-timeline`

**クエリパラメータ:**
- `matchId` (string, required): マッチID

**レスポンス:**
```typescript
{
  timeline: {
    metadata: {
      matchId: string;
    };
    info: {
      frameInterval: number;  // フレーム間隔（ミリ秒）
      frames: Array<{
        timestamp: number;  // ミリ秒
        participantFrames: {
          [participantId: string]: {
            participantId: number;
            totalGold: number;
            level: number;
            currentGold: number;
            xp: number;
            minionsKilled: number;
            jungleMinionsKilled: number;
            position: {
              x: number;
              y: number;
            };
          };
        };
        events: Array<{
          type: string;
          timestamp: number;
          participantId?: number;
          killerId?: number;
          victimId?: number;
          assistingParticipantIds?: number[];
          position?: {
            x: number;
            y: number;
          };
          teamId?: number;
          monsterType?: string;
          killType?: string;
        }>;
      }>;
    };
  };
}
```

---

## Pythonバックエンド移行時の手順

### 1. 環境変数の設定

`.env.local` ファイルを作成:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 2. Pythonバックエンドの実装

FastAPIやFlaskなどを使用して、上記のエンドポイントを実装します。

例（FastAPI）:
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/summoner")
async def get_summoner(gameName: str, tagLine: str):
    # Riot APIを使用してサマナー情報を取得
    # 上記のレスポンス形式に従って返す
    pass

@app.get("/api/matches")
async def get_matches(puuid: str, count: int = 10):
    # マッチ履歴を取得
    pass

# 他のエンドポイントも同様に実装
```

### 3. Riot API キーの管理

Pythonバックエンド側で環境変数として管理:
```python
import os
RIOT_API_KEY = os.getenv("RIOT_API_KEY")
```

### 4. フロントエンドの変更

`app/services/riotApi.ts` のAPI呼び出しは変更不要です。
環境変数 `NEXT_PUBLIC_API_BASE_URL` を設定するだけで、
自動的に新しいバックエンドに接続されます。

---

## レート制限の考慮事項

Riot APIにはレート制限があります：
- 開発用キー: 20リクエスト/秒、100リクエスト/2分
- 本番用キー: より高い制限

Pythonバックエンドでは以下の対策を推奨：
1. Redis等を使用したキャッシング
2. レート制限の管理（例: `pyrate-limiter`）
3. リトライロジックの実装

---

## データキャッシュ戦略

効率的なAPI利用のため、以下のデータはキャッシュを推奨：

1. **チャンピオン情報**: 24時間〜パッチまで
2. **サマナー情報**: 1時間
3. **マッチデータ**: 永続的（試合結果は不変）
4. **タイムラインデータ**: 永続的

Pythonでの実装例（Redis）:
```python
import redis
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def get_cached_match(match_id: str):
    cached = redis_client.get(f"match:{match_id}")
    if cached:
        return json.loads(cached)
    return None

def cache_match(match_id: str, data: dict):
    redis_client.set(f"match:{match_id}", json.dumps(data))
```

---

## エラーハンドリング

すべてのエンドポイントは、エラー時に以下の形式を返す必要があります：

```typescript
{
  error: string;  // ユーザーに表示可能なエラーメッセージ
}
```

HTTPステータスコード:
- `200`: 成功
- `400`: リクエストパラメータエラー
- `404`: リソースが見つからない
- `500`: サーバーエラー

---

## セキュリティ

1. **API キーの保護**: フロントエンドに露出させない
2. **CORS設定**: 適切なオリジン制限
3. **レート制限**: ユーザーごとのリクエスト制限
4. **入力検証**: すべてのパラメータを検証

---

このインターフェース定義に従うことで、バックエンドをNext.jsからPythonに
スムーズに移行できます。
