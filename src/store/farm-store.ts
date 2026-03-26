import { create } from 'zustand';
import { useInventoryStore } from './inventory-store';
import { CROP_GUIDE, CropType } from '@/constants/crops';

export type PlotStatus = 'empty' | 'planted' | 'ready';

export interface FarmPlot {
  id: string;
  status: PlotStatus;
  cropId?: CropType;
  plantedAt?: number; // timestamp in ms
}

interface FarmState {
  plots: Record<string, FarmPlot>; 
  plotIds: string[]; 
  selectedCropId: CropType;
  setSelectedCropId: (cropId: CropType) => void;
  plantCrop: (id: string) => void;
  harvestCrop: (id: string) => void;
  buyPlot: () => void;
}

const getInitialPlots = () => {
  const plots: Record<string, FarmPlot> = {};
  const plotIds: string[] = [];
  const now = Date.now();

  for (let i = 0; i < 32; i++) {
    const id = `plot-${i}`;
    plotIds.push(id);
    
    // Start with 6 empty plots, others are locked (not in plotIds effectively, but here we initialize all)
    // Actually the logic in FarmGrid shows plotIds.length < 32 for BuyPlotTile.
    // So we should only initialize a few.
  }
  
  // Initial 6 plots
  const initialIds = plotIds.slice(0, 6);
  initialIds.forEach((id, index) => {
    plots[id] = {
      id,
      status: 'empty',
    };
    // Randomly plant some for variety
    if (index < 2) {
      plots[id].status = 'ready';
      plots[id].cropId = 'wheat';
    } else if (index < 4) {
      plots[id].status = 'planted';
      plots[id].cropId = 'corn';
      plots[id].plantedAt = now - 30000; // 30s ago
    }
  });

  return { plots, plotIds: initialIds };
};

const initial = getInitialPlots();

export const useFarmStore = create<FarmState>((set) => ({
  plots: initial.plots,
  plotIds: initial.plotIds,
  selectedCropId: 'wheat',

  setSelectedCropId: (cropId) => set({ selectedCropId: cropId }),

  plantCrop: (id) =>
    set((state) => {
      const plot = state.plots[id];
      if (!plot || plot.status !== "empty") return state;

      const hasSeed = useInventoryStore
        .getState()
        .removeResource(state.selectedCropId, 1);
      if (!hasSeed) return state;

      return {
        plots: {
          ...state.plots,
          [id]: {
            ...plot,
            status: "planted",
            cropId: state.selectedCropId,
            plantedAt: Date.now(),
          },
        },
      };
    }),

  harvestCrop: (id) =>
    set((state) => {
      const plot = state.plots[id];
      if (!plot || plot.cropId === undefined) return state;

      const cropDef = CROP_GUIDE[plot.cropId];
      const now = Date.now();
      const elapsed = plot.plantedAt ? (now - plot.plantedAt) / 1000 : 0;
      
      // Verification check (though UI should prevent this)
      if (plot.status === 'planted' && elapsed < cropDef.growthTime) {
        return state;
      }

      useInventoryStore.getState().addResource(plot.cropId, 'crop', cropDef.yield);
      
      return {
        plots: {
          ...state.plots,
          [id]: { ...plot, status: 'empty', cropId: undefined, plantedAt: undefined },
        },
      };
    }),

  buyPlot: () =>
    set((state) => {
      if (state.plotIds.length >= 32) return state;

      const newId = `plot-${state.plotIds.length}`;
      return {
        plotIds: [...state.plotIds, newId],
        plots: {
          ...state.plots,
          [newId]: { id: newId, status: 'empty' },
        },
      };
    }),
}));

