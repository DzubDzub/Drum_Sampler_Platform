import { InstrumentTypeEnum } from "components/InstrumentTypeEnum";

export function createURL(
  beatsPerMeasure: number,
  noteValue: number,
  subdivision: number,
  instrumentArrays: React.RefObject<string[]>[],
  numSteps: number,
): string {
  //instrumentArrays is expected to be passed in the uniformed Hihat-HTom-Snare-LTom-Kick order
  const instrumentTypeEnums = [
    InstrumentTypeEnum.Hihat,
    InstrumentTypeEnum.HTom,
    InstrumentTypeEnum.Snare,
    InstrumentTypeEnum.LTom,
    InstrumentTypeEnum.Kick,
  ];
  let url: string = "http://localhost:3000/?";
  url +=
    "M=" + beatsPerMeasure + "-" + noteValue + "&" + "N=" + "1-" + subdivision;
  const parameter: string[] = ["H", "HT", "S", "LT", "K"];
  for (let i = 0; i < instrumentArrays.length; i++) {
    url += "&" + parameter[i] + "=";
    for (let k = 0; k < instrumentArrays[i].current.length; k++) {
      if (instrumentArrays[i].current[k]) {
        url += instrumentTypeEnums[i].getByString(
          instrumentArrays[i].current[k],
        );
      } else {
        url += "-";
      }
    }
  }
  return url;
}
