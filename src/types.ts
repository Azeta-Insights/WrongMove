export type InteractionType = 'tap' | 'drag' | 'hold' | 'swipe' | 'none';

export type ShapeType = 'rect' | 'circle';

export interface GameObject {
  id: string;
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  radius?: number;
  shape: ShapeType;
  mass: number; // 0 = static / immovable unless interacted
  isStatic: boolean;
  isInteractive: boolean;
  interactionType: InteractionType;
  color: string;
  accentColor?: string;
  label?: string;
  emoji?: string;
  rotation: number; // in radians
  angularVelocity: number;
  restitution: number; // bounciness (0-1)
  friction: number; // surface friction (0-1)
  isBeingDragged?: boolean;
  holdProgress?: number; // 0-1 for hold interaction
  state?: Record<string, any>;
  tags?: string[]; // e.g. ['target', 'danger', 'obstacle', 'character', 'cake']
  customRenderKey?: string; // key for custom visual rendering
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'star' | 'square' | 'rainbow';
}

export type WorldId = 1 | 2 | 3 | 4;

export interface WorldDefinition {
  id: WorldId;
  name: string;
  title: string;
  subtitle: string;
  minStarsRequired: number;
  levelIds: number[];
  themeColor: string;
  bgColor: string;
  bgGradient: string;
  icon: string;
}

export interface LevelDefinition {
  id: number;
  worldId: WorldId;
  title: string;
  objective: string;
  hint?: string;
  timeLimit?: number; // optional countdown in seconds
  maxInteractionsFor2Stars?: number;
  createObjects: () => GameObject[];
  environment: {
    gravity: number; // pixels/s^2, default ~980
    groundY: number; // ground level in game coordinates (0-1000 scale)
    wallLeft: number;
    wallRight: number;
    windX?: number; // wind force
    waterLineY?: number; // water surface Y
  };
  checkConditions: (
    objects: GameObject[],
    stats: LevelStats,
    dt: number
  ) => {
    isComplete: boolean;
    isFailed: boolean;
    isSecret: boolean;
    failReason?: string;
  };
}

export interface LevelStats {
  interactionsCount: number;
  timeElapsed: number;
  secretFound: boolean;
  primaryFound: boolean;
  isComplete: boolean;
  isFailed: boolean;
  failReason?: string;
}

export interface PlayerProgress {
  currentLevelId: number;
  unlockedWorlds: number[];
  starsByLevel: Record<number, number>; // levelId -> stars (0-3)
  secretDiscoveredByLevel: Record<number, boolean>; // levelId -> bool
  coins: number;
  unlockedCharacters: string[];
  selectedCharacter: string;
  unlockedEffects: string[];
  selectedEffect: string;
  soundMuted: boolean;
  devMode: boolean;
  dailyChallengeLastCompletedDate?: string;
}

export interface CharacterItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description: string;
  bgColor: string;
}

export interface EffectItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  description: string;
  colors: string[];
}
