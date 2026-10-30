import * as React from 'react';
import { createMimo } from '../core/engine/create-mimo';
import { isConfiguredVariant } from '../core/engine/factory';
import { pickVariantProps, resolveVariantInput } from '../core/engine/resolve';
import type {
  AnyVariantFactory,
  AnyVariantModule,
  ConfiguredVariant,
  FeatureShape,
  MimoShape,
  VariantPropsFromModule,
  VariantPropsOf,
} from '../core/types';
import { hash } from '../core/utils/hash';
import { faces } from '../variants';
import {
  ACCESSORY_SHAPES,
  CHEEK_SHAPES,
  EYE_SHAPES,
  EYEBROW_SHAPES,
  MOUTH_SHAPES,
} from '../variants/faces/features';
import type {
  FacesAnimation,
  FacesAnimationConfig,
  FacesNormalizedProps,
  FacesProps,
  FacesResult,
} from '../variants/faces/types';

type SharedMimoProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  name: string;
  size?: number | string;
  shape?: MimoShape;
  interactive?: boolean;
};

export type MimoDefaultProps = SharedMimoProps &
  Partial<VariantPropsOf<typeof faces>> & {
    variant?: undefined;
  };

export type MimoWithVariantProps<V extends AnyVariantFactory> = SharedMimoProps &
  Partial<VariantPropsOf<V>> & {
    variant: V;
  };

export type MimoWithConfiguredVariantProps<M extends AnyVariantModule> = SharedMimoProps &
  Partial<VariantPropsFromModule<M>> & {
    variant: ConfiguredVariant<M>;
  };

export type MimoProps =
  | MimoDefaultProps
  | MimoWithVariantProps<typeof faces>
  | MimoWithConfiguredVariantProps<typeof faces.module>;

type MimoComponent = {
  (props: MimoDefaultProps & React.RefAttributes<HTMLDivElement>): React.ReactElement | null;
  <V extends AnyVariantFactory>(
    props: MimoWithVariantProps<V> & React.RefAttributes<HTMLDivElement>
  ): React.ReactElement | null;
  <M extends AnyVariantModule>(
    props: MimoWithConfiguredVariantProps<M> & React.RefAttributes<HTMLDivElement>
  ): React.ReactElement | null;
};

const SHAPE_BORDER_RADIUS: Record<MimoShape, string> = {
  circle: '50%',
  squircle: '0',
  square: '0',
};

// Apple-style squircle with continuous curvature.
// r1 = 0.0586 (control-point inset), r2 = 0.44 (curve onset).
function getSquircleClipPath(size: number): string {
  const r1 = +(size * 0.0586).toFixed(2);
  const r2 = +(size * 0.44).toFixed(2);
  const s = size;
  const sr2 = +(s - r2).toFixed(2);
  const sr1 = +(s - r1).toFixed(2);
  return `path('M 0 ${r2} C 0 ${r1} ${r1} 0 ${r2} 0 L ${sr2} 0 C ${sr1} 0 ${s} ${r1} ${s} ${r2} L ${s} ${sr2} C ${s} ${sr1} ${sr1} ${s} ${sr2} ${s} L ${r2} ${s} C ${r1} ${s} 0 ${sr1} 0 ${sr2} Z')`;
}

const DEPTH_PRESETS = {
  none: { rotateRange: 0, translateZ: 0, perspective: 'none', contentScale: 1 },
  subtle: { rotateRange: 5, translateZ: 4, perspective: '800px', contentScale: 0.97 },
  medium: { rotateRange: 10, translateZ: 8, perspective: '500px', contentScale: 0.94 },
  dramatic: { rotateRange: 15, translateZ: 12, perspective: '300px', contentScale: 0.9 },
} as const;

const ALL_KEYFRAMES = `
@keyframes mimo-blink {
  0%, 92%, 100% { transform: scaleY(1); }
  96% { transform: scaleY(0.05); }
}
@keyframes mimo-eyebrow-bounce {
  0%, 88%, 100% { transform: translateY(0); }
  94% { transform: translateY(-2px); }
}
@keyframes mimo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
@keyframes mimo-sway {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}
@keyframes mimo-eye-wander {
  0%, 100% { transform: translateX(0) translateY(0); }
  20% { transform: translateX(1.5px) translateY(-0.5px); }
  40% { transform: translateX(0.5px) translateY(0.5px); }
  60% { transform: translateX(-1.5px) translateY(0); }
  80% { transform: translateX(-0.5px) translateY(-0.5px); }
}
@keyframes mimo-entrance-scale {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes mimo-entrance-eyes {
  0% { transform: scaleY(0.05); }
  100% { transform: scaleY(1); }
}
@keyframes mimo-glance {
  0%, 82%, 100% { transform: var(--mimo-rest); }
  88%, 92% { transform: var(--mimo-facing); }
}
`;

