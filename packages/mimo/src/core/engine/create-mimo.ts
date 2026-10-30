import { faces } from '../../variants';
import type {
  AnyVariantFactory,
  AnyVariantModule,
  ConfiguredVariant,
  MimoShape,
  VariantPropsFromModule,
  VariantPropsOf,
  VariantResultOf,
} from '../types';
import { normalizeVariantSelection } from './resolve';

type BaseMimoOptions = {
  name: string;
  size?: number;
  shape?: MimoShape;
};

export type CreateMimoDefaultOptions = BaseMimoOptions &
  Partial<VariantPropsOf<typeof faces>> & {
    variant?: undefined;
  };

export type CreateMimoWithVariantOptions<V extends AnyVariantFactory> = BaseMimoOptions &
  Partial<VariantPropsOf<V>> & {
    variant: V;
  };

export type CreateMimoWithConfiguredVariantOptions<M extends AnyVariantModule> = BaseMimoOptions &
  Partial<VariantPropsFromModule<M>> & {
    variant: ConfiguredVariant<M>;
  };

export function createMimo(options: CreateMimoDefaultOptions): VariantResultOf<typeof faces>;
export function createMimo<V extends AnyVariantFactory>(
  options: CreateMimoWithVariantOptions<V>
): VariantResultOf<V>;
export function createMimo<M extends AnyVariantModule>(
  options: CreateMimoWithConfiguredVariantOptions<M>
): { variant: string; svg: string };
export function createMimo(options: Record<string, unknown>): { variant: string; svg: string } {
  const { module, props, name, size, seed, shape } = normalizeVariantSelection(options, faces);
  return module.resolve({ name, size, seed, shape, props });
}
