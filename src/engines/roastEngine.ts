import { AppStat, RoastArchetype, RoastResult, UserInputData } from '../types';

export const DEFAULT_APPS: AppStat[] = [
  {
    id: 'tiktok',
    name: 'TikTok',
    hours: 2.5,
    icon: '🎵',
    color: '#ff0050',
    category: 'Short-Form Rot',
    rotMultiplier: 1.5,
  },
  {
    id: 'instagram',
    name: 'Instagram / Reels',
    hours: 2.0,
    icon: '📸',
    color: '#e1306c',
    category: 'Aesthetic Envy',
    rotMultiplier: 1.4,
  },
  {
    id: 'reddit',
    name: 'Reddit',
    hours: 1.5,
    icon: '🤖',
    color: '#ff4500',
    category: 'Pseudointellectual Void',
    rotMultiplier: 1.15,
  },
  {
    id: 'youtube',
    name: 'YouTube',
    hours: 1.5,
    icon: '▶️',
    color: '#ff0000',
    category: 'Rabbit Hole Paralysis',
    rotMultiplier: 1.2,
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    hours: 0.8,
    icon: '⚡',
    color: '#1da1f2',
    category: 'High-Velocity Outrage',
    rotMultiplier: 1.35,
  },
  {
    id: 'dating',
    name: 'Dating Apps',
    hours: 0.5,
    icon: '🔥',
    color: '#fe3c72',
    category: 'Desperation Carousel',
    rotMultiplier: 1.45,
  },
  {
    id: 'gaming',
    name: 'Mobile Games',
    hours: 0.7,
    icon: '🎮',
    color: '#a855f7',
    category: 'Synthetic Dopamine Slot',
    rotMultiplier: 1.3,
  },
];

const ARCHETYPES: RoastArchetype[] = [
  {
    id: 'void-dissociator',
    title: 'The 3 AM Void-Stared Dissociator',
    subtitle: 'Cortisol High, Soul Low',
    tagline: 'Your blue-light tan is your most distinguished physical feature.',
    badge: 'STAGE IV ROT',
    color: '#ec4899',
    hazardLevel: 'TERMINAL',
  },
  {
    id: 'dopamine-bankrupt',
    title: 'Dopamine Bankruptcy Champion',
    subtitle: 'Zero Synaptic Balance Remaining',
    tagline: 'Your dopamine receptors filed for Chapter 11 bankruptcy in 2022.',
    badge: 'UNSALVAGEABLE',
    color: '#ef4444',
    hazardLevel: 'CRITICAL',
  },
  {
    id: 'algorithmic-slime',
    title: 'Algorithmic Slime Mold',
    subtitle: 'Consciousness Bred by ByteDance',
    tagline: 'Your thoughts are just regurgitated 7-second audio clips with subway surfers gameplay.',
    badge: 'BIOHAZARD',
    color: '#22c55e',
    hazardLevel: 'SEVERE',
  },
  {
    id: 'armchair-doom',
    title: 'Subreddit War Criminal',
    subtitle: 'Keyboard Warrior / Shower Avoider',
    tagline: 'Drafts 400-word essays under stranger arguments while your laundry mildews in the basket.',
    badge: 'TOXIC DISCOURSE',
    color: '#f97316',
    hazardLevel: 'ELEVATED',
  },
  {
    id: 'parasocial-parasite',
    title: 'Parasocial Hostage',
    subtitle: 'Knows Influencers Better Than Own Family',
    tagline: 'Deeply invested in the personal drama of people who wouldn’t cross the street to spit on you.',
    badge: 'DELUSIONAL',
    color: '#a855f7',
    hazardLevel: 'SEVERE',
  },
  {
    id: 'swipe-right-zombie',
    title: 'The Validation Beggar',
    subtitle: 'Carrying Carpal Tunnel From Swiping',
    tagline: 'Left-swiping actual potential while holding out for an imaginary 10 who hates texting back.',
    badge: 'DESPERATION MAX',
    color: '#06b6d4',
    hazardLevel: 'ELEVATED',
  },
  {
    id: 'late-stage-scroll-corpse',
    title: 'Late-Stage Screen Rot Entity',
    subtitle: 'Biological Chassis Powered by Lithium-Ion',
    tagline: 'If your phone screen goes black, you see a terrifying reflection of pure existential panic.',
    badge: 'CODE RED',
    color: '#eab308',
    hazardLevel: 'TERMINAL',
  },
];

