import React, { useEffect } from "react";
import useTimeSignatureStore from "stores/TimeSignatureStore";
import * as CreateURL from "./CreateURL";
import * as DrumTool from "components/DrumTool";

const TimeSignatureSelector = ({
  resetRef,
  resetButtonSelection,
}: {
  resetRef: () => void;
  resetButtonSelection: () => void;
}) => {
  const beatsPerMeasure = useTimeSignatureStore(
    (state) => state.beatsPerMeasure,
  );
  const noteValue = useTimeSignatureStore((state) => state.noteValue);

  const setBeatsPerMeasure = useTimeSignatureStore(
    (state) => state.setBeatsPerMeasure,
  );
  const setNoteValue = useTimeSignatureStore((state) => state.setNoteValue);
  function handleChange(e: any) {
    setBeatsPerMeasure(parseInt(e.target.value));
    resetButtonSelection();
    resetRef();
  }
  return (
    <div>
      <label>
        Beats per Measure:
        <select value={beatsPerMeasure} onChange={(e) => handleChange(e)}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </label>
      <label>
        Note Value:
        <select
          value={noteValue}
          onChange={(e) => setNoteValue(parseInt(e.target.value))}
        >
          <option value={4}>Quarter Note (4)</option>
          {/*<option value={8}>Eighth Note (8)</option>*/}
        </select>
      </label>
    </div>
  );
};

export default TimeSignatureSelector;
