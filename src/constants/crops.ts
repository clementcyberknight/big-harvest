export type CropType =
  | 'cacao'
  | 'carrot'
  | 'chili'
  | 'coffee_beans'
  | 'corn'
  | 'cotton'
  | 'grapes'
  | 'lavender'
  | 'mud_pit'
  | 'oat'
  | 'onion'
  | 'pepper'
  | 'potato'
  | 'rice'
  | 'saffron'
  | 'sapling_patch'
  | 'soybean'
  | 'strawberry'
  | 'sugarcane'
  | 'sunflower'
  | 'tea_leaves'
  | 'tomato'
  | 'vanilla'
  | 'wheat';

export interface CropDefinition {
  id: CropType;
  name: string;
  growthTime: number; // in seconds
  yield: number;
  note?: string;
}

export const CROP_GUIDE: Record<CropType, CropDefinition> = {
  wheat: { id: 'wheat', name: 'Wheat', growthTime: 60, yield: 1 },
  corn: { id: 'corn', name: 'Corn', growthTime: 60, yield: 1 },
  rice: { id: 'rice', name: 'Rice', growthTime: 120, yield: 1 },
  soybean: { id: 'soybean', name: 'Soybean', growthTime: 120, yield: 1 },
  tomato: { id: 'tomato', name: 'Tomato', growthTime: 120, yield: 1 },
  potato: { id: 'potato', name: 'Potato', growthTime: 180, yield: 2 },
  onion: { id: 'onion', name: 'Onion', growthTime: 180, yield: 2 },
  carrot: { id: 'carrot', name: 'Carrot', growthTime: 180, yield: 2 },
  pepper: { id: 'pepper', name: 'Pepper', growthTime: 240, yield: 2 },
  strawberry: { id: 'strawberry', name: 'Strawberry', growthTime: 240, yield: 2 },
  sunflower: { id: 'sunflower', name: 'Sunflower', growthTime: 180, yield: 1, note: 'Yields Sunflower Seeds' },
  sugarcane: { id: 'sugarcane', name: 'Sugarcane', growthTime: 240, yield: 2 },
  cacao: { id: 'cacao', name: 'Cacao', growthTime: 300, yield: 3, note: 'Yields Cocoa Pods' },
  coffee_beans: { id: 'coffee_beans', name: 'Coffee', growthTime: 300, yield: 3, note: 'Yields Coffee Beans' },
  vanilla: { id: 'vanilla', name: 'Vanilla', growthTime: 300, yield: 3, note: 'Yields Vanilla Pods' },
  tea_leaves: { id: 'tea_leaves', name: 'Tea', growthTime: 240, yield: 1, note: 'Yields Tea Leaves' },
  lavender: { id: 'lavender', name: 'Lavender', growthTime: 300, yield: 2 },
  grapes: { id: 'grapes', name: 'Grapes', growthTime: 240, yield: 1, note: 'Yields Grapes' },
  cotton: { id: 'cotton', name: 'Cotton', growthTime: 300, yield: 3 },
  oat: { id: 'oat', name: 'Oat', growthTime: 180, yield: 2 },
  saffron: { id: 'saffron', name: 'Saffron', growthTime: 360, yield: 3 },
  sapling_patch: { id: 'sapling_patch', name: 'Sapling', growthTime: 600, yield: 1, note: 'Yields Saplings' },
  mud_pit: { id: 'mud_pit', name: 'Mud Pit', growthTime: 240, yield: 1, note: 'Yields Mud' },
  chili: { id: 'chili', name: 'Chili', growthTime: 120, yield: 1, note: 'Yields Chili' },
};
