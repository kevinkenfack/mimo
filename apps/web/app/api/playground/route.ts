import { Resvg } from '@resvg/resvg-js';
import { zipSync } from 'fflate';
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
  type PlaygroundDownloadFormat,
} from '@/lib/playground';

export const runtime = 'nodejs';

function filenameFor(_name: string, format: PlaygroundDownloadFormat, ts?: string) {
  const safeTs = ts ? `_${ts.replace(/[^a-zA-Z0-9_-]/g, '')}` : '';
  return `mimo${safeTs}.${format}`;
}

export function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const formatValue = params.get('format');

  if (formatValue !== 'png' && formatValue !== 'svg' && formatValue !== 'zip') {
    return new Response('Unsupported export format.', { status: 400 });
  }

  const format = formatValue;
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
  const ts = params.get('ts') ?? undefined;
  const gradient =
    GRADIENTS.find((option) => option.name.toLowerCase() === requestedGradient) ?? GRADIENTS[0]!;
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
    'Content-Disposition': `attachment; filename="${filenameFor(name, format, ts)}"`,
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

  if (format === 'zip') {
    const archive = zipSync({
      [filenameFor(name, 'png', ts)]: png,
      [filenameFor(name, 'svg', ts)]: new TextEncoder().encode(svg),
    });

    return new Response(new Uint8Array(archive), {
      headers: {
        ...headers,
        'Content-Type': 'application/zip',
      },
    });
  }

  return new Response(new Uint8Array(png), {
    headers: {
      ...headers,
      'Content-Type': 'image/png',
    },
  });
}
