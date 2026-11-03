export interface AppStat {
  id: string;
  name: string;
  hours: number;
  icon: string;
  color: string;
  category: string;
  rotMultiplier: number;
}

export interface UserInputData {
  age: number;
  apps: AppStat[];
  screenshotFile?: File | null;
  screenshotDataUrl?: string;
  rawEstimatedHours?: number;
}

export interface RoastArchetype {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  color: string;
  hazardLevel: 'MILD' | 'ELEVATED' | 'SEVERE' | 'CRITICAL' | 'TERMINAL';
}

export interface RoastResult {
  archetype: RoastArchetype;
  brainRotScore: number; // 0 - 100
  brainRotTier: string;
  dailyHours: number;
  daysWastedLifetime: number;
  yearsWastedLifetime: number;
  percentWakingLifeLost: number;
  primaryRoast: string;
  secondaryRoast: string;
  unfilteredRoast: string;
  attentionSpanSeconds: number;
  dopamineDebtDollars: number;
  topApps: AppStat[];
  isUnlocked: boolean; // True when rewarded ad watched & SSV verified
  ssvProof?: {
    txId: string;
    signature: string;
    timestamp: string;
  };
}

export type ScreenState = 'input' | 'terminal' | 'roast';
