// [] - to stack multiple notes
// "^Kick" - to add annotations
// !style=x! - for x head

import { InstrumentTypeEnum } from "./InstrumentTypeEnum";

const rest = "z";
//const nextBeatsPerMeasure = " ";
let beatsPerMeasure: number; //4(<-this one)/4 //The upper number in the time signature tells you how many counts are included in a single measure.  //(The bottom number in the time signature that tells you which note value equals one of those counts.)
let numberSteps: number; //number sequencerButtons ..
let subdivision: number;
let noteValue: number = 4;
//const numberBeatsPerMeasures = 4; //which measurement 16/4 -> 4    (4/4 measure + 1/16th notes)x

let basicNotationString = "M:4/4\nL:1/16\nK:C clef=perc\n"; // this should also be determined by method call -> Do I want M:4/4 or 8/4 etc
let stringArrayHihat: string[] = new Array(16).fill(""); //fixed size?!
let stringArrayHTom: string[] = new Array(16).fill(""); //fixed size?!
let stringArraySnare: string[] = new Array(16).fill(""); //fixed size?!
let stringArrayLTom: string[] = new Array(16).fill(""); //fixed size?!
let stringArrayKick: string[] = new Array(16).fill(""); //fixed size?!
let instrumentArrays: string[][] = [
  stringArrayHihat,
  stringArrayHTom,
  stringArraySnare,
  stringArrayLTom,
  stringArrayKick,
];
export function draw(
  instrumentType: InstrumentTypeEnum,
  index: number,
  exactType: string,
  numberStepsPassed: number,
  beatsPerMeasureInput: number,
  noteValueInput: number,
  subdivisionInput: number,
  isOnUrlLoad: boolean,
): string {
  if (!isOnUrlLoad) {
    subdivision = subdivisionInput;
    noteValue = noteValueInput;
    basicNotationString = `
    M:${beatsPerMeasureInput}/${noteValue}
    L:${subdivision === 16 ? "1/16" : "1/32"}
    K:C clef=perc
    V:1 stem=up
  `; //L: only supports 16th/32th yet

    numberSteps = numberStepsPassed;
    beatsPerMeasure = beatsPerMeasureInput;
    //if it changes to beatsPerMeasure 1/16 or 1/32 or changes the time signature
    //it ensures correct array length + keeping the notation just cut or lengthening to according sub division
  }

  switch (instrumentType) {
    case InstrumentTypeEnum.Hihat:
      if (stringArrayHihat[index]) {
        stringArrayHihat[index] = "";
        if (index % (subdivision / noteValue) !== 0) {
          //if ===0 it is simply a rest and is handled by the assembleNotationString()
          findNotesBeforeAndCorrectLength(index, exactType);
        }
      } else {
        determineNoteLength(stringArrayHihat, index, exactType);
        correctNoteValueBefore(index);
      }
      break;
    case InstrumentTypeEnum.HTom:
      if (stringArrayHTom[index]) {
        stringArrayHTom[index] = "";
        if (index % (subdivision / noteValue) !== 0) {
          //if ===0 it is simply a rest and is handled by the assembleNotationString()
          findNotesBeforeAndCorrectLength(index, exactType);
        }
      } else {
        determineNoteLength(stringArrayHTom, index, exactType);
        correctNoteValueBefore(index);
      }
      break;
    case InstrumentTypeEnum.Snare:
      if (stringArraySnare[index]) {
        stringArraySnare[index] = "";
        if (index % (subdivision / noteValue) !== 0) {
          //if ===0 it is simply a rest and is handled by the assembleNotationString()
          findNotesBeforeAndCorrectLength(index, exactType);
        }
      } else {
        determineNoteLength(stringArraySnare, index, exactType);
        correctNoteValueBefore(index);
      }
      break;
    case InstrumentTypeEnum.LTom:
      if (stringArrayLTom[index]) {
        stringArrayLTom[index] = "";
        if (index % (subdivision / noteValue) !== 0) {
          //if ===0 it is simply a rest and is handled by the assembleNotationString()
          findNotesBeforeAndCorrectLength(index, exactType);
        }
      } else {
        determineNoteLength(stringArrayLTom, index, exactType);
        correctNoteValueBefore(index);
      }
      break;
    case InstrumentTypeEnum.Kick:
      if (stringArrayKick[index]) {
        stringArrayKick[index] = "";
        if (index % (subdivision / noteValue) !== 0) {
          //if ===0 it is simply a rest and is handled by the assembleNotationString()
          findNotesBeforeAndCorrectLength(index, exactType);
        }
      } else {
        determineNoteLength(stringArrayKick, index, exactType);
        correctNoteValueBefore(index);
      }
  }
  return assembleNotationString();
}

