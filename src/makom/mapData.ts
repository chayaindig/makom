// Illustrated (not to scale) map of the Makom area: Givatayim and Ramat Gan.
// One map serves two stories: the neighbourhood on the public site, and the agent's route for the day.
// All places are generic and illustrative; this is a portfolio concept.

export const MAP_W = 800;
export const MAP_H = 520;

// Streets, drawn as thin architectural lines. Main = boulevards, minor = the grid between them.
export const STREETS = {
  main: [
    'M-20 150 C 160 130, 330 175, 470 150 S 700 110, 820 140', // כצנלסון
    'M-20 360 C 140 345, 300 390, 460 372 S 690 330, 820 350', // בורוכוב
    'M250 -20 C 268 120, 238 260, 262 380 S 292 470, 280 540', // המעגל
    'M590 -20 C 572 140, 610 270, 580 400 S 560 480, 575 540' // ציר הרכבת
  ],
  minor: [
    'M60 -20 L 82 540',
    'M150 -20 L 168 540',
    'M380 -20 C 392 200, 372 360, 390 540',
    'M480 -20 L 470 540',
    'M690 -20 C 676 160, 700 330, 684 540',
    'M-20 60 L 820 74',
    'M-20 250 C 220 262, 520 236, 820 252',
    'M-20 460 L 820 448'
  ]
};

// Street names along the boulevards (illustrative positions)
export const STREET_LABELS = [
  { x: 120, y: 132, text: 'כצנלסון', rotate: -3 },
  { x: 120, y: 344, text: 'בורוכוב', rotate: -2 },
  { x: 232, y: 214, text: 'המעגל', rotate: 86 },
  { x: 604, y: 214, text: 'הרכבת הקלה', rotate: 88 }
];

// Green and civic areas as soft shapes
export const AREAS = [
  { kind: 'park', d: 'M300 190 C 330 175, 410 182, 430 205 S 420 252, 380 258 S 300 250, 296 225 Z', label: 'הפארק' },
  { kind: 'park', d: 'M640 400 C 668 388, 735 395, 740 420 S 712 455, 676 452 S 632 432, 640 400 Z', label: 'גינה קהילתית' }
];

export type PoiKind = 'cafe' | 'park' | 'school' | 'rail';

export const POI_LABELS: Record<PoiKind, string> = {
  cafe: 'בתי קפה',
  park: 'גינות ופארקים',
  school: 'בתי ספר',
  rail: 'תחבורה'
};

export const POIS: { id: string; kind: PoiKind; x: number; y: number; name: string }[] = [
  { id: 'c1', kind: 'cafe', x: 205, y: 175, name: 'בית קפה שכונתי' },
  { id: 'c2', kind: 'cafe', x: 520, y: 330, name: 'קפה ומאפייה' },
  { id: 'c3', kind: 'cafe', x: 330, y: 400, name: 'קפה על הפינה' },
  { id: 'p1', kind: 'park', x: 362, y: 220, name: 'הפארק' },
  { id: 'p2', kind: 'park', x: 690, y: 422, name: 'גינה קהילתית' },
  { id: 's1', kind: 'school', x: 120, y: 290, name: 'בית ספר יסודי' },
  { id: 's2', kind: 'school', x: 520, y: 200, name: 'גן ילדים' },
  { id: 'r1', kind: 'rail', x: 590, y: 130, name: 'תחנת רכבת קלה' },
  { id: 'r2', kind: 'rail', x: 582, y: 390, name: 'תחנת רכבת קלה' }
];

// The three Makom homes on the map, with walking minutes to what matters
export const HOME_PINS = [
  {
    id: 'h1', x: 200, y: 362, street: 'בורוכוב 24', area: 'גבעתיים',
    walk: [{ kind: 'park' as PoiKind, min: 6 }, { kind: 'cafe' as PoiKind, min: 3 }, { kind: 'school' as PoiKind, min: 5 }, { kind: 'rail' as PoiKind, min: 12 }]
  },
  {
    id: 'h2', x: 262, y: 140, street: 'המעגל 8', area: 'רמת גן',
    walk: [{ kind: 'park' as PoiKind, min: 4 }, { kind: 'cafe' as PoiKind, min: 2 }, { kind: 'school' as PoiKind, min: 7 }, { kind: 'rail' as PoiKind, min: 9 }]
  },
  {
    id: 'h3', x: 470, y: 150, street: 'כצנלסון 56', area: 'גבעתיים',
    walk: [{ kind: 'park' as PoiKind, min: 5 }, { kind: 'cafe' as PoiKind, min: 4 }, { kind: 'school' as PoiKind, min: 3 }, { kind: 'rail' as PoiKind, min: 4 }]
  }
];

// Agent's day: office, then the three visits in order
export const OFFICE = { x: 400, y: 300, label: 'המשרד' };
export const ROUTE_STOPS = [
  { time: '09:30', title: 'ביקור בבורוכוב 24', who: 'נועה ואיתי', x: 200, y: 362, drive: '7 דק׳' },
  { time: '12:00', title: 'פגישת היכרות', who: 'מיכל רוזן · בקפה ליד הפארק', x: 450, y: 268, drive: '8 דק׳' },
  { time: '16:30', title: 'ביקור בהמעגל 8', who: 'משפחת שפירא', x: 262, y: 140, drive: '6 דק׳' }
];
// Route along the streets: office -> stop 1 -> stop 2 -> stop 3
export const ROUTE_PATH =
  'M400 300 C 380 330, 300 372, 200 362 C 280 345, 390 305, 450 268 C 410 225, 300 200, 262 140';
