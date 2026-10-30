import { Resvg } from '@resvg/resvg-js';
import type { NextRequest } from 'next/server';
import { type AvatarConfig, renderAvatarFragment } from '@/lib/mimo-render';

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const rawNames = params
    .get('names')
    ?.split(',')
    .map((name) => name.trim())
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
    .map((mood) => mood.trim())
    .filter(Boolean) as ('happy' | 'surprised' | 'sleepy' | 'cool' | 'cheeky')[] | undefined;

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

  const rendered = configs.map((config, index) => renderAvatarFragment(config, index));
  const allDefs = rendered.map((avatar) => avatar.defs).join('\n');
  const allSnippets = rendered.map((avatar) => avatar.snippet).join('\n');
  const ogSvg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">',
    `<rect width="1200" height="630" fill="${canvasBg}"/>`,
    allDefs,
    allSnippets,
    '</svg>',
  ].join('');

  const png = new Resvg(ogSvg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
