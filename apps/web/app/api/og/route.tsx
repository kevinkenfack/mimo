import { Resvg } from '@resvg/resvg-js';
import { createMimo } from 'mimo-id';
import type { NextRequest } from 'next/server';

// ── Detail visibility (same logic as mimo-id) ─────────────────────────────

const DETAIL_ORDER = ['minimal', 'basic', 'standard', 'full'];
const SLOT_MIN_DETAIL: Record<string, string> = {
  eyes: 'minimal',
  mouth: 'basic',
  eyebrows: 'standard',
  cheeks: 'full',
  accessory: 'full',
};

function canRenderSlot(slot: string, detail: string): boolean {
  return DETAIL_ORDER.indexOf(detail) >= DETAIL_ORDER.indexOf(SLOT_MIN_DETAIL[slot]);
}

// ── SVG surgery helpers ─────────────────────────────────────────────────────

function parseViewBox(svgStr: string): { w: number; h: number } {
  const m = svgStr.match(/viewBox="[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)"/);
  return m ? { w: Number(m[1]), h: Number(m[2]) } : { w: 1, h: 1 };
}

function positionFeatureSvg(raw: string, x: number, y: number, w: number, h: number): string {
  return raw
    .replace(/<svg([^>]*?) style="[^"]*"/, '<svg$1')
    .replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" overflow="visible" `)
    .replaceAll('currentColor', '#000');
}

// ── Render a single avatar fragment at specified (x, y, size) ──────────────

interface AvatarConfig {
  name: string;
  x: number;
  y: number;
  size: number;
  shape: 'circle' | 'squircle' | 'square';
  depth: 'none' | 'subtle' | 'medium' | 'dramatic';
  detailLevel: 'minimal' | 'basic' | 'standard' | 'full';
  mood?: 'happy' | 'surprised' | 'sleepy' | 'cool' | 'cheeky';
  background: 'gradient' | 'solid';
}

