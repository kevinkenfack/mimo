import type { GradientPair, MimoShape } from 'mimo-id';
import { createMimo } from 'mimo-id';
import type { FacesBackgroundStyle, FacesDepth, FacesDetailLevel, FacesMood } from 'mimo-id/variants';

const DETAIL_ORDER: FacesDetailLevel[] = ['minimal', 'basic', 'standard', 'full'];
const SLOT_MIN_DETAIL: Record<string, FacesDetailLevel> = {
  eyes: 'minimal',
  mouth: 'basic',
  eyebrows: 'standard',
  cheeks: 'full',
  accessory: 'full',
};

export interface AvatarConfig {
  name: string;
  x: number;
  y: number;
  size: number;
  shape: MimoShape;
  depth: FacesDepth;
  detailLevel: FacesDetailLevel;
  mood?: FacesMood;
  background: FacesBackgroundStyle;
  gradients?: GradientPair[];
}

function canRenderSlot(slot: string, detail: FacesDetailLevel) {
  return DETAIL_ORDER.indexOf(detail) >= DETAIL_ORDER.indexOf(SLOT_MIN_DETAIL[slot]);
}

function parseViewBox(svg: string) {
  const match = svg.match(/viewBox="[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)"/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : { width: 1, height: 1 };
}

function positionFeatureSvg(raw: string, x: number, y: number, width: number, height: number) {
  return raw
    .replace(/<svg([^>]*?) style="[^"]*"/, '<svg$1')
    .replace('<svg ', `<svg x="${x}" y="${y}" width="${width}" height="${height}" overflow="visible" `)
    .replaceAll('currentColor', '#000');
}

export function renderAvatarFragment(config: AvatarConfig, index: number) {
  const { name, x, y, size, shape, depth, detailLevel, mood, background, gradients } = config;
  const result = createMimo({ name, size, shape, depth, detailLevel, mood, background, gradients });
  const { svg, slots } = result;

  const showAccessories = canRenderSlot('accessory', detailLevel);
  const hasGlasses = slots.accessory === 'glasses' || slots.accessory === 'sunglasses';
  const glassesActive = showAccessories && hasGlasses;
  const showEyebrows = canRenderSlot('eyebrows', detailLevel) && slots.eyebrows !== 'none';
  const showEyes = !glassesActive;
  const showMouth = canRenderSlot('mouth', detailLevel);
  const showCheeks = canRenderSlot('cheeks', detailLevel) && slots.cheeks !== 'none';

  let defs = svg.match(/<defs>[\s\S]*?<\/defs>/)?.[0] ?? '';
  let clipGroup = svg.match(/<g clip-path="([^"]+)">/)?.[1] ?? '';
  let backgroundElements = svg.match(/<g clip-path[^>]*>([\s\S]*?)<foreignObject/)?.[1]?.trim() ?? '';
  const foreignObject = svg.match(/<foreignObject[\s\S]*?<\/foreignObject>/)?.[0] ?? '';
  const featureRegex = /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"[\s\S]*?<\/svg>/g;
  const rawFeatures = [...foreignObject.matchAll(featureRegex)].map((match) => match[0]);

  const idPrefix = `mimo-avatar-${index}-`;
  defs = defs
    .replace(/id="([^"]+)"/g, `id="${idPrefix}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${idPrefix}$1)`);
  clipGroup = clipGroup.replace(/url\(#([^)]+)\)/g, `url(#${idPrefix}$1)`);
  backgroundElements = backgroundElements.replace(/url\(#([^)]+)\)/g, `url(#${idPrefix}$1)`);

  if (!clipGroup || rawFeatures.length === 0) {
    throw new Error('Unable to extract the Mimo avatar SVG features.');
  }

  let featureIndex = 0;
  const eyebrowSvg = showEyebrows ? (rawFeatures[featureIndex++] ?? null) : null;
  const eyeSvg = showEyes ? (rawFeatures[featureIndex++] ?? null) : null;
  const accessorySvg =
    showAccessories && slots.accessory !== 'none' ? (rawFeatures[featureIndex++] ?? null) : null;
  const mouthSvg = showMouth ? (rawFeatures[featureIndex++] ?? null) : null;
  const cheekSvg = showCheeks ? (rawFeatures[featureIndex++] ?? null) : null;
  const mainEyeSvg = glassesActive ? accessorySvg : eyeSvg;

  const eyebrowGap = glassesActive ? 6 : 2;
  const mouthGap = glassesActive ? 8 : 4;
  type LayoutItem = {
    raw: string;
    width: number;
    height: number;
    gapAfter: number;
    kind: 'eyebrows' | 'eyes' | 'mouth';
  };
  const items: LayoutItem[] = [];

  if (eyebrowSvg) {
    const dimensions = parseViewBox(eyebrowSvg);
    const width = 55;
    items.push({
      raw: eyebrowSvg,
      width,
      height: width * (dimensions.height / dimensions.width),
      gapAfter: eyebrowGap,
      kind: 'eyebrows',
    });
  }

  if (mainEyeSvg) {
    const dimensions = parseViewBox(mainEyeSvg);
    const width = glassesActive ? 66 : 60;
    items.push({
      raw: mainEyeSvg,
      width,
      height: width * (dimensions.height / dimensions.width),
      gapAfter: mouthGap,
      kind: 'eyes',
    });
  }

  if (mouthSvg) {
    const dimensions = parseViewBox(mouthSvg);
    const width = 35;
    items.push({
      raw: mouthSvg,
      width,
      height: width * (dimensions.height / dimensions.width),
      gapAfter: 0,
      kind: 'mouth',
    });
  }

  const contentHeight = items.reduce(
    (total, item, itemIndex) => total + item.height + (itemIndex < items.length - 1 ? item.gapAfter : 0),
    0
  );
  let featureY = (100 - contentHeight) / 2;
  let eyePosition: { x: number; y: number; width: number; height: number } | null = null;
  let positionedFeatures = '';

  for (const [itemIndex, item] of items.entries()) {
    const featureX = (100 - item.width) / 2;
    positionedFeatures += positionFeatureSvg(item.raw, featureX, featureY, item.width, item.height);
    if (item.kind === 'eyes') {
      eyePosition = { x: featureX, y: featureY, width: item.width, height: item.height };
    }
    featureY += item.height + (itemIndex < items.length - 1 ? item.gapAfter : 0);
  }

  if (accessorySvg && !glassesActive && eyePosition) {
    const dimensions = parseViewBox(accessorySvg);
    const width = 66;
    const height = width * (dimensions.height / dimensions.width);
    const y = eyePosition.y + (eyePosition.height - height) / 2;
    positionedFeatures += positionFeatureSvg(accessorySvg, (100 - width) / 2, y, width, height);
  }

  if (cheekSvg) {
    const dimensions = parseViewBox(cheekSvg);
    const width = 90;
    const height = width * (dimensions.height / dimensions.width);
    positionedFeatures += positionFeatureSvg(cheekSvg, 5, 100 - 18 - height, width, height);
  }

  return {
    defs,
    snippet: `
      <svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 100 100">
        <g clip-path="${clipGroup}">
          ${backgroundElements}
          ${positionedFeatures}
        </g>
      </svg>`,
  };
}

export function createAvatarSvg(config: Omit<AvatarConfig, 'x' | 'y'>) {
  const { defs, snippet } = renderAvatarFragment({ ...config, x: 0, y: 0 }, 0);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${config.size}" height="${config.size}" viewBox="0 0 ${config.size} ${config.size}">`,
    '<title>Mimo avatar</title>',
    defs,
    snippet,
    '</svg>',
  ].join('');
}
