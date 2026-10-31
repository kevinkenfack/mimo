export const COMPONENT_GROUPS = [
  {
    id: 'eyes',
    items: [
      { id: 'round', sampleName: 'mimo-eye-round-2', detailLevel: 'standard' },
      { id: 'cross', sampleName: 'mimo-eye-cross-1', detailLevel: 'standard' },
      { id: 'line', sampleName: 'mimo-eye-line-0', detailLevel: 'standard' },
      { id: 'curved', sampleName: 'mimo-eye-curved-0', detailLevel: 'standard' },
      { id: 'wink', sampleName: 'mimo-eye-wink-5', detailLevel: 'standard' },
      { id: 'heart', sampleName: 'mimo-eye-heart-3', detailLevel: 'standard' },
    ],
  },
  {
    id: 'mouths',
    items: [
      { id: 'smile', sampleName: 'mimo-mouth-smile-0', detailLevel: 'basic' },
      { id: 'grin', sampleName: 'mimo-mouth-grin-6', detailLevel: 'basic' },
      { id: 'o', sampleName: 'mimo-mouth-o-6', detailLevel: 'basic' },
      { id: 'cat', sampleName: 'mimo-mouth-cat-4', detailLevel: 'basic' },
      { id: 'tongue', sampleName: 'mimo-mouth-tongue-1', detailLevel: 'basic' },
      { id: 'smirk', sampleName: 'mimo-mouth-smirk-3', detailLevel: 'basic' },
      { id: 'flat', sampleName: 'mimo-mouth-flat-6', detailLevel: 'basic' },
    ],
  },
  {
    id: 'eyebrows',
    items: [
      { id: 'arched', sampleName: 'mimo-brow-arched-2', detailLevel: 'standard' },
      { id: 'flat', sampleName: 'mimo-brow-flat-1', detailLevel: 'standard' },
      { id: 'raised', sampleName: 'mimo-brow-raised-1', detailLevel: 'standard' },
      { id: 'none', sampleName: 'mimo-brow-none-0', detailLevel: 'standard' },
    ],
  },
  {
    id: 'cheeks',
    items: [
      { id: 'blush', sampleName: 'mimo-cheek-blush-1', detailLevel: 'full' },
      { id: 'none', sampleName: 'mimo-cheek-none-0', detailLevel: 'full' },
    ],
  },
  {
    id: 'accessories',
    items: [
      { id: 'none', sampleName: 'mimo-accessory-none-0', detailLevel: 'full' },
      { id: 'glasses', sampleName: 'mimo-accessory-glasses-2', detailLevel: 'full' },
      { id: 'sunglasses', sampleName: 'mimo-accessory-sunglasses-1', detailLevel: 'full' },
    ],
  },
] as const;

export type ComponentGroupId = (typeof COMPONENT_GROUPS)[number]['id'];
export type ComponentFeature = (typeof COMPONENT_GROUPS)[number]['items'][number];
