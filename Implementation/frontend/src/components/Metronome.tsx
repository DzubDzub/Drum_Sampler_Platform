import React, { useEffect, useRef, useState } from "react";
import * as Tone from "tone";

function Metronome({ bpm, isPlaying }: { bpm: number; isPlaying: boolean }) {
  const clickRef = useRef<Tone.Player | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  //UI
  const [metronomeState, setMetronomeState] = useState(false);
  const [noteDuration, setNoteDuration] = useState<"4n" | "8n" | "16n">("4n");

  //toggle metronome on/off
  const handleMasterCheckbox = () => {
    setMetronomeState(!metronomeState);
    setIsEnabled(!isEnabled);
  };

  const handleNoteDurationChange = (duration: "4n" | "8n" | "16n") => {
    setNoteDuration(duration);
  };

  useEffect(() => {
    const click = new Tone.Player("./samples/metronome-click.mp3", () =>
      setIsLoaded(true),
    ).toDestination();
    clickRef.current = click;

    return () => {
      click.dispose();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || loopRef.current) return;

    const loop = new Tone.Loop((time) => {
      if (isEnabled) {
        clickRef.current?.start(time);
      }
    }, noteDuration);

    loopRef.current = loop;
    loop.start(0);

    return () => {
      loop.dispose();
      loopRef.current = null;
    };
  }, [isLoaded, isEnabled, noteDuration]);

  useEffect(() => {
    if (isLoaded) {
      Tone.Transport.bpm.value = bpm;
    }
  }, [bpm, isLoaded]);

  useEffect(() => {
    if (isPlaying && isLoaded) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
  }, [isPlaying, isLoaded]);

  return (
    <div className="flex flex-1 gap-2">
      <div>Metronome:</div>
      <input
        type="checkbox"
        name="metronome-global"
        checked={metronomeState}
        onChange={handleMasterCheckbox}
        className="w-5 h-5"
      ></input>

      <div id="metronome-settings" className="flex gap-4 ml-5">
        <input
          type="radio"
          name="metronomeSetting"
          id="4n"
          className="hidden"
          checked={noteDuration === "4n"}
          onChange={() => handleNoteDurationChange("4n")}
          disabled={!metronomeState}
        />
        <label
          htmlFor="4n"
          className={`${noteDuration === "4n" ? "font-bold" : ""} ${
            !metronomeState ? "text-gray-400" : ""
          }`}
        >
          4n
        </label>
        <input
          type="radio"
          name="metronomeSetting"
          id="8n"
          className="hidden"
          checked={noteDuration === "8n"}
          onChange={() => handleNoteDurationChange("8n")}
          disabled={!metronomeState}
        />
        <label
          htmlFor="8n"
          className={`${noteDuration === "8n" ? "font-bold" : ""} ${
            !metronomeState ? "text-gray-400" : ""
          }`}
        >
          8n
        </label>
        <input
          type="radio"
          name="metronomeSetting"
          id="16n"
          className="hidden"
          checked={noteDuration === "16n"}
          onChange={() => handleNoteDurationChange("16n")}
          disabled={!metronomeState}
        />
        <label
          htmlFor="16n"
          className={`${noteDuration === "16n" ? "font-bold" : ""} ${
            !metronomeState ? "text-gray-400" : ""
          }`}
        >
          16n
        </label>
      </div>
    </div>
  );
}

export default Metronome;