function renderShapeContent(featureShape: FeatureShape, fill: string, stroke: string): string {
  const paths = featureShape.paths
    .map((path) => {
      if (typeof path === 'string') {
        return `<path d="${path}" fill="${fill}" />`;
      }

      return `<path d="${path.d}" fill="${path.fill ?? fill}"${path.opacity ? ` opacity="${path.opacity}"` : ''} />`;
    })
    .join('');

  const strokes =
    featureShape.strokes
      ?.map(
        (path) =>
          `<path d="${path.d}" fill="${path.fill ?? 'none'}" stroke="${stroke}" stroke-width="${path.strokeWidth}"${
            path.strokeLinecap ? ` stroke-linecap="${path.strokeLinecap}"` : ''
          } />`
      )
      .join('') ?? '';

  const circles =
    featureShape.circles
      ?.map(
        (circle) =>
          `<circle cx="${circle.cx}" cy="${circle.cy}" r="${circle.r}" fill="${circle.fill ?? fill}"${
            circle.opacity ? ` opacity="${circle.opacity}"` : ''
          }${
            circle.stroke || circle.strokeWidth
              ? ` stroke="${circle.stroke ?? stroke}"${
                  circle.strokeWidth ? ` stroke-width="${circle.strokeWidth}"` : ''
                }`
              : ''
          } />`
      )
      .join('') ?? '';

  const ellipses =
    featureShape.ellipses
      ?.map(
        (ellipse) =>
          `<ellipse cx="${ellipse.cx}" cy="${ellipse.cy}" rx="${ellipse.rx}" ry="${ellipse.ry}" fill="${ellipse.fill ?? 'none'}" stroke="${ellipse.stroke ?? stroke}"${
            ellipse.strokeWidth ? ` stroke-width="${ellipse.strokeWidth}"` : ''
          } />`
      )
      .join('') ?? '';

  const rects =
    featureShape.rects
      ?.map(
        (rect) =>
          `<rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="${rect.fill ?? fill}"${
            rect.rx ? ` rx="${rect.rx}"` : ''
          }${rect.opacity ? ` opacity="${rect.opacity}"` : ''} />`
      )
      .join('') ?? '';

  return `${paths}${strokes}${circles}${ellipses}${rects}`;
}

