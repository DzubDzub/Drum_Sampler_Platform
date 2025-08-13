import { create } from "zustand";
import { InstrumentTypeEnum } from "components/InstrumentTypeEnum";

interface InstrumentModeStore {
  selectedInstrumentMode: string;
  setSelectedInstrumentMode: (mode: string) => void;
  selectedInstrument: any;
  setSelectedInstrument: (type: any) => void;
}

const useInstrumentModeStore = create<InstrumentModeStore>((set) => ({
  selectedInstrumentMode: "",
  setSelectedInstrumentMode: (mode) => set({ selectedInstrumentMode: mode }),
  selectedInstrument: "",
  setSelectedInstrument: (type) => set({ selectedInstrument: type }),
}));

export default useInstrumentModeStore;
