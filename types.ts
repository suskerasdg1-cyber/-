export interface Move {
  name: string;
  type: string;
  power?: number; // Optional, as AI can determine impact
}

export interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  maxHp: number;
  moves: Move[];
  spriteFront: string;
  spriteBack: string;
  color: string;
}

export interface TurnResult {
  playerDamage: number;
  opponentDamage: number;
  commentary: string;
  opponentMove: string;
  playerCrit: boolean;
  opponentCrit: boolean;
  effectiveness: 'neutral' | 'super' | 'not_very';
  winner: 'player' | 'opponent' | null;
}

export enum GameState {
  SELECTING = 'SELECTING',
  BATTLE = 'BATTLE',
  GAME_OVER = 'GAME_OVER',
}