function determineNoteLength(
  stringArrayInstrument: any,
  index: number,
  instrument: string,
): void {
  stringArrayInstrument[index] = instrument;
  //in the following we need to know how long this note should be and we need to have a correct grouping of notes
  let number: number =
    subdivision / noteValue - (index % (subdivision / noteValue)); //break down the position in to four-groupings (4/16= 1/4). 4 - the position equals note value
  let numb: number =
    subdivision / noteValue - ((index + 1) % (subdivision / noteValue)); //note value
  for (let j = index + 1; j % (subdivision / noteValue) !== 0; j++) {
    //check if there comes a note afterwards within the fourth-grouping (would change the note value)
    if (
      stringArrayHihat[j] ||
      stringArrayHTom[j] ||
      stringArraySnare[j] ||
      stringArrayLTom[j] ||
      stringArrayKick[j]
    ) {
      //if notEmptyString
      number -= numb;
      break;
    }
    numb--;
  }
  if (number > 1) {
    //if number === 2,3,4 (16th example)
    stringArrayInstrument[index] = stringArrayInstrument[index] + number;
  }
}

function correctNoteValueBefore(index: number): void {
  //now change the notes before to the correct note value
  let numb = 1;
  for (
    let j = index - 1;
    j !== -1 && j % (subdivision / noteValue) !== subdivision / noteValue - 1;
    j--
  ) {
    if (
      stringArrayHihat[j] ||
      stringArrayHTom[j] ||
      stringArraySnare[j] ||
      stringArrayLTom[j] ||
      stringArrayKick[j]
    ) {
      if (stringArrayHihat[j]) {
        if (numb > 1) {
          stringArrayHihat[j] = stringArrayHihat[j].replace(/\d$/, "") + numb;
        } else {
          stringArrayHihat[j] = stringArrayHihat[j].replace(/\d$/, "");
        }
      }
      if (stringArrayHTom[j]) {
        if (numb > 1) {
          stringArrayHTom[j] = stringArrayHTom[j].replace(/\d$/, "") + numb;
        } else {
          stringArrayHTom[j] = stringArrayHTom[j].replace(/\d$/, "");
        }
      }
      if (stringArraySnare[j]) {
        if (numb > 1) {
          stringArraySnare[j] = stringArraySnare[j].replace(/\d$/, "") + numb;
        } else {
          stringArraySnare[j] = stringArraySnare[j].replace(/\d$/, "");
        }
      }
      if (stringArrayLTom[j]) {
        if (numb > 1) {
          stringArrayLTom[j] = stringArrayLTom[j].replace(/\d$/, "") + numb;
        } else {
          stringArrayLTom[j] = stringArrayLTom[j].replace(/\d$/, "");
        }
      }
      if (stringArrayKick[j]) {
        if (numb > 1) {
          stringArrayKick[j] = stringArrayKick[j].replace(/\d$/, "") + numb;
        } else {
          stringArrayKick[j] = stringArrayKick[j].replace(/\d$/, "");
        }
      }
      break;
    }
    numb++;
  }
}

