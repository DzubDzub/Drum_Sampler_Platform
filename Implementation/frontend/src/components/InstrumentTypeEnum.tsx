export class InstrumentTypeEnum {
  static Hihat = class {
    static off: string = "";
    static Closed: string = "!style=x!^g";
    static Open: string = '!style=x!"O"g';
    static Accented: string = "!style=x!D";
    static Click: string = "!style=x!D";
    static Ride: string = "!style=x!f";
    static RideBell: string = "!style=harmonic!f";
    static Crash: string = "!style=x!a";
    static get(index: number): string {
      const values = [
        this.off,
        this.Closed,
        this.Open,

        this.Accented,
        this.Click,
        this.Ride,
        this.RideBell,
        this.Crash,
      ];
      return values[index] ?? "";
    }
    static getByString(instrument: string): string {
      const values = [
        this.off,
        this.Closed,
        this.Open,
        this.Accented,
        this.Click,
        this.Ride,
        this.RideBell,
        this.Crash,
      ];
      const index = values.indexOf(instrument);
      return index === -1 ? "0" : String(index); //Default to "0" (off) if not found
    }
  };

  static HTom = class {
    static off = "";
    static Regular = "e";
    static Flam = "{e}e";

    static get(index: number): string {
      return [this.off, this.Regular, this.Flam][index] ?? "";
    }
    static getByString(instrument: string): string {
      const values = [this.off, this.Regular, this.Flam];
      const index: number = values.indexOf(instrument);
      return index === -1 ? "0" : String(index);
    }
  };

  static Snare = class {
    static off = "";
    static Regular = "c";
    static Ghost = "!style=harmonic!c";
    static Flam = "{c}c";
    static Click = "!style=x!c";
    static Buzz = "~c";

    static get(index: number): string {
      return (
        [this.off, this.Regular, this.Ghost, this.Flam, this.Click, this.Buzz][
          index
        ] ?? ""
      );
    }
    static getByString(instrument: string): string {
      const values = [
        this.off,
        this.Regular,
        this.Ghost,
        this.Flam,
        this.Click,
        this.Buzz,
      ];
      const index: number = values.indexOf(instrument);
      return index === -1 ? "0" : String(index);
    }
  };

  static LTom = class {
    static off = "";
    static Regular = "A";
    static Flam = "{A}A";

    static get(index: number): string {
      return [this.off, this.Regular, this.Flam][index] ?? "";
    }
    static getByString(instrument: string): string {
      const values = [this.off, this.Regular, this.Flam];
      const index: number = values.indexOf(instrument);
      return index === -1 ? "0" : String(index);
    }
  };

  static Kick = class {
    static off = "";
    static Regular = "F";

    static get(index: number): string {
      return [this.off, this.Regular][index] ?? "";
    }
    static getByString(instrument: string): string {
      const values = [this.off, this.Regular];
      const index: number = values.indexOf(instrument);
      return index === -1 ? "0" : String(index);
    }
  };
}
