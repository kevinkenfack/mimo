import type { MimoShape } from 'mimo-id';
import type {
  FacesAnimation,
  FacesBackgroundStyle,
  FacesDepth,
  FacesDetailLevel,
  FacesMood,
} from 'mimo-id/variants';

export const PLAYGROUND_SHAPES = ['circle', 'squircle', 'square'] as const satisfies readonly MimoShape[];
export const PLAYGROUND_BACKGROUNDS = [
  'gradient',
  'solid',
] as const satisfies readonly FacesBackgroundStyle[];
export const PLAYGROUND_MOODS = [
  'none',
  'happy',
  'surprised',
  'sleepy',
  'cool',
  'cheeky',
] as const satisfies readonly (FacesMood | 'none')[];
export const PLAYGROUND_DETAIL_LEVELS = [
  'minimal',
  'basic',
  'standard',
  'full',
] as const satisfies readonly FacesDetailLevel[];
export const PLAYGROUND_DEPTHS = [
  'none',
  'subtle',
  'medium',
  'dramatic',
] as const satisfies readonly FacesDepth[];
export const PLAYGROUND_ANIMATIONS = [
  'none',
  'blink',
  'float',
  'sway',
  'eyeWander',
  'eyebrowBounce',
  'glance',
  'entrance',
] as const satisfies readonly (FacesAnimation | 'none')[];
export const PLAYGROUND_EXPORT_SIZES = [256, 512, 1024] as const;
export const PLAYGROUND_EXPORT_FORMATS = ['png', 'svg'] as const;

export type PlaygroundMood = (typeof PLAYGROUND_MOODS)[number];
export type PlaygroundAnimation = (typeof PLAYGROUND_ANIMATIONS)[number];
export type PlaygroundExportSize = (typeof PLAYGROUND_EXPORT_SIZES)[number];
export type PlaygroundExportFormat = (typeof PLAYGROUND_EXPORT_FORMATS)[number];
export type PlaygroundDownloadFormat = PlaygroundExportFormat | 'zip';

export type PlaygroundSettings = {
  name: string;
  shape: MimoShape;
  background: FacesBackgroundStyle;
  gradient: string;
  mood: PlaygroundMood;
  detailLevel: FacesDetailLevel;
  depth: FacesDepth;
  animation: PlaygroundAnimation;
  exportSize: PlaygroundExportSize;
  exportFormat: PlaygroundExportFormat;
};

export const DEFAULT_PLAYGROUND_SETTINGS: PlaygroundSettings = {
  name: 'Mimo',
  shape: 'squircle',
  background: 'gradient',
  gradient: 'Lavender',
  mood: 'none',
  detailLevel: 'full',
  depth: 'medium',
  animation: 'blink',
  exportSize: 256,
  exportFormat: 'png',
};

export function playgroundExportHref(settings: PlaygroundSettings, format: PlaygroundDownloadFormat) {
  const params = new URLSearchParams({
    format,
    name: settings.name.trim() || 'Mimo',
    shape: settings.shape,
    background: settings.background,
    gradient: settings.gradient.toLowerCase(),
    mood: settings.mood,
    detail: settings.detailLevel,
    depth: settings.depth,
    size: String(settings.exportSize),
  });

  return `/api/playground?${params.toString()}`;
}

export function isOneOf<T extends readonly string[]>(value: string | null, options: T): value is T[number] {
  return value !== null && (options as readonly string[]).includes(value);
}