function renderAvatarFragment(config: AvatarConfig, index: number) {
  const { name, x, y, size, shape, depth, detailLevel, mood, background } = config;

  const result = createMimo({
    name,
    size,
    shape,
    depth,
    detailLevel,
    mood,
    background,
  });
  const { svg, slots } = result;

  const showAccessories = canRenderSlot('accessory', detailLevel);
  const hasGlasses = slots.accessory === 'glasses' || slots.accessory === 'sunglasses';
  const glassesActive = showAccessories && hasGlasses;

  // 1. Extract structural pieces from createMimo SVG
  let defs = svg.match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? '';
  let clipGroup = svg.match(/<g clip-path="([^"]+)">/)?.[1] ?? '';
  let bgElements = svg.match(/<g clip-path[^>]*>([\s\S]*?)<foreignObject/)?.[1]?.trim() ?? '';

  // Prefix IDs to isolate each avatar's defs and clip-paths
  const idPrefix = `mimo-og-${index}-`;
  defs = defs
    .replace(/id="([^"]+)"/g, `id="${idPrefix}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${idPrefix}$1)`);
  clipGroup = clipGroup.replace(/url\(#([^)]+)\)/g, `url(#${idPrefix}$1)`);
  bgElements = bgElements.replace(/url\(#([^)]+)\)/g, `url(#${idPrefix}$1)`);

  // 2. Extract nested feature SVGs from foreignObject
  const foreign = svg.match(/<foreignObject[\s\S]*?<\/foreignObject>/)?.[0] ?? '';
  const featureRegex = /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"[\s\S]*?<\/svg>/g;
  const rawFeatures = [...foreign.matchAll(featureRegex)].map((m) => m[0]);

  const showEyebrows = canRenderSlot('eyebrows', detailLevel) && slots.eyebrows !== 'none';
  const showMouth = canRenderSlot('mouth', detailLevel);
  const showCheeks = canRenderSlot('cheeks', detailLevel) && slots.cheeks !== 'none';

  let fi = 0;
  const eyebrowSvg = showEyebrows ? rawFeatures[fi++] : null;
  const eyeSvg = rawFeatures[fi++];
  const mouthSvg = showMouth ? rawFeatures[fi++] : null;
  const cheekSvg = showCheeks ? rawFeatures[fi++] : null;

  // 3. Compute vertical layout in 100×100 coordinate space
  const WIDTHS: Record<string, number> = { eyebrow: 55, eye: 60, mouth: 35 };
  const GAP_AFTER_BROW = glassesActive ? 6 : 2;
  const GAP_BEFORE_MOUTH = glassesActive ? 8 : 4;

  type LayoutItem = { raw: string; w: number; h: number; gapAfter: number };
  const items: LayoutItem[] = [];

  if (eyebrowSvg) {
    const d = parseViewBox(eyebrowSvg);
    const w = WIDTHS.eyebrow;
    items.push({ raw: eyebrowSvg, w, h: w * (d.h / d.w), gapAfter: GAP_AFTER_BROW });
  }
  if (eyeSvg) {
    const d = parseViewBox(eyeSvg);
    const w = WIDTHS.eye;
    items.push({ raw: eyeSvg, w, h: w * (d.h / d.w), gapAfter: GAP_BEFORE_MOUTH });
  }
  if (mouthSvg) {
    const d = parseViewBox(mouthSvg);
    const w = WIDTHS.mouth;
    items.push({ raw: mouthSvg, w, h: w * (d.h / d.w), gapAfter: 0 });
  }

  let featureH = 0;
  for (let j = 0; j < items.length; j++) {
    featureH += items[j].h + (j < items.length - 1 ? items[j].gapAfter : 0);
  }

  let fy = (100 - featureH) / 2;
  let positioned = '';
  for (let j = 0; j < items.length; j++) {
    const it = items[j];
    positioned += positionFeatureSvg(it.raw, (100 - it.w) / 2, fy, it.w, it.h);
    fy += it.h + (j < items.length - 1 ? it.gapAfter : 0);
  }

  // Cheeks (bottom 18%, left 5%, width 90%)
  if (cheekSvg) {
    const d = parseViewBox(cheekSvg);
    const cw = 90;
    const ch = cw * (d.h / d.w);
    positioned += positionFeatureSvg(cheekSvg, 5, 100 - 18 - ch, cw, ch);
  }

  return {
    defs,
    snippet: `
    <svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 100 100">
      <g clip-path="${clipGroup}">
        ${bgElements}
        ${positioned}
      </g>
    </svg>`,
  };
}

// ── Route handler ────────────────────────────────────────────────────────────

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  // Support ?names=Sakura,Mimo,Atlas or ?name=Mimo (places name in center)
  const rawNames = params
    .get('names')
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const primaryName = params.get('name') || 'Mimo';
  const leftName =
    params.get('left') || (rawNames?.[0] ?? (primaryName.toLowerCase() === 'sakura' ? 'Luna' : 'Sakura'));
  const centerName = rawNames?.[1] ?? (rawNames && rawNames.length > 0 ? rawNames[0] : primaryName);
  const rightName =
    params.get('right') || (rawNames?.[2] ?? (primaryName.toLowerCase() === 'atlas' ? 'Phoenix' : 'Atlas'));

  const names =
    rawNames && rawNames.length >= 3
      ? [rawNames[0], rawNames[1], rawNames[2]]
      : [leftName, centerName, rightName];

  const shape = (params.get('shape') as 'circle' | 'squircle' | 'square') || 'circle';
  const depth = (params.get('depth') as 'none' | 'subtle' | 'medium' | 'dramatic') || 'dramatic';
  const detailLevel = (params.get('detail') as 'minimal' | 'basic' | 'standard' | 'full') || 'full';
  const background = (params.get('bg') as 'gradient' | 'solid') || 'gradient';
  const canvasBg = params.get('canvas') === 'dark' ? '#141413' : '#faf9f7';

  const moodParam = params.get('mood');
  const singleMood =
    moodParam && moodParam !== 'none'
      ? (moodParam as 'happy' | 'surprised' | 'sleepy' | 'cool' | 'cheeky')
      : undefined;

  const rawMoods = params
    .get('moods')
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) as ('happy' | 'surprised' | 'sleepy' | 'cool' | 'cheeky')[] | undefined;

  // Layout for 3 avatars across 1200×630 canvas
  // Left: x=190, y=205, size=220 (center x=300)
  // Center: x=470, y=185, size=260 (center x=600 - hero focus)
  // Right: x=790, y=205, size=220 (center x=900)
  const configs: AvatarConfig[] = [
    {
      name: names[0],
      x: 190,
      y: 205,
      size: 220,
      shape,
      depth,
      detailLevel,
      mood: rawMoods?.[0] || singleMood,
      background,
    },
    {
      name: names[1],
      x: 470,
      y: 185,
      size: 260,
      shape,
      depth,
      detailLevel,
      mood: rawMoods?.[1] || singleMood,
      background,
    },
    {
      name: names[2],
      x: 790,
      y: 205,
      size: 220,
      shape,
      depth,
      detailLevel,
      mood: rawMoods?.[2] || singleMood,
      background,
    },
  ];

  const rendered = configs.map((cfg, idx) => renderAvatarFragment(cfg, idx));

  const allDefs = rendered.map((r) => r.defs).join('\n');
  const allSnippets = rendered.map((r) => r.snippet).join('\n');

  const ogSvg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">',
    `<rect width="1200" height="630" fill="${canvasBg}"/>`,
    allDefs,
    allSnippets,
    '</svg>',
  ].join('');

  const resvg = new Resvg(ogSvg, {
    fitTo: { mode: 'width' as const, value: 1200 },
  });
  const png = resvg.render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