function assembleNotationString(): string {
  //each on click the notationString is regenerated! Thats a big performance loss. To improve it should be only updated
  let notationString: string = basicNotationString;
  for (let j = 0; j < stringArrayHihat.length; j++) {
    //checking for potential rest
    if (
      j % (subdivision / noteValue) === 0 &&
      !stringArrayHihat[j] &&
      !stringArrayHTom[j] &&
      !stringArraySnare[j] &&
      !stringArrayLTom[j] &&
      !stringArrayKick[j]
    ) {
      //this could also be done immediately when correctingNoteBefore() but would make it more complicated + possibly more checks/updates
      let numb = 1;
      for (let k = j + 1; k % (subdivision / noteValue) !== 0; k++) {
        //subdivision/noteValue e.g. 4/4 and 32th notes -> 32/4 = 8. Thats how to find out groupings
        if (
          stringArrayHihat[k] ||
          stringArrayHTom[k] ||
          stringArraySnare[k] ||
          stringArrayLTom[k] ||
          stringArrayKick[k]
        )
          break;
        numb++;
      }
      if (numb > 1) {
        notationString += rest + numb;
      } else {
        notationString += rest;
      }
    } else {
      let flamUsed: boolean = false; //Only one flam can be displayed. If the user selects two flams at the same time, the page shouldnt crash
      let stringArrayHihatTemp: string = stringArrayHihat[j];
      let stringArrayHTomTemp: string = stringArrayHTom[j];
      let stringArraySnareTemp: string = stringArraySnare[j];
      let stringArrayLTomTemp: string = stringArrayLTom[j];
      if (stringArrayHihat[j].includes('"O"')) {
        //fix notation bug/syntax for open Hihat
        stringArrayHihatTemp = stringArrayHihat[j].replace('"O"', "");
        notationString += '"O"';
      }
      if (stringArrayHTom[j].includes("{e}")) {
        //fix notation bug/syntax for hTom flam
        if (!flamUsed) notationString += "{e}";
        stringArrayHTomTemp = stringArrayHTom[j].replace("{e}", "");
        flamUsed = true;
      }
      if (stringArraySnare[j].includes("{c}")) {
        //fix notation bug/syntax for snare flam
        if (!flamUsed) notationString += "{c}";
        stringArraySnareTemp = stringArraySnare[j].replace("{c}", "");
        flamUsed = true;
      }
      if (stringArrayLTom[j].includes("{A}")) {
        //fix notation bug/syntax for lTom flam
        if (!flamUsed) notationString += "{A}";
        stringArrayLTomTemp = stringArrayLTom[j].replace("{A}", "");
        flamUsed = true;
      }

      notationString +=
        "[" +
        stringArrayHihatTemp +
        stringArrayHTomTemp +
        stringArraySnareTemp +
        stringArrayLTomTemp +
        stringArrayKick[j] +
        "]";
    }
    if ((j + 1) % (subdivision / noteValue) === 0) notationString += " ";
    if ((j + 1) % (beatsPerMeasure * (subdivision / noteValue)) === 0)
      notationString += "|";
  }
  notationString = notationString.replace(/\[\]/g, "");
  console.log(notationString);
  return notationString;
}

