import { create } from "zustand";

interface TimeSignatureStore {
  beatsPerMeasure: number;
  noteValue: number;
  setBeatsPerMeasure: (beats: number) => void;
  setNoteValue: (value: number) => void;
}

const useTimeSignatureStore = create<TimeSignatureStore>((set) => ({
  beatsPerMeasure: 4,
  noteValue: 4,
  setBeatsPerMeasure: (beats) => set({ beatsPerMeasure: beats }),
  setNoteValue: (value) => set({ noteValue: value }),
}));

export default useTimeSignatureStore;
