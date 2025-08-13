import React, { useEffect, useState } from "react";
import {
  LuDrum,
  LuFileText,
  LuSend,
  LuGhost,
  LuBanana,
  LuBell,
  LuEraser,
  LuDice5,
  LuChevronDown,
} from "react-icons/lu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { InstrumentTypeEnum } from "./InstrumentTypeEnum";
import useInstrumentModeStore from "stores/InstrumentModeStore";
import SubdivisionDropdown from "components/SubdivisionDropdown";

function Sidebar() {
  const [cursor, setCursor] = useState("default");
  const { setSelectedInstrumentMode } = useInstrumentModeStore();
  const { setSelectedInstrument } = useInstrumentModeStore();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCursor("default");
        setSelectedInstrumentMode("");
        setSelectedInstrument("");
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const hiHatModes = [
    {
      label: "Closed",
      Icon: "/images/hihat.svg",
      onSelect: () => {
        setSelectedInstrument(InstrumentTypeEnum.Hihat);
        setSelectedInstrumentMode(InstrumentTypeEnum.Hihat.Closed);
      },
    },
    {
      label: "Open",
      Icon: "/images/hihat.svg",
      onSelect: () => {
        setSelectedInstrumentMode(InstrumentTypeEnum.Hihat.Open);
        setSelectedInstrument(InstrumentTypeEnum.Hihat);
      },
    },
    {
      label: "Accent",
      Icon: "/images/hihat.svg",
      onSelect: () => {
        setSelectedInstrumentMode(InstrumentTypeEnum.Hihat.Accented);
        setSelectedInstrument(InstrumentTypeEnum.Hihat);
      },
    },
    {
      label: "Crash",
      Icon: "/images/crash.png",
      onSelect: () => {
        setSelectedInstrumentMode(InstrumentTypeEnum.Hihat.Crash);
        setSelectedInstrument(InstrumentTypeEnum.Hihat);
      },
    },
    {
      label: "Ride",
      Icon: "/images/ride.png",
      onSelect: () => {
        setSelectedInstrumentMode(InstrumentTypeEnum.Hihat.Ride);
        setSelectedInstrument(InstrumentTypeEnum.Hihat);
      },
    },
  ];

  const snareModes = [
    {
      label: "Normal",
      Icon: "/images/crash.png",
      onSelect: () => {
        setSelectedInstrumentMode(InstrumentTypeEnum.Snare.Regular);
        setSelectedInstrument(InstrumentTypeEnum.Snare);
      },
    },
    {
      label: "Ghost",
      Icon: "/images/crash.png",
      onSelect: () => {
        setSelectedInstrumentMode(InstrumentTypeEnum.Snare.Ghost);
        setSelectedInstrument(InstrumentTypeEnum.Snare);
      },
    },
    {
      label: "Rim Click",
      Icon: "/images/crash.png",
      onSelect: () => {
        setSelectedInstrumentMode(InstrumentTypeEnum.Snare.Click);
        setSelectedInstrument(InstrumentTypeEnum.Snare);
      },
    },
    {
      label: "Buzz",
      Icon: "/images/crash.png",
      onSelect: () => {
        setSelectedInstrumentMode(InstrumentTypeEnum.Snare.Buzz);
        setSelectedInstrument(InstrumentTypeEnum.Snare);
      },
    },
    {
      label: "Flam",
      Icon: "/images/crash.png",
      onSelect: () => {
        setSelectedInstrumentMode(InstrumentTypeEnum.Snare.Flam);
        setSelectedInstrument(InstrumentTypeEnum.Snare);
      },
    },
  ];

  const tomModes = [
    {
      label: "Normal",
      Icon: "/images/tom.png",
      onSelect: () => {
        setSelectedInstrumentMode(InstrumentTypeEnum.HTom.Regular);
        setSelectedInstrument(InstrumentTypeEnum.HTom);
      },
    },
    {
      label: "Flam",
      Icon: "/images/tom.png",
      onSelect: () => {
        setSelectedInstrumentMode(InstrumentTypeEnum.HTom.Flam);
        setSelectedInstrument(InstrumentTypeEnum.HTom);
      },
    },
  ];

  const copyURL = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        alert("URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  };

  return (
    <div className="sidebar min-w-full pt-10 lg:min-w-[250px] lg:max-w-[300px] w-full lg:w-auto bg-zinc-100">
      <h2 className="mb-2 text-xl font-bold text-center">Strefa Perkusistów</h2>
      {/* Sidebar block */}
      <div className="pl-8">
        <div className="flex flex-col gap-3 mt-10">
          <h3 className="uppercase text-[0.75rem] font-semibold">EXPORT</h3>
          <div className="flex gap-3 text-base items-center text-gray-500 hover:text-black hover:cursor-pointer w-[12rem] px-3 rounded">
            <LuFileText size={20} />
            PDF Download
          </div>

          <div
            className="flex gap-3 text-base items-center text-gray-500 hover:text-black hover:cursor-pointer w-[12rem] px-3 rounded"
            onClick={copyURL}
          >
            <LuSend size={20} />
            Share Groove
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-8">
          <h3 className="uppercase text-[0.75rem] font-semibold">MODES</h3>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex justify-between items-center gap-3 text-base text-gray-500 hover:text-black hover:cursor-pointer w-[12rem] px-3 rounded">
                <div className="flex items-center gap-3">
                  <img src={"/images/hihat.svg"} className="w-[20px]" />
                  HiHat Modes
                </div>
                <LuChevronDown size={15} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {hiHatModes.map(({ label, Icon, onSelect }) => (
                <DropdownMenuItem
                  key={label}
                  className="focus:outline-none"
                  onSelect={onSelect}
                >
                  <img src={Icon} alt={label} className="w-5 h-5 mr-2" />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex justify-between items-center gap-3 text-base text-gray-500 hover:text-black hover:cursor-pointer w-[12rem] px-3 rounded">
                <div className="flex items-center gap-3">
                  <img src={"/images/snare.svg"} className="w-[20px]" />
                  Snare Modes
                </div>
                <LuChevronDown size={15} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {snareModes.map(({ label, Icon, onSelect }) => (
                <DropdownMenuItem
                  key={label}
                  className="focus:outline-none"
                  onSelect={onSelect}
                >
                  <img src={Icon} alt={label} className="w-5 h-5 mr-2" />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <div className="flex justify-between items-center gap-3 text-base text-gray-500 hover:text-black hover:cursor-pointer w-[12rem] px-3 rounded">
                <div className="flex items-center gap-3">
                  <img src={"/images/floor-tom.png"} className="w-[20px]" />
                  Tom Modes
                </div>
                <LuChevronDown size={15} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {tomModes.map(({ label, Icon, onSelect }) => (
                <DropdownMenuItem
                  key={label}
                  className="focus:outline-none"
                  onSelect={onSelect}
                >
                  <img src={Icon} alt={label} className="w-5 h-5 mr-2" />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex flex-col gap-3 mt-10">
          <h3 className="uppercase text-[0.75rem] font-semibold">GROOVE</h3>
          <div className="flex gap-3 text-base items-center text-gray-500 hover:text-black hover:cursor-pointer w-[12rem] px-3 rounded">
            <LuEraser size={20} />
            Clear All
          </div>
          <div className="flex gap-3 text-base items-center text-gray-500 hover:text-black hover:cursor-pointer w-[12rem] px-3 rounded">
            <LuDice5 size={20} />
            Randomize
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