export function calculateRoast(input: UserInputData): RoastResult {
  const age = Math.min(Math.max(input.age || 23, 14), 70);
  const activeApps = input.apps.filter((a) => a.hours > 0);

  // Compute daily hours
  const totalDailyHours = Number(
    activeApps.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1)
  );

  // Sort apps descending by hours
  const sortedApps = [...activeApps].sort((a, b) => b.hours - a.hours);
  const topApp = sortedApps[0] || DEFAULT_APPS[0];
  const secondApp = sortedApps[1] || DEFAULT_APPS[1];

  // Mathematical Lifetime Projection (based on 75 yr lifespan)
  const remainingYears = Math.max(5, 75 - age);
  const totalDaysRemaining = remainingYears * 365.25;

  // Days spent staring at phone (24h continuous equivalent)
  const daysWastedLifetime = Math.round(
    (totalDailyHours * totalDaysRemaining) / 24
  );

  // Years of waking consciousness lost (assuming 16 waking hours/day)
  const yearsWastedLifetime = Number(
    ((totalDailyHours / 16) * remainingYears).toFixed(1)
  );

  // Percentage of waking life consumed by screens
  const percentWakingLifeLost = Math.min(
    99,
    Math.round((totalDailyHours / 16) * 100)
  );

  // Brain-rot score calculation (weighted by app rot multipliers)
  let weightedHours = 0;
  activeApps.forEach((a) => {
    weightedHours += a.hours * a.rotMultiplier;
  });

  const rawScore = Math.min(
    99,
    Math.round((weightedHours / 10) * 100)
  );
  const brainRotScore = Math.max(28, rawScore);

  let brainRotTier = 'Mild Doomscroller';
  if (brainRotScore > 88) {
    brainRotTier = 'Terminal Stage IV Rot';
  } else if (brainRotScore > 75) {
    brainRotTier = 'Severe Dopamine Deficit';
  } else if (brainRotScore > 55) {
    brainRotTier = 'Chronic Algorithmic Sludge';
  } else if (brainRotScore > 40) {
    brainRotTier = 'Elevated Screen Addiction';
  }

  // Determine Archetype
  let archetype = ARCHETYPES[0];
  if (totalDailyHours >= 8.5) {
    archetype = ARCHETYPES[1]; // Dopamine bankruptcy
  } else if (topApp.id === 'tiktok' || (topApp.id === 'instagram' && topApp.hours > 2.5)) {
    archetype = ARCHETYPES[2]; // Algorithmic Slime Mold
  } else if (topApp.id === 'reddit' || topApp.id === 'twitter') {
    archetype = ARCHETYPES[3]; // Subreddit War Criminal
  } else if (topApp.id === 'youtube') {
    archetype = ARCHETYPES[4]; // Parasocial Hostage
  } else if (topApp.id === 'dating') {
    archetype = ARCHETYPES[5]; // Validation Beggar
  } else if (totalDailyHours >= 6.0) {
    archetype = ARCHETYPES[6]; // Late-Stage Screen Rot Entity
  } else {
    archetype = ARCHETYPES[0];
  }

  // Attention span: baseline 5.0s, degraded by hours
  const attentionSpanSeconds = Math.max(
    0.6,
    Number((4.5 - totalDailyHours * 0.38).toFixed(1))
  );

  // Dopamine debt estimate ($)
  const dopamineDebtDollars = Math.round(
    totalDailyHours * 365 * 18.5 * (brainRotScore / 50)
  );

  // Tailored Brutal Roasts
  const { primaryRoast, secondaryRoast, unfilteredRoast } = generateRoastTexts(
    topApp,
    secondApp,
    totalDailyHours,
    yearsWastedLifetime,
    age,
    archetype
  );

  return {
    archetype,
    brainRotScore,
    brainRotTier,
    dailyHours: totalDailyHours,
    daysWastedLifetime,
    yearsWastedLifetime,
    percentWakingLifeLost,
    primaryRoast,
    secondaryRoast,
    unfilteredRoast,
    attentionSpanSeconds,
    dopamineDebtDollars,
    topApps: sortedApps.slice(0, 3),
    isUnlocked: false,
  };
}

