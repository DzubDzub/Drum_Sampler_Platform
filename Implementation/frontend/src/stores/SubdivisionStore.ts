import { create } from "zustand";

type Subdivision = {
  label: string;
  value: string;
  img: string;
};

type SubdivisionState = {
  selectedSubdivision: Subdivision;
  setSelectedSubdivision: (sub: Subdivision) => void;
};

const useSubdivisionStore = create<SubdivisionState>((set) => ({
  selectedSubdivision: {
    label: "Sixteen Notes",
    value: "16n",
    img: "/images/sixteenth.png",
  },
  setSelectedSubdivision: (sub) => {
    set({ selectedSubdivision: sub });
    //console.log("sub:", sub);
  },
}));

export default useSubdivisionStore;
