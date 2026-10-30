import { Resvg } from '@resvg/resvg-js';
import type { NextRequest } from 'next/server';
import { GRADIENTS } from '@/lib/constants';
import { createAvatarSvg } from '@/lib/mimo-render';
import {
  DEFAULT_PLAYGROUND_SETTINGS,
  isOneOf,
  PLAYGROUND_BACKGROUNDS,
  PLAYGROUND_DEPTHS,
  PLAYGROUND_DETAIL_LEVELS,
  PLAYGROUND_EXPORT_SIZES,
  PLAYGROUND_MOODS,
  PLAYGROUND_SHAPES,
} from '@/lib/playground';

export const runtime = 'nodejs';

function filenameFor(name: string, format: 'png' | 'svg') {
  const safeName = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return `${safeName || 'mimo'}.${format}`;
}

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const format = params.get('format');

  if (format !== 'png' && format !== 'svg') {
    return new Response('Unsupported image format.', { status: 400 });
  }

  const name =
    (params.get('name') ?? DEFAULT_PLAYGROUND_SETTINGS.name).trim().slice(0, 64) ||
    DEFAULT_PLAYGROUND_SETTINGS.name;
  const shapeValue = params.get('shape');
  const shape = isOneOf(shapeValue, PLAYGROUND_SHAPES) ? shapeValue : DEFAULT_PLAYGROUND_SETTINGS.shape;
  const backgroundValue = params.get('background');
  const background = isOneOf(backgroundValue, PLAYGROUND_BACKGROUNDS)
    ? backgroundValue
    : DEFAULT_PLAYGROUND_SETTINGS.background;
  const detailValue = params.get('detail');
  const detailLevel = isOneOf(detailValue, PLAYGROUND_DETAIL_LEVELS)
    ? detailValue
    : DEFAULT_PLAYGROUND_SETTINGS.detailLevel;
  const depthValue = params.get('depth');
  const depth = isOneOf(depthValue, PLAYGROUND_DEPTHS) ? depthValue : DEFAULT_PLAYGROUND_SETTINGS.depth;
  const moodValue = params.get('mood');
  const mood = isOneOf(moodValue, PLAYGROUND_MOODS) && moodValue !== 'none' ? moodValue : undefined;
  const requestedSize = Number(params.get('size'));
  const size =
    PLAYGROUND_EXPORT_SIZES.find((option) => option === requestedSize) ??
    DEFAULT_PLAYGROUND_SETTINGS.exportSize;
  const requestedGradient = params.get('gradient')?.toLowerCase();
  const gradient =
    GRADIENTS.find((option) => option.name.toLowerCase() === requestedGradient) ?? GRADIENTS[0]!;
  const filename = filenameFor(name, format);
  const svg = createAvatarSvg({
    name,
    size,
    shape,
    depth,
    detailLevel,
    mood,
    background,
    gradients: gradient.pair,
  });
  const headers = {
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'private, no-store',
  };

  if (format === 'svg') {
    return new Response(svg, {
      headers: {
        ...headers,
        'Content-Type': 'image/svg+xml; charset=utf-8',
      },
    });
  }

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      ...headers,
      'Content-Type': 'image/png',
    },
  });
}
