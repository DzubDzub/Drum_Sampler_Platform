import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as Tone from "tone";
import ABCJS from "abcjs";
import * as NotationAPI from "./NotationAPI";
import * as CreateURL from "./CreateURL";
import { InstrumentTypeEnum } from "./InstrumentTypeEnum";
import StepButton from "./StepButton";
import useInstrumentModeStore from "stores/InstrumentModeStore";
import useTimeSignatureStore from "../stores/TimeSignatureStore";
import useSubdivisionStore from "../stores/SubdivisionStore";
import SubdivisionDropdown from "components/SubdivisionDropdown";
import TimeSignatureSelector from "components/TimeSignatureSelector";

const subdivisionMap: Record<
  string,
  { label: string; value: string; img: string }
> = {
  "1/16": {
    label: "Sixteen Notes",
    value: "16n",
    img: "/images/sixteenth.png",
  },
  "1/32": {
    label: "Thirtysecond Notes",
    value: "32n",
    img: "/images/thirtySecond.png",
  },
  // Add more if needed
};

function DrumTool({ bpm, isPlaying }: { bpm: number; isPlaying: boolean }) {
  const beatsPerMeasure = useTimeSignatureStore(
    (state) => state.beatsPerMeasure,
  );
  const noteValue = useTimeSignatureStore((state) => state.noteValue);
  const selectedSubdivision = useSubdivisionStore(
    (state) => state.selectedSubdivision,
  );
  const setBeatsPerMeasure = useTimeSignatureStore(
    (state) => state.setBeatsPerMeasure,
  );
  const setNoteValue = useTimeSignatureStore((state) => state.setNoteValue);
  const { setSelectedSubdivision } = useSubdivisionStore.getState();

  const [TIME_MEASURE, setTimeMeasure] = useState("16n");

  useEffect(() => {
    if (["8n", "16n", "32n"].includes(selectedSubdivision.value)) {
      setTimeMeasure(selectedSubdivision.value);
    } else {
      setTimeMeasure("16n");
    }
  }, [selectedSubdivision.value]);

  // const [bars, setbars] = useState(1);

  const NUM_STEPS = useMemo(() => {
    let multiplier = 1;

    if (noteValue === 4) {
      switch (selectedSubdivision.value) {
        case "8n":
          multiplier = 2;
          break;
        case "16n":
          multiplier = 4;
          break;
        case "32n":
          multiplier = 8;
          break;
        default:
          multiplier = 4;
          break;
      }
    } else if (noteValue === 8) {
      switch (selectedSubdivision.value) {
        case "8n":
          multiplier = 1;
          break;
        case "16n":
          multiplier = 2;
          break;
        case "32n":
          multiplier = 4;
          break;
        default:
          multiplier = 2;
          break;
      }
    }

    return beatsPerMeasure * multiplier; //* bars;
  }, [beatsPerMeasure, noteValue, selectedSubdivision.value /*, bars*/]);

  const rests = "z".repeat(beatsPerMeasure);
  const [notationString, setNotationString] = useState(`
    M:${beatsPerMeasure}/${noteValue}
    L:${noteValue === 4 ? "1/4" : "1/8"}
    K:C clef=perc
    V:1 stem=up
    ${rests}
  `);

  useEffect(() => {
    //when number of steps changes, the notation string/stuff should be updated
    setNotationString(
      NotationAPI.resize(NUM_STEPS, beatsPerMeasure, selectedSubdivision.value),
    );
  }, [NUM_STEPS]);

  const { selectedInstrumentMode } = useInstrumentModeStore();
  const { selectedInstrument } = useInstrumentModeStore();

  //useRef so the sampler is not reloaded everytime the component updates
  const samplerRef = useRef<Tone.Sampler | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  //isLoaded when audio samples are ready to be played
  const [isLoaded, setIsLoaded] = useState(false);
  //currentStep that is played in the sequencer
  const [currentStep, setCurrentStep] = useState(-1);

  //string to display in stave and in URL

  //arrays for steps for each instrument, has initial size and all are false (not playing), for UI
  const [hihatSteps, setHihatSteps] = useState<boolean[]>(
    Array(16).fill(false),
  ); //default size 16 and value false
  const [hTomSteps, setHTomSteps] = useState<boolean[]>(Array(16).fill(false));
  const [snareSteps, setSnareSteps] = useState<boolean[]>(
    Array(16).fill(false),
  );
  const [lTomSteps, setLTomSteps] = useState<boolean[]>(Array(16).fill(false));
  const [kickSteps, setKickSteps] = useState<boolean[]>(Array(16).fill(false));
  const buttonSteps: boolean[][] = [
    hihatSteps,
    hTomSteps,
    snareSteps,
    lTomSteps,
    kickSteps,
  ];
  const setButtonSteps = [
    setHihatSteps,
    setHTomSteps,
    setSnareSteps,
    setLTomSteps,
    setKickSteps,
  ];
  //references for the next steps, to be used in the next loop cycle
  let nextHihatStepsRef = useRef<string[]>([]);
  let nextSnareStepsRef = useRef<string[]>([]);
  let nextKickStepsRef = useRef<string[]>([]);
  let nextLTomStepsRef = useRef<string[]>([]);
  let nextHTomStepsRef = useRef<string[]>([]);
  let nextInstrumentsStepsRef = [
    nextHihatStepsRef,
    nextHTomStepsRef,
    nextSnareStepsRef,
    nextLTomStepsRef,
    nextKickStepsRef,
  ];
  let hihatStepsCopyRef = useRef<string[]>([]);
  let hTomStepsCopyRef = useRef<string[]>([]);
  let snareStepsCopyRef = useRef<string[]>([]);
  let lTomStepsCopyRef = useRef<string[]>([]);
  let kickStepsCopyRef = useRef<string[]>([]);

  useEffect(() => {
    //called when beatsPerMeasure or noteValue was changed. Currently we only support beatsPerMeasure change.
    setTimeMeasure(noteValue === 4 ? "16n" : "8n");
  }, [beatsPerMeasure, noteValue]);

  useEffect(() => {
    //when subdivision changes, the selected buttons need to be adjusted accordingly, same applies for the ref/playback
    correctButtonSelectionSub(
      Number(selectedSubdivision.value.replace("n", "")),
    );
    correctRefSubdivision(Number(selectedSubdivision.value.replace("n", "")));
  }, [selectedSubdivision.value]);

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    if (
      !(
        //ensures likely-valid link
        (
          queryParameters.get("H") &&
          queryParameters.get("HT") &&
          queryParameters.get("S") &&
          queryParameters.get("LT") &&
          queryParameters.get("K")
        )
      )
    )
      return;

    const hihats: string[] = (queryParameters.get("H") ?? "")
      .split("")
      .map((char) =>
        ["0", "1", "2", "3", "4", "5", "6", "7"].includes(char) ? char : "",
      ); //split string into char array and check that only valid instruments are given
    const highToms: string[] = (queryParameters.get("HT") ?? "")
      .split("")
      .map((char) => (["0", "1", "2"].includes(char) ? char : "")); //split string into char array and check that only valid instruments are given
    const snares: string[] = (queryParameters.get("S") ?? "")
      .split("")
      .map((char) =>
        ["0", "1", "2", "3", "4", "5"].includes(char) ? char : "",
      ); //split string into char array and check that only valid instruments are given
    const lowToms: string[] = (queryParameters.get("LT") ?? "")
      .split("")
      .map((char) => (["0", "1", "2"].includes(char) ? char : "")); //split string into char array and check that only valid instruments are given
    const kicks: string[] = (queryParameters.get("K") ?? "")
      .split("")
      .map((char) => (["0", "1"].includes(char) ? char : "")); //split string into char array and check that only valid instruments are given
    let notationString: string = "";
    notationString =
      "M:" + (queryParameters.get("M") ?? "4/4").replace("-", "/") + "\n";
    notationString +=
      "L:" + (queryParameters.get("N") ?? "1/16").replace("-", "/") + "\n";
    notationString += "K:C clef=perc\nV:1 stem=up\n";
    const noteValueTemp: number = Number(
      (queryParameters.get("M") ?? "4/4").charAt(2),
    );
    const beatsPerMeasureTemp: number = Number(
      (queryParameters.get("M") ?? "4").charAt(0),
    );
    const subdivisionLabelTemp =
      subdivisionMap[(queryParameters.get("N") ?? "1/16").replace("-", "/")];
    const subdivisionTemp: number = Number(
      (queryParameters.get("N") ?? "1/16").replace("1-", ""),
    );
    const numberStepsTemp: number =
      (subdivisionTemp / noteValueTemp) * beatsPerMeasureTemp;

    //setNotationString(notationString);
    setNoteValue(noteValueTemp);
    setBeatsPerMeasure(beatsPerMeasureTemp);
    // console.log("numberStepsTemp", numberStepsTemp);
    // console.log("beatsPerMeasureTemp", beatsPerMeasureTemp);
    // console.log("noteValueTemp", noteValueTemp);
    // console.log("subdivisionTemp", subdivisionTemp);
    setSelectedSubdivision(subdivisionLabelTemp);
    NotationAPI.resize(
      numberStepsTemp,
      beatsPerMeasureTemp,
      subdivisionTemp + "",
    );

    let hihatStepsCopy = new Array(numberStepsTemp).fill(false);
    let hTomStepsCopy = new Array(numberStepsTemp).fill(false);
    let snareStepsCopy = new Array(numberStepsTemp).fill(false);
    let lTomStepsCopy = new Array(numberStepsTemp).fill(false);
    let kickStepsCopy = new Array(numberStepsTemp).fill(false);

    for (let i: number = 0; i < hihats.length; i++) {
      if (hihats[i]) {
        toggleStep(
          setHihatSteps,
          hihatSteps,
          i,
          InstrumentTypeEnum.Hihat,
          InstrumentTypeEnum.Hihat.get(Number(hihats[i])), //exact type
          true, //buttonclick
          InstrumentTypeEnum.Hihat, //why this double variable!?!
          true,
        );
        hihatStepsCopy[i] = true;
        hihatStepsCopyRef.current[i] = InstrumentTypeEnum.Hihat.get(
          Number(hihats[i]),
        );
      }
      if (highToms[i]) {
        toggleStep(
          setHTomSteps,
          hTomSteps,
          i,
          InstrumentTypeEnum.HTom,
          InstrumentTypeEnum.HTom.get(Number(highToms[i])), //exact type
          true, //buttonclick
          InstrumentTypeEnum.HTom, //why this double variable!?!
          true,
        );
        hTomStepsCopy[i] = true;
        hTomStepsCopyRef.current[i] = InstrumentTypeEnum.HTom.get(
          Number(highToms[i]),
        );
      }
      if (snares[i]) {
        toggleStep(
          setSnareSteps,
          snareSteps,
          i,
          InstrumentTypeEnum.Snare,
          InstrumentTypeEnum.Snare.get(Number(snares[i])), //exact type
          true, //buttonclick
          InstrumentTypeEnum.Snare, //why this double variable!?!
          true,
        );
        snareStepsCopy[i] = true;
        snareStepsCopyRef.current[i] = InstrumentTypeEnum.Snare.get(
          Number(snares[i]),
        );
      }
      if (lowToms[i]) {
        toggleStep(
          setLTomSteps,
          lTomSteps,
          i,
          InstrumentTypeEnum.LTom,
          InstrumentTypeEnum.LTom.get(Number(lowToms[i])), //exact type
          true, //buttonclick
          InstrumentTypeEnum.LTom, //why this double variable!?!
          true,
        );
        lTomStepsCopy[i] = true;
        lTomStepsCopyRef.current[i] = InstrumentTypeEnum.LTom.get(
          Number(lowToms[i]),
        );
      }
      if (kicks[i]) {
        toggleStep(
          setKickSteps,
          kickSteps,
          i,
          InstrumentTypeEnum.Kick,
          InstrumentTypeEnum.Kick.get(Number(kicks[i])), //exact type
          true, //buttonclick
          InstrumentTypeEnum.Kick, //why this double variable!?!
          true,
        );
        kickStepsCopy[i] = true;
        kickStepsCopyRef.current[i] = InstrumentTypeEnum.Kick.get(
          Number(kicks[i]),
        );
      }
    }
    setHihatSteps(hihatStepsCopy);
    setHTomSteps(hTomStepsCopy);
    setSnareSteps(snareStepsCopy);
    setLTomSteps(lTomStepsCopy);
    setKickSteps(kickStepsCopy);
    nextHihatStepsRef.current = hihatStepsCopyRef.current;
    nextHTomStepsRef.current = hTomStepsCopyRef.current;
    nextSnareStepsRef.current = snareStepsCopyRef.current;
    nextLTomStepsRef.current = lTomStepsCopyRef.current;
    nextKickStepsRef.current = kickStepsCopyRef.current;

    //setNotationString(notationString);
    //return notationString;
  }, []);

  useEffect(() => {
    const sampler = new Tone.Sampler(
      {
        A1: "./samples/hihat.mp3",
        A2: "./samples/hihat-open.mp3",
        A3: "./samples/hihat-accent.mp3",
        A4: "./samples/hihat-click.mp3",
        A5: "./samples/ride.mp3",
        A6: "./samples/ride-bell.mp3",
        A7: "./samples/crash.mp3",
        B1: "./samples/high-tom.mp3",
        B2: "./samples/high-tom.mp3", // TODO: replace with an actual flam
        C1: "./samples/snare.mp3",
        C2: "./samples/snare-ghost.mp3",
        C3: "./samples/snare-flam.mp3",
        C4: "./samples/snare-click.mp3",
        C5: "./samples/buzz-roll.mp3",
        D1: "./samples/low-tom.mp3",
        D2: "./samples/low-tom.mp3", // TODO: replace with an actual flam
        E1: "./samples/kick.mp3",
      },
      () => setIsLoaded(true),
    ).toDestination();

    samplerRef.current = sampler;

    return () => {
      sampler.dispose();
    };
  }, []);

  useEffect(() => {
    //for browsers to allow audio playback
    Tone.start();

    //stave all notes help
    /*const abcNotation = `
            M:4/4
            L:1/4
            K:C clef=perc
            "^Bass"F|"^Snare"c|"^High tom"e|"^Mid tom"d|"^Low tom"B"^Floor tom"A|
            "^China"^b|"Crash"^a|"^Hi-hat"^g|"Ride" ^f|"Hi-hat Pedal"_D|
          `;
    */
    //get the element to render the stave
    const element = document.getElementById("stave-container");

    //make sure element is not null before rendering
    if (element) {
      requestAnimationFrame(() => {
        ABCJS.renderAbc(element, notationString);
      });
    } else {
      console.error("The stave container element was not found.");
    }
    console.log(createURL());
  }, [notationString]);

  //for looping the pattern
  useEffect(() => {
    //dont start loop if samples not loaded or if loop already exists in useRef
    if (!isLoaded || loopRef.current) return;

    const loop = new Tone.Loop((time) => {
      setCurrentStep((prevStep) => {
        const step: number = (prevStep + 1) % NUM_STEPS;

        if (samplerRef.current) {
          if (nextHihatStepsRef.current[step])
            switch (nextHihatStepsRef.current[step]) {
              case InstrumentTypeEnum.Hihat.Closed:
                samplerRef.current.triggerAttack("A1", time);
                break;
              case InstrumentTypeEnum.Hihat.Open:
                samplerRef.current.triggerAttack("A2", time);
                break;
              case InstrumentTypeEnum.Hihat.Accented:
                samplerRef.current.triggerAttack("A3", time);
                break;
              case InstrumentTypeEnum.Hihat.Click:
                samplerRef.current.triggerAttack("A4", time);
                break;
              case InstrumentTypeEnum.Hihat.Ride:
                samplerRef.current.triggerAttack("A5", time);
                break;
              case InstrumentTypeEnum.Hihat.RideBell:
                samplerRef.current.triggerAttack("A6", time);
                break;
              case InstrumentTypeEnum.Hihat.Crash:
                samplerRef.current.triggerAttack("A7", time);
                break;
            }
          if (nextHTomStepsRef.current[step])
            switch (nextHTomStepsRef.current[step]) {
              case InstrumentTypeEnum.HTom.Regular:
                samplerRef.current.triggerAttack("B1", time);
                break;
              case InstrumentTypeEnum.HTom.Flam:
                samplerRef.current.triggerAttack("B2", time);
                break;
            }
          if (nextSnareStepsRef.current[step])
            switch (nextSnareStepsRef.current[step]) {
              case InstrumentTypeEnum.Snare.Regular:
                samplerRef.current.triggerAttack("C1", time);
                break;
              case InstrumentTypeEnum.Snare.Ghost:
                samplerRef.current.triggerAttack("C2", time);
                break;
              case InstrumentTypeEnum.Snare.Flam:
                samplerRef.current.triggerAttack("C3", time);
                break;
              case InstrumentTypeEnum.Snare.Click:
                samplerRef.current.triggerAttack("C4", time);
                break;
              case InstrumentTypeEnum.Snare.Buzz:
                samplerRef.current.triggerAttack("C5", time);
            }
          if (nextLTomStepsRef.current[step])
            switch (nextLTomStepsRef.current[step]) {
              case InstrumentTypeEnum.LTom.Regular:
                samplerRef.current.triggerAttack("D1", time);
                break;
              case InstrumentTypeEnum.LTom.Flam:
                samplerRef.current.triggerAttack("D2", time);
                break;
            }
          if (nextKickStepsRef.current[step])
            samplerRef.current.triggerAttack("E1", time);
        }

        return step;
      });
    }, TIME_MEASURE);

    loop.start(0);
    loopRef.current = loop;

    return () => {
      loop.dispose();
      loopRef.current = null;
    };
  }, [isLoaded, NUM_STEPS, TIME_MEASURE]);

  //updates the bpm reactively
  useEffect(() => {
    if (isLoaded) {
      Tone.Transport.bpm.value = bpm;
    }
  }, [bpm, isLoaded]);

  //play/pause playback
  useEffect(() => {
    if (isPlaying && isLoaded) {
      setCurrentStep(-1);
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      setCurrentStep(-1);
    }
  }, [isPlaying, isLoaded]);

  //toggle a single step
  const toggleStep = useCallback(
    (
      setSteps: any,
      steps: boolean[],
      index: number,
      type: InstrumentTypeEnum,
      exactType: string,
      buttonClick: boolean,
      instrumentType: InstrumentTypeEnum,
      isOnUrlLoad: boolean,
    ) => {
      //copy the array into a new one to change values in the copy
      const newSteps = [...steps];
      let onlyInstrumentChange: boolean = false;
      switch (type) {
        case InstrumentTypeEnum.Hihat:
          [onlyInstrumentChange, exactType] = stepClick(
            nextHihatStepsRef,
            buttonClick,
            index,
            newSteps,
            exactType,
            instrumentType,
          );
          console.log("NuMSteps in toggle step", NUM_STEPS);
          break;
        case InstrumentTypeEnum.HTom:
          [onlyInstrumentChange, exactType] = stepClick(
            nextHTomStepsRef,
            buttonClick,
            index,
            newSteps,
            exactType,
            instrumentType,
          );
          break;
        case InstrumentTypeEnum.Snare:
          [onlyInstrumentChange, exactType] = stepClick(
            nextSnareStepsRef,
            buttonClick,
            index,
            newSteps,
            exactType,
            instrumentType,
          );
          break;
        case InstrumentTypeEnum.LTom:
          [onlyInstrumentChange, exactType] = stepClick(
            nextLTomStepsRef,
            buttonClick,
            index,
            newSteps,
            exactType,
            instrumentType,
          );
          break;
        case InstrumentTypeEnum.Kick:
          [onlyInstrumentChange, exactType] = stepClick(
            nextKickStepsRef,
            buttonClick,
            index,
            newSteps,
            exactType,
            instrumentType,
          );
          break;
        default:
          break;
      }

      //update the state with the new array
      setSteps(newSteps);

      //convert/cast to subdivision as number
      const subdivision: number = Number(
        selectedSubdivision.value.replace("n", ""),
      );
      let newNotationString = NotationAPI.draw(
        type,
        index,
        exactType,
        NUM_STEPS,
        beatsPerMeasure,
        noteValue,
        subdivision,
        isOnUrlLoad,
      );
      if (onlyInstrumentChange)
        // the special case of ONLY CHANGING the instrument, easiest simply calling the draw method twice
        newNotationString = NotationAPI.draw(
          type,
          index,
          exactType,
          NUM_STEPS,
          beatsPerMeasure,
          noteValue,
          subdivision,
          isOnUrlLoad,
        );
      setNotationString(newNotationString);
    },
    [NUM_STEPS, selectedSubdivision.value, beatsPerMeasure],
  );
  function stepClick(
    ref: RefObject<string[]>,
    buttonClick: boolean,
    index: number,
    newSteps: Array<boolean>,
    exactType: string,
    instrumentType: InstrumentTypeEnum,
  ): [boolean, string] {
    //return if there was only an instrument change, not a button on/off + exact type
    if (buttonClick) {
      //if the button was clicked and it was on before, it should switch off whatever note
      if (ref.current[index]) {
        newSteps[index] = !newSteps[index]; //toggle step on or off / flip value
        ref.current[index] = ""; //equal to InstrumentTypeEnum.Hihat.off
      } else {
        //button was clicked but was off -> switch on
        if (
          selectedInstrument === instrumentType &&
          selectedInstrument !== ""
        ) {
          //if instrument mode selector is on then take that instrument mode
          exactType = selectedInstrumentMode;
          newSteps[index] = !newSteps[index]; //toggle step on or off / flip value
          ref.current[index] = exactType;
          return [false, exactType];
        }
        newSteps[index] = !newSteps[index]; //toggle step on or off / flip value
        ref.current[index] = exactType;
      }
    } else {
      if (exactType === ref.current[index]) {
        //if the same instrument was clicked via dropdown, then turn it off
        ref.current[index] = "";
        newSteps[index] = !newSteps[index]; //toggle step on or off / flip value
      } else if (ref.current[index]) {
        //if another instrument was clicked via dop down, only change to selected instrument, dont turn off
        ref.current[index] = exactType;
        return [true, exactType]; //special case of only CHANGING the instrument
      } else {
        //was clicked via drop down, but was off
        ref.current[index] = exactType;
        newSteps[index] = !newSteps[index]; //toggle step on or off / flip value
      }
    }
    return [false, exactType];
  }
  function createURL(): string {
    return CreateURL.createURL(
      beatsPerMeasure,
      noteValue,
      Number(selectedSubdivision.value.replace("n", "")),
      nextInstrumentsStepsRef,
      NUM_STEPS,
    );
  }
  function renderButtons(
    steps: boolean[],
    setSteps: any,
    instrumentType: InstrumentTypeEnum,
    defaultType: string,
  ) {
    const buttons = [];
    for (let i = 0; i < NUM_STEPS; i++) {
      buttons.push(
        <StepButton
          key={i}
          index={i}
          isActive={steps[i]}
          onClick={(
            exactType: string,
            buttonClick: boolean, //buttonClick is for distinguishing between dropdown click or button click
          ) =>
            toggleStep(
              setSteps,
              steps,
              i,
              instrumentType,
              exactType,
              buttonClick,
              instrumentType,
              false,
            )
          }
          currentStep={currentStep}
          instrumentType={instrumentType}
          defaultType={defaultType}
        />,
      );
    }
    return buttons;
  }
  function correctButtonSelectionSub(subdivisionNew: number) {
    //the method only works if NUM_STEPS was updated BEFORE the call..
    if (subdivisionNew === 32) {
      if (hihatSteps.length === 32) return; //same sub was selected
      for (let i = 0; i < buttonSteps.length; i++) {
        //stepsArray.length = 5
        const stepsArrayCopy: boolean[] = new Array(NUM_STEPS).fill(false);
        for (let k = 0; k < subdivisionNew / 2; k++) {
          stepsArrayCopy[k * 2] = buttonSteps[i][k];
          stepsArrayCopy[k * 2 + 1] = false;
        }
        setButtonSteps[i](stepsArrayCopy);
      }
    }
    if (subdivisionNew === 16) {
      if (hihatSteps.length === 16) return; //same sub was selected
      for (let i = 0; i < buttonSteps.length; i++) {
        //stepsArray.length = 5
        let stepsArrayCopy: boolean[] = new Array(NUM_STEPS).fill(false);
        for (let k = 0; k < subdivisionNew; k++) {
          stepsArrayCopy[k] = buttonSteps[i][k * 2];
        }
        setButtonSteps[i](stepsArrayCopy);
      }
    }
  }
  function correctRefSubdivision(subdivisionNew: number): void {
    if (subdivisionNew == 32) {
      if (nextHihatStepsRef.current.length === 32) return; //same sub was selected
      for (let i = 0; i < nextInstrumentsStepsRef.length; i++) {
        //stepsArray.length = 5
        const nextInstrumentRefCopy: string[] = new Array(NUM_STEPS).fill("");
        for (let k = 0; k < subdivisionNew / 2; k++) {
          nextInstrumentRefCopy[k * 2] = nextInstrumentsStepsRef[i].current[k];
          nextInstrumentRefCopy[k * 2 + 1] = "";
        }
        nextInstrumentsStepsRef[i].current = nextInstrumentRefCopy;
      }
    }
    if (subdivisionNew === 16) {
      if (hihatSteps.length === 16) return; //same sub was selected
      for (let i = 0; i < nextInstrumentsStepsRef.length; i++) {
        //stepsArray.length = 5
        let nextInstrumentRefCopy: string[] = new Array(NUM_STEPS).fill("");
        for (let k = 0; k < subdivisionNew; k++) {
          nextInstrumentRefCopy[k] = nextInstrumentsStepsRef[i].current[k * 2];
        }
        nextInstrumentsStepsRef[i].current = nextInstrumentRefCopy;
      }
    }
  }
  function resetButtonSelection(): void {
    //console.log("reset button selection");
    const stepsArray: boolean[] = new Array(NUM_STEPS).fill(false);
    setHihatSteps(stepsArray);
    setHTomSteps(stepsArray);
    setSnareSteps(stepsArray);
    setLTomSteps(stepsArray);
    setKickSteps(stepsArray);
  }
  function resetRef(): void {
    nextHihatStepsRef.current = new Array(NUM_STEPS).fill("");
    nextHTomStepsRef.current = new Array(NUM_STEPS).fill("");
    nextSnareStepsRef.current = new Array(NUM_STEPS).fill("");
    nextLTomStepsRef.current = new Array(NUM_STEPS).fill("");
    nextKickStepsRef.current = new Array(NUM_STEPS).fill("");
  }

  return (
    <div className="w-full px-2 sm:px-4 md:px-8">
      <SubdivisionDropdown></SubdivisionDropdown>
      <div
        id="stave-container"
        style={{ width: "100%", height: "200px" }}
        className="max-w-full overflow-x-auto"
      ></div>

      <div className="w-full my-4 border-t border-gray-300" />

      {isLoaded ? (
        <div className="w-full m-5 space-y-4">
          <div className="flex flex-col items-center w-full max-w-full">
            <div
              className="w-full"
              style={{
                overflowX: "auto",
                maxWidth: "100%",
              }}
            >
              <div className="min-w-[400px]">
                <div className="flex flex-col">
                  <div className="flex m-1">
                    <p className="flex-shrink-0 w-20">Cymbals:</p>
                    {renderButtons(
                      hihatSteps,
                      setHihatSteps,
                      InstrumentTypeEnum.Hihat,
                      InstrumentTypeEnum.Hihat.Closed,
                    )}
                  </div>

                  <div className="flex m-1">
                    <p className="flex-shrink-0 w-20">Tom:</p>
                    {renderButtons(
                      hTomSteps,
                      setHTomSteps,
                      InstrumentTypeEnum.HTom,
                      InstrumentTypeEnum.HTom.Regular,
                    )}
                  </div>

                  <div className="flex m-1">
                    <p className="flex-shrink-0 w-20">Snare:</p>
                    {renderButtons(
                      snareSteps,
                      setSnareSteps,
                      InstrumentTypeEnum.Snare,
                      InstrumentTypeEnum.Snare.Regular,
                    )}
                  </div>

                  <div className="flex m-1">
                    <p className="flex-shrink-0 w-20">Tom:</p>
                    {renderButtons(
                      lTomSteps,
                      setLTomSteps,
                      InstrumentTypeEnum.LTom,
                      InstrumentTypeEnum.LTom.Regular,
                    )}
                  </div>

                  <div className="flex m-1">
                    <p className="flex-shrink-0 w-20">Kick:</p>
                    {renderButtons(
                      kickSteps,
                      setKickSteps,
                      InstrumentTypeEnum.Kick,
                      InstrumentTypeEnum.Kick.Regular,
                    )}
                  </div>

                  {/*<div className="flex flex-col items-center mb-4">*/}
                  {/*  <button*/}
                  {/*    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded mb-2"*/}
                  {/*    onClick={() => {*/}
                  {/*      if (bars > 1) {*/}
                  {/*        setbars(bars - 1);*/}
                  {/*      } else if (bars === 1) {*/}
                  {/*      }*/}
                  {/*      console.log(*/}
                  {/*        "minus bar clicked\nbars:",*/}
                  {/*        bars,*/}
                  {/*        "\nnumsteps: ",*/}
                  {/*        NUM_STEPS,*/}
                  {/*      );*/}
                  {/*    }}*/}
                  {/*  >*/}
                  {/*    ×*/}
                  {/*  </button>*/}
                  {/*  <button*/}
                  {/*    className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"*/}
                  {/*    onClick={() => {*/}
                  {/*      setbars(bars + 1);*/}
                  {/*      console.log(*/}
                  {/*        "plus bar clicked\nbars:",*/}
                  {/*        bars,*/}
                  {/*        "\nnumsteps: ",*/}
                  {/*        NUM_STEPS,*/}
                  {/*      );*/}
                  {/*    }}*/}
                  {/*  >*/}
                  {/*    +*/}
                  {/*  </button>*/}
                  {/*</div>*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default DrumTool;
