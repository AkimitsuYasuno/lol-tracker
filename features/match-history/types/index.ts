export interface Account {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface Summoner {
  id: string;
  accountId: string;
  puuid: string;
  profileIconId: number;
  summonerLevel: number;
  name?: string;
}

export interface SummonerData {
  account: Account;
  summoner: Summoner;
}

export interface Participant {
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
}

export interface Team {
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
}

export interface MatchInfo {
  gameCreation: number;
  gameDuration: number;
  gameId: number;
  gameMode: string;
  gameType: string;
  queueId: number;
  teams: Team[];
}

export interface Match {
  metadata: {
    matchId: string;
    participants: string[];
  };
  info: MatchInfo & {
    participants: Participant[];
  };
}

export interface Champion {
  id: string;
  key: string;
  name: string;
  title: string;
  image: {
    full: string;
  };
}

export interface ChampionsData {
  version: string;
  champions: Record<string, Champion>;
}

export interface TimelineFrame {
  timestamp: number;
  participantFrames: Record<string, {
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
  }>;
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
}

export interface Timeline {
  metadata: {
    matchId: string;
  };
  info: {
    frameInterval: number;
    frames: TimelineFrame[];
  };
}