function renderFeature(
  featureShape: FeatureShape,
  fill: string,
  stroke: string,
  innerGroupStyle?: string,
  svgStyle?: string
): string {
  const content = renderShapeContent(featureShape, fill, stroke);
  const wrappedContent = innerGroupStyle ? `<g style="${innerGroupStyle}">${content}</g>` : content;
  const style = svgStyle ?? 'width:100%;height:auto';

  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="${featureShape.viewBox}" style="overflow:visible;${style}">${wrappedContent}</svg>`;
}

function normalizeFacesPropsForReact(input: {
  variantInput: unknown;
  rawVariantProps: Partial<Record<string, unknown>>;
  name: string;
  size: number;
}): FacesNormalizedProps {
  const { variantInput, rawVariantProps, name, size } = input;

  const configuredDefaults =
    isConfiguredVariant(variantInput) && variantInput.module.id === 'faces'
      ? (variantInput.defaults as Partial<FacesProps>)
      : undefined;

  const partialProps = (configuredDefaults ?? rawVariantProps) as Partial<FacesProps>;
  return faces.module.normalizeProps(partialProps, { name, size, seed: hash(name), shape: 'circle' });
}

function buildCreateOptions(input: {
  name: string;
  numericSize: number;
  shape: MimoShape;
  variantInput: unknown;
  rawVariantProps: Partial<Record<string, unknown>>;
}): Record<string, unknown> {
  const { name, numericSize, shape, variantInput, rawVariantProps } = input;

  const options: Record<string, unknown> = {
    name,
    size: numericSize,
    shape,
    ...rawVariantProps,
  };

  if (variantInput !== undefined) {
    options.variant = variantInput;
  }

  return options;
}

function getAnimationFlags(animations: readonly FacesAnimationConfig[]): Record<FacesAnimation, boolean> {
  const set = new Set(animations.map((a) => a.type));

  return {
    blink: set.has('blink'),
    float: set.has('float'),
    entrance: set.has('entrance'),
    sway: set.has('sway'),
    eyeWander: set.has('eyeWander'),
    eyebrowBounce: set.has('eyebrowBounce'),
    glance: set.has('glance'),
  };
}

function getAnimConfig(
  animations: readonly FacesAnimationConfig[],
  type: FacesAnimation
): FacesAnimationConfig | undefined {
  return animations.find((a) => a.type === type);
}

function isFacesResult(value: { variant: string; svg: string } | FacesResult): value is FacesResult {
  return (
    value.variant === 'faces' &&
    'slots' in value &&
    'gradient' in value &&
    'rotation' in value &&
    'detailLevel' in value
  );
}

const MimoImpl = (
  props: Record<string, unknown>,
  ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement | null => {
  const [isHovered, setIsHovered] = React.useState(false);

  const name = typeof props.name === 'string' ? props.name : '';
  const size = props.size;
  const numericSize = typeof size === 'number' ? size : 40;

  const interactive = typeof props.interactive === 'boolean' ? props.interactive : true;
  const VALID_SHAPES = new Set<MimoShape>(['circle', 'squircle', 'square']);
  const rawShape = props.shape as MimoShape | undefined;
  const shape: MimoShape = rawShape && VALID_SHAPES.has(rawShape) ? rawShape : 'circle';

  const variantInput = props.variant;
  const variantModule = resolveVariantInput(variantInput, faces);
  const rawVariantProps = pickVariantProps(variantModule, props);

  const createOptions = buildCreateOptions({
    name,
    numericSize,
    shape,
    variantInput,
    rawVariantProps,
  });

  const result = createMimo(createOptions as never) as { variant: string; svg: string } | FacesResult;

  const blockedKeys = new Set<string>([
    'name',
    'size',
    'shape',
    'variant',
    'interactive',
    ...variantModule.propKeys,
  ]);
  const containerProps: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (blockedKeys.has(key)) {
      continue;
    }

    containerProps[key] = value;
  }

  const userOnMouseEnter = containerProps.onMouseEnter as React.MouseEventHandler<HTMLDivElement> | undefined;
  const userOnMouseLeave = containerProps.onMouseLeave as React.MouseEventHandler<HTMLDivElement> | undefined;

  const containerStyle = (containerProps.style as React.CSSProperties | undefined) ?? {};
  const sizeValue = typeof size === 'number' ? `${size}px` : typeof size === 'string' ? size : '40px';
  const isFaces = isFacesResult(result);
  const facesResult = isFaces ? result : null;
  const normalizedFacesProps = isFaces
    ? normalizeFacesPropsForReact({
        variantInput,
        rawVariantProps,
        name,
        size: numericSize,
      })
    : null;
  const hasAnyAnimation = (normalizedFacesProps?.animations ?? []).length > 0;

  if (!facesResult || !normalizedFacesProps) {
    return (
      <div
        {...(containerProps as React.HTMLAttributes<HTMLDivElement>)}
        data-mimo=''
        ref={ref}
        style={{
          width: sizeValue,
          height: sizeValue,
          display: 'inline-block',
          lineHeight: 0,
          ...containerStyle,
        }}
      >
        <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: result.svg }} />
      </div>
    );
  }

  const { background, detailLevel, animations, depth } = normalizedFacesProps;
  const { slots, gradient, rotation } = facesResult;

  const has = getAnimationFlags(animations);

  const h = hash(name);
  const blinkConf = getAnimConfig(animations, 'blink');
  const blinkSeed = h * 31;
  const blinkDelay = blinkConf?.delay ?? (blinkSeed % 40) / 10;
  const blinkDuration = blinkConf?.duration ?? 2 + (blinkSeed % 40) / 10;
  const blinkStyle = `animation:mimo-blink ${blinkDuration}s ease-in-out ${blinkDelay}s infinite;transform-origin:center center;`;

  const glanceConf = getAnimConfig(animations, 'glance');
  const glanceSeed = h * 37;
  const glanceDuration = glanceConf?.duration ?? 6 + (glanceSeed % 30) / 10;
  const glanceDelay = glanceConf?.delay ?? (glanceSeed % 20) / 10;
  const glanceAnim = `mimo-glance ${glanceDuration}s ease-in-out ${glanceDelay}s infinite`;

  const eyeShapeData = EYE_SHAPES[slots.eyes] ?? EYE_SHAPES.round;
  const eyebrowShapeData = EYEBROW_SHAPES[slots.eyebrows];
  const mouthShapeData = MOUTH_SHAPES[slots.mouth] ?? MOUTH_SHAPES.smile;
  const cheekShapeData = CHEEK_SHAPES[slots.cheeks];
  const accessoryShapeData = ACCESSORY_SHAPES[slots.accessory];

  const eyeHtml = renderFeature(
    eyeShapeData,
    'currentColor',
    'currentColor',
    has.blink ? blinkStyle : undefined,
    'width:100%;height:auto;max-width:90%;max-height:40%'
  );

  const eyebrowHtml = eyebrowShapeData
    ? renderFeature(eyebrowShapeData, 'currentColor', 'currentColor', undefined, 'width:100%;height:auto')
    : null;

  const mouthHtml = renderFeature(
    mouthShapeData,
    'currentColor',
    'currentColor',
    undefined,
    'width:100%;height:auto'
  );

  const cheekHtml = cheekShapeData
    ? renderFeature(cheekShapeData, '#FF9EBB', '#FF9EBB', undefined, 'width:100%;height:auto')
    : null;

  const accessoryHtml = accessoryShapeData
    ? renderFeature(accessoryShapeData, 'currentColor', 'currentColor', undefined, 'width:110%;height:auto')
    : null;

  const preset = DEPTH_PRESETS[depth];

  const transform =
    depth === 'none'
      ? undefined
      : `scale(${preset.contentScale}) rotateX(${
          isHovered && interactive && !has.glance ? 0 : rotation.x * preset.rotateRange
        }deg) rotateY(${isHovered && interactive && !has.glance ? 0 : rotation.y * preset.rotateRange}deg) translateZ(${
          preset.translateZ
        }px)`;

  const facingTransform =
    depth === 'none'
      ? undefined
      : `scale(${preset.contentScale}) rotateX(0deg) rotateY(0deg) translateZ(${preset.translateZ}px)`;

  const backgroundStyle: React.CSSProperties =
    background === 'solid'
      ? { backgroundColor: gradient.from }
      : { background: `radial-gradient(circle at 40% 40%, ${gradient.from} 0%, ${gradient.to} 100%)` };

  const showEyebrows = detailLevel === 'standard' || detailLevel === 'full';
  const showMouth = detailLevel !== 'minimal';
  const showCheeks = detailLevel === 'full';
  const showAccessories = detailLevel === 'full';
  const hasGlasses = slots.accessory === 'glasses' || slots.accessory === 'sunglasses';
  const showEyes = !(showAccessories && hasGlasses);
  const glassesActive = showAccessories && hasGlasses;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Decorative avatar component
    <div
      {...(containerProps as React.HTMLAttributes<HTMLDivElement>)}
      className={['mimo', containerProps.className].filter(Boolean).join(' ')}
      data-interactive={interactive || undefined}
      data-mimo=''
      onMouseEnter={(event) => {
        if (interactive) setIsHovered(true);
        userOnMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        if (interactive) setIsHovered(false);
        userOnMouseLeave?.(event);
      }}
      ref={ref}
      style={{
        width: sizeValue,
        height: sizeValue,
        borderRadius: SHAPE_BORDER_RADIUS[shape],
        ...(shape === 'squircle' && { clipPath: getSquircleClipPath(numericSize) }),
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        containerType: 'size',
        ...(depth !== 'none' && {
          perspective: preset.perspective,
          transformStyle: 'preserve-3d',
        }),
        ...backgroundStyle,
        ...(has.entrance && {
          animation: `mimo-entrance-scale ${getAnimConfig(animations, 'entrance')?.duration ?? 0.4}s ease-out ${getAnimConfig(animations, 'entrance')?.delay ?? 0}s forwards`,
        }),
        ...containerStyle,
      }}
    >
      {hasAnyAnimation && <style dangerouslySetInnerHTML={{ __html: ALL_KEYFRAMES }} />}

      {background === 'gradient' && (
        <div
          data-mimo-gradient=''
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: SHAPE_BORDER_RADIUS[shape],
            pointerEvents: 'none',
            zIndex: 1,
            background:
              'radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)',
          }}
        />
      )}

      <div
        data-mimo-sway=''
        style={{
          position: 'absolute',
          inset: 0,
          ...(has.sway && {
            animation: `mimo-sway ${getAnimConfig(animations, 'sway')?.duration ?? 5}s ease-in-out ${getAnimConfig(animations, 'sway')?.delay ?? 0}s infinite`,
          }),
        }}
      >
        <div
          data-mimo-face=''
          style={
            {
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              ...(has.float && !has.glance
                ? {
                    animation: `mimo-float ${getAnimConfig(animations, 'float')?.duration ?? 3}s ease-in-out ${getAnimConfig(animations, 'float')?.delay ?? 0}s infinite`,
                  }
                : has.glance && depth !== 'none'
                  ? {
                      '--mimo-rest': transform,
                      '--mimo-facing': facingTransform,
                      transform,
                      animation: glanceAnim,
                    }
                  : {
                      transform,
                      transition: interactive ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
                    }),
              transformStyle: depth !== 'none' ? 'preserve-3d' : undefined,
            } as React.CSSProperties
          }
        >
          {showEyebrows && eyebrowHtml && (
            <div
              data-mimo-eyebrows=''
              style={{
                width: '55%',
                marginBottom: glassesActive ? '6%' : '2%',
                ...(has.eyebrowBounce
                  ? {
                      animation: `mimo-eyebrow-bounce ${getAnimConfig(animations, 'eyebrowBounce')?.duration ?? 4}s ease-in-out ${getAnimConfig(animations, 'eyebrowBounce')?.delay ?? 0}s infinite`,
                    }
                  : {}),
              }}
              dangerouslySetInnerHTML={{ __html: eyebrowHtml }}
            />
          )}

          <div
            data-mimo-eyes=''
            style={{
              width: '60%',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(has.entrance &&
                !glassesActive && {
                  animation: `mimo-entrance-eyes ${getAnimConfig(animations, 'entrance')?.duration ?? 0.3}s ease-out ${getAnimConfig(animations, 'entrance')?.delay ?? 0.2}s both`,
                }),
              ...(has.eyeWander &&
                !(has.entrance && !glassesActive) && {
                  animation: `mimo-eye-wander ${getAnimConfig(animations, 'eyeWander')?.duration ?? 8}s ease-in-out ${getAnimConfig(animations, 'eyeWander')?.delay ?? 0}s infinite`,
                }),
              ...(has.eyeWander &&
                has.entrance &&
                !glassesActive && {
                  animation: `mimo-entrance-eyes ${getAnimConfig(animations, 'entrance')?.duration ?? 0.3}s ease-out ${getAnimConfig(animations, 'entrance')?.delay ?? 0.2}s both, mimo-eye-wander ${getAnimConfig(animations, 'eyeWander')?.duration ?? 8}s ease-in-out 0.5s infinite`,
                }),
            }}
          >
            {showEyes && (
              <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: eyeHtml }} />
            )}

            {showAccessories && accessoryHtml && (
              <div
                data-mimo-accessory=''
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
                dangerouslySetInnerHTML={{ __html: accessoryHtml }}
              />
            )}
          </div>

          {showMouth && (
            <div
              data-mimo-mouth=''
              style={{
                marginTop: glassesActive ? '8%' : '4%',
                width: '35%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              dangerouslySetInnerHTML={{ __html: mouthHtml }}
            />
          )}

          {showCheeks && cheekHtml && (
            <div
              data-mimo-cheeks=''
              style={{
                position: 'absolute',
                bottom: '18%',
                left: '5%',
                right: '5%',
                pointerEvents: 'none',
              }}
              dangerouslySetInnerHTML={{ __html: cheekHtml }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const ForwardedMimo = React.forwardRef(MimoImpl);
ForwardedMimo.displayName = 'Mimo';

export const Mimo = ForwardedMimo as unknown as MimoComponent;
