import React, { useEffect, useState } from "react";
import { InstrumentTypeEnum } from "./InstrumentTypeEnum";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import DrumTool from "components/DrumTool";
import { Instrument } from "tone/build/esm/instrument/Instrument";
import useInstrumentModeStore from "stores/InstrumentModeStore";
import timeSignatureSelector from "components/TimeSignatureSelector";
import useSubdivisionStore from "stores/SubdivisionStore";
import useTimeSignatureStore from "stores/TimeSignatureStore";
//var noteValue = timeSignatureSelector.arguments;

const mapInstrumentTypeWithVariation: Map<
  InstrumentTypeEnum,
  { label: string; value: string }[]
> = new Map<InstrumentTypeEnum, { label: string; value: string }[]>([
  [
    InstrumentTypeEnum.Hihat,
    [
      { label: "Closed Hihat", value: InstrumentTypeEnum.Hihat.Closed },
      { label: "Open Hihat", value: InstrumentTypeEnum.Hihat.Open },
      { label: "Accented Hihat", value: InstrumentTypeEnum.Hihat.Accented },
      { label: "Click Hihat", value: InstrumentTypeEnum.Hihat.Click },
      { label: "Ride", value: InstrumentTypeEnum.Hihat.Ride },
      { label: "Ride Bell", value: InstrumentTypeEnum.Hihat.RideBell },
      { label: "Crash", value: InstrumentTypeEnum.Hihat.Crash },
    ],
  ],
  [
    InstrumentTypeEnum.HTom,
    [
      { label: "High Tom", value: InstrumentTypeEnum.HTom.Regular },
      { label: "Flam", value: InstrumentTypeEnum.HTom.Flam },
    ],
  ],
  [
    InstrumentTypeEnum.Snare,
    [
      { label: "Snare", value: InstrumentTypeEnum.Snare.Regular },
      { label: "Ghost Snare", value: InstrumentTypeEnum.Snare.Ghost },
      { label: "Flam", value: InstrumentTypeEnum.Snare.Flam },
      { label: "Click", value: InstrumentTypeEnum.Snare.Click },
      { label: "Buzz", value: InstrumentTypeEnum.Snare.Buzz },
    ],
  ],
  [
    InstrumentTypeEnum.LTom,
    [
      { label: "Low Tom", value: InstrumentTypeEnum.LTom.Regular },
      { label: "Flam", value: InstrumentTypeEnum.LTom.Flam },
    ],
  ],
  [
    InstrumentTypeEnum.Kick,
    [{ label: "Kick", value: InstrumentTypeEnum.Kick.Regular }],
  ],
]);

const instrumentImageMap: { [key: string]: string } = {
  [InstrumentTypeEnum.Kick.Regular]: "kick.svg",
  [InstrumentTypeEnum.Snare.Regular]: "snare.svg",
  [InstrumentTypeEnum.Snare.Ghost]: "snare.svg",
  [InstrumentTypeEnum.Snare.Flam]: "snare.svg",
  [InstrumentTypeEnum.Snare.Click]: "snare.svg",
  [InstrumentTypeEnum.Snare.Buzz]: "snare.svg",
  [InstrumentTypeEnum.Hihat.Closed]: "hihat.svg",
  [InstrumentTypeEnum.Hihat.Open]: "hihat.svg",
  [InstrumentTypeEnum.Hihat.Accented]: "hihat.svg",
  [InstrumentTypeEnum.Hihat.Click]: "hihat.svg",
  [InstrumentTypeEnum.Hihat.Ride]: "ride.png",
  [InstrumentTypeEnum.Hihat.RideBell]: "ride.png",
  [InstrumentTypeEnum.Hihat.Crash]: "crash.png",
  [InstrumentTypeEnum.HTom.Regular]: "tom.png",
  [InstrumentTypeEnum.HTom.Flam]: "tom.png",
  [InstrumentTypeEnum.LTom.Regular]: "floor-tom.png",
  [InstrumentTypeEnum.LTom.Flam]: "floor-tom.png",
};

interface StepButtonProps {
  index: number;
  isActive: boolean;
  onClick: (exactType: string, buttonClick: boolean) => void;
  currentStep: number;
  instrumentType: InstrumentTypeEnum;
  defaultType: string;
}

const StepButton: React.FC<StepButtonProps> = ({
  index,
  isActive,
  onClick,
  currentStep,
  instrumentType,
  defaultType,
}) => {
  const [currentType, setCurrentType] = useState(defaultType);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const instrumentVariations =
    mapInstrumentTypeWithVariation.get(instrumentType)!;

  const { selectedInstrumentMode } = useInstrumentModeStore();
  const { selectedInstrument } = useInstrumentModeStore();

  const isActiveInstrument =
    selectedInstrument === instrumentType || selectedInstrumentMode === "";

  const { selectedSubdivision } = useSubdivisionStore();
  const beatsPerMeasure = useTimeSignatureStore(
    (state) => state.beatsPerMeasure
  );
  const noteValue = useTimeSignatureStore((state) => state.noteValue);

  // Calculate spacing group size based on rules
  const getGroupSize = () => {
    const subdivision = selectedSubdivision.value;

    if (noteValue === 4) {
      if (subdivision === "8n") return 2;
      if (subdivision === "16n") return 4;
      if (subdivision === "32n") return 8;
    }
    //
    if (noteValue === 8) {
      if (subdivision === "8n") {
        return beatsPerMeasure % 3 === 0 ? 3 : 2;
      }
      if (subdivision === "16n") {
        if (beatsPerMeasure % 6 === 0) return 6;
        if (beatsPerMeasure % 3 === 0) return 3;
        return 2;
      }
      if (subdivision === "32n") {
        if (beatsPerMeasure % 6 === 0) return 12;
        if (beatsPerMeasure % 3 === 0) return 6;
        return 8;
      }
    }

    // default fallback
    return 4;
  };

  const groupSize = getGroupSize();

  return (
    <div
      className="
        relative leading-[0] text-sm rounded"
      style={{
        marginRight: (index + 1) % groupSize === 0 ? "20px" : "4px",
        outline: currentStep === index ? "2px solid red" : "0px solid black",
      }}
    >
      <DropdownMenu open={dropdown} onOpenChange={setDropdown}>
        <DropdownMenuTrigger className="absolute inset-0 -z-10">
          <div></div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {instrumentVariations.map(({ label, value }, i) => (
            <DropdownMenuItem
              key={i}
              onSelect={() => {
                setCurrentType(value);
                onClick(value, false);
              }}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <button
        onContextMenu={(e) => {
          e.preventDefault();
          setDropdown(true);
        }}
        onClick={() => onClick(currentType, true)}
        className="flex items-center justify-center rounded"
        style={{
          width: "3vw",
          height: "3vw",
          backgroundColor: isActive ? "darkgray" : "lightgray",
          opacity: isActiveInstrument ? 1 : 0.5,
          pointerEvents: isActiveInstrument ? "auto" : "none",
        }}
      >
        {instrumentImageMap[currentType] && (
          <img
            src={`/images/${instrumentImageMap[currentType]}`}
            alt={currentType}
            style={{
              width: "70%",
              height: "70%",
              objectFit: "contain",
              opacity: isActive ? 1 : 0.07,
            }}
          />
        )}
      </button>

      <span
        style={{
          fontSize: "10px",
        }}
      >
        {""}
      </span>
    </div>
  );
};

export default StepButton;