function generateRoastTexts(
  topApp: AppStat,
  secondApp: AppStat,
  dailyHours: number,
  yearsWasted: number,
  age: number,
  archetype: RoastArchetype
): { primaryRoast: string; secondaryRoast: string; unfilteredRoast: string } {
  let primary = '';
  let secondary = '';
  let unfiltered = '';

  // App-specific brutalism
  if (topApp.id === 'tiktok') {
    primary = `You spend ${topApp.hours} hours a day letting a Beijing neural net liquefy your prefrontal cortex with sped-up pop songs. Your attention span is officially shorter than a microwave beep, and you haven't had an original thought since 2021.`;
  } else if (topApp.id === 'instagram') {
    primary = `Logging ${topApp.hours} hours daily doom-scrolling filtered vacations of people who wouldn’t remember your face in an elevator. You are actively trading your biological prime to envy rented Lamborghinis and curated couples who fight off-camera.`;
  } else if (topApp.id === 'reddit') {
    primary = `Spending ${topApp.hours} hours a day absorbing lukewarm pseudo-intellectual takes from teenagers pretending to be economists. You have 45 tabs open about geopolitical crises while your real-life sink is overflowing with dirty dishes.`;
  } else if (topApp.id === 'youtube') {
    primary = `You've clocked ${topApp.hours} daily hours trapped in 4-hour video essays analyzing TV shows you didn't even watch. You treat video essayists like close personal friends because talking to humans in the sunlight gives you tachycardia.`;
  } else if (topApp.id === 'twitter') {
    primary = `Consuming ${topApp.hours} hours of unadulterated radioactive anger every single day. You are voluntarily marinating your nervous system in rage-bait authored by verified bots with anime profile pictures.`;
  } else if (topApp.id === 'dating') {
    primary = `Spending ${topApp.hours} hours a day swiping through strangers like meat cuts on a conveyor belt. You reject decent people because their horoscope is off, yet your ideal Friday night is eating cold leftover pizza in bed with 1% battery.`;
  } else {
    primary = `You burn ${dailyHours} hours a day staring at glowing silicon. If your phone battery drops under 15%, you experience the exact same physiological panic response as a gazelle hunted by a cheetah.`;
  }

  // Secondary projection utilizing second app and archetype
  const secondAppContext = secondApp && secondApp.hours > 0
    ? ` Paired with ${secondApp.hours} hours on ${secondApp.name}, your neural pathways resemble lukewarm porridge.`
    : '';

  secondary = `At age ${age}, classified as "${archetype.title}", you are statistically on track to spend ${yearsWasted} YEARS of pure, conscious waking existence staring at glass.${secondAppContext} You could have mastered 3 languages and built an empire; instead, you know all the lore behind a micro-influencer's dog divorce.`;

  // Devastating Unfiltered Deep Roast (Unlocked with SSV)
  unfiltered = `🚨 DEEP UNFILTERED FORENSIC AUTOPSY:
You are not "relaxing" after a hard day—you are executing a daily digital lobotomy to avoid feeling the crushing weight of your unfulfilled potential. Your thumb has logged more miles across an OLED screen than your legs have walked outside this month.

When you look back at your 20s and 30s, your memories won't be adventures or laughter; they'll be glowing thumbnails, loading spinners, and the cold dread of realizing you spent ${yearsWasted} years of your mortal existence as an unpaid training set for targeted advertising algorithms. Put the damn phone down and touch soil.`;

  return {
    primaryRoast: primary,
    secondaryRoast: secondary,
    unfilteredRoast: unfiltered,
  };
}