function findNotesBeforeAndCorrectLength(
  index: number,
  exactType: string,
): void {
  for (
    let i = index - 1;
    i !== -1 && i % (subdivision / noteValue) !== subdivision / noteValue - 1;
    i--
  ) {
    if (
      stringArrayHihat[i] ||
      stringArrayHTom[i] ||
      stringArraySnare[i] ||
      stringArrayLTom[i] ||
      stringArrayKick[i]
    ) {
      if (stringArrayHihat[i]) {
        const instrument: string = stringArrayHihat[i].replace(/\d$/, "");
        determineNoteLength(stringArrayHihat, i, instrument);
      }
      if (stringArrayHTom[i]) {
        const instrument: string = stringArrayHTom[i].replace(/\d$/, "");
        determineNoteLength(stringArrayHTom, i, instrument);
      }
      if (stringArraySnare[i]) {
        const instrument: string = stringArraySnare[i].replace(/\d$/, "");
        determineNoteLength(stringArraySnare, i, instrument);
      }
      if (stringArrayLTom[i]) {
        const instrument: string = stringArrayLTom[i].replace(/\d$/, "");
        determineNoteLength(stringArrayLTom, i, instrument);
      }
      if (stringArrayKick[i]) {
        const instrument: string = stringArrayKick[i].replace(/\d$/, "");
        determineNoteLength(stringArrayKick, i, instrument);
      }
    }
  }
}
function resizeArrays(): void {
  //!!ONLY SUPPORTS 32th/16th yet..!!
  let stringArrayHihatCopy: string[] = new Array(numberSteps).fill("");
  let stringArrayHTomCopy: string[] = new Array(numberSteps).fill("");
  let stringArraySnareCopy: string[] = new Array(numberSteps).fill("");
  let stringArrayLTomCopy: string[] = new Array(numberSteps).fill("");
  let stringArrayKickCopy: string[] = new Array(numberSteps).fill("");
  let copies: string[][] = [
    stringArrayHihatCopy,
    stringArrayHTomCopy,
    stringArraySnareCopy,
    stringArrayLTomCopy,
    stringArrayKickCopy,
  ];
  if (subdivision === 32) {
    //hard coded to 32th/16th
    //ensures old notation keeps in
    //console.log("resized to 32th.");
    for (let k = 0; k < instrumentArrays.length; k++) {
      for (let i = 0; i < instrumentArrays[k].length; i++) {
        copies[k][i * 2] = instrumentArrays[k][i] ?? ""; //for safety, if something is undefined.. simply insert ""
        copies[k][i * 2 + 1] = "";
      }
    }
  } else {
    //console.log("resized to 16th.");
    for (let k = 0; k < instrumentArrays.length; k++) {
      for (let i = 0; i < stringArrayHihatCopy.length; i++) {
        copies[k][i] = instrumentArrays[k][i * 2] ?? ""; //for safety, if something is undefined.. simply insert ""
      }
    }
  }
  for (let i = 0; i < instrumentArrays.length; i++) {
    instrumentArrays[i] = copies[i];
  }
  [
    stringArrayHihat,
    stringArrayHTom,
    stringArraySnare,
    stringArrayLTom,
    stringArrayKick,
  ] = copies;

  for (let k = 0; k < instrumentArrays.length; k++) {
    for (let i = 0; i < instrumentArrays[k].length; i++) {
      if (instrumentArrays[k][i])
        determineNoteLength(
          instrumentArrays[k],
          i,
          instrumentArrays[k][i].replace(/\d/, ""),
        );
    }
  }
}

export function resize(
  numberStepsInput: number,
  beatsPerMeasureInput: number,
  subdivisionInput: string,
): string {
  //this method should be called when number of steps has changed
  if (numberSteps === undefined) {
    numberSteps = numberStepsInput; //init
    beatsPerMeasure = beatsPerMeasureInput; //init
    subdivision = Number(subdivisionInput.replace("n", "")); //init
    return basicNotationString + "z4 z4 z4 z4";
  } //it means, the page is loading for the first time/ initialization phase
  if (stringArrayHihat.length === numberStepsInput) {
    //console.log(subdivision);
    //console.log("numberSteps: ", numberSteps);
    //console.log("numberStepsInput: ", numberStepsInput);
    //console.log(stringArrayHihat);
    basicNotationString = `
    M:${beatsPerMeasureInput}/${noteValue ?? 4}
    L:${subdivision === 16 ? "1/16" : "1/32"}
    K:C clef=perc
    V:1 stem=up
  `;
    return assembleNotationString();
  }

  let bPMChanged: boolean = false;
  if (beatsPerMeasureInput !== beatsPerMeasure) bPMChanged = true;
  numberSteps = numberStepsInput;
  subdivision = Number(subdivisionInput.replace("n", ""));
  beatsPerMeasure = beatsPerMeasureInput;
  basicNotationString = `
    M:${beatsPerMeasureInput}/${noteValue ?? 4}
    L:${subdivision === 16 ? "1/16" : "1/32"}
    K:C clef=perc
    V:1 stem=up
  `;
  if (bPMChanged) return resetAll();
  else resizeArrays();
  return assembleNotationString();
}

function resetAll(): string {
  //resets notationString, displays empty stuff. Is called when resetting groove or beatsPerMeasure was changed
  stringArrayHihat = new Array(numberSteps).fill("");
  stringArrayHTom = new Array(numberSteps).fill("");
  stringArraySnare = new Array(numberSteps).fill("");
  stringArrayLTom = new Array(numberSteps).fill("");
  stringArrayKick = new Array(numberSteps).fill("");
  instrumentArrays = [
    stringArrayHihat,
    stringArrayHTom,
    stringArraySnare,
    stringArrayLTom,
    stringArrayKick,
  ];
  return assembleNotationString();
}
