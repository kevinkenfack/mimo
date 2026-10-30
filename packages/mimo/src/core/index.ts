export type {
  CreateMimoDefaultOptions,
  CreateMimoWithConfiguredVariantOptions,
  CreateMimoWithVariantOptions,
} from './engine/create-mimo';
export { createMimo } from './engine/create-mimo';

export { createVariantFactory, isConfiguredVariant, isVariantFactory } from './engine/factory';
export { pickVariantProps, resolveVariantInput } from './engine/resolve';
export type { SvgShellOptions } from './render/shell';
export { renderSvgShell } from './render/shell';
export type {
  AnyVariantFactory,
  AnyVariantModule,
  ConfiguredVariant,
  FeatureShape,
  GradientPair,
  MimoShape,
  NeverProps,
  Rotation,
  VariantCapabilities,
  VariantContext,
  VariantFactory,
  VariantInput,
  VariantModule,
  VariantModuleOf,
  VariantPropsFromModule,
  VariantPropsOf,
  VariantResultFromModule,
  VariantResultOf,
} from './types';

export { hash } from './utils/hash';
